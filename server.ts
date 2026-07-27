import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

function extractApiConfig(req: express.Request) {
  const bodyConfig = req.body.apiConfig;
  if (bodyConfig && bodyConfig.apiKey && bodyConfig.baseUrl && bodyConfig.model) {
    return bodyConfig;
  }
  const envKey = process.env.GEMINI_API_KEY;
  if (envKey) {
    return {
      provider: 'gemini' as const,
      baseUrl: 'https://generativelanguage.googleapis.com',
      apiKey: envKey,
      model: 'gemini-2.0-flash',
    };
  }
  return null;
}

function cleanJsonText(rawText: string): string {
  if (!rawText) return '{}';
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

async function callAI(params: {
  provider: 'openai' | 'gemini';
  baseUrl: string;
  apiKey: string;
  model: string;
  systemInstruction: string;
  contents: string;
  responseSchema?: any;
}): Promise<string> {
  const { provider, baseUrl, apiKey, model, systemInstruction, contents, responseSchema } = params;

  if (provider === 'gemini') {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'interviewace' },
      },
    });
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: responseSchema || undefined,
      },
    });
    return response.text || '';
  }

  const messages = [
    { role: 'system', content: `${systemInstruction}\n\nIMPORTANT: You MUST respond with valid JSON only. No markdown, no code fences, no backticks, no explanation. Output ONLY the raw JSON object with no wrapper.` },
    { role: 'user', content: contents },
  ];

  const body: Record<string, any> = {
    model,
    messages,
    temperature: 0.7,
    max_tokens: 8192,
  };

  const fetchUrl = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const res = await fetch(fetchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...(provider === 'openai' && baseUrl.includes('openrouter') ? { 'HTTP-Referer': 'https://interviewace.app', 'X-Title': 'InterviewAce' } : {}),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

function handleApiError(error: any, res: express.Response, contextMessage: string) {
  console.error(`Error in ${contextMessage}:`, error);
  const errMsg = error?.message || String(error);
  const lowerMsg = errMsg.toLowerCase();

  if (
    lowerMsg.includes('429') ||
    lowerMsg.includes('quota') ||
    lowerMsg.includes('resource_exhausted') ||
    lowerMsg.includes('rate_limit')
  ) {
    return res.status(429).json({
      error: 'API rate limit or quota exceeded. Please wait a moment or check your provider plan limits.',
    });
  }

  if (
    lowerMsg.includes('api key') ||
    lowerMsg.includes('api_key') ||
    lowerMsg.includes('unauthorized') ||
    lowerMsg.includes('unauthenticated') ||
    lowerMsg.includes('permission_denied') ||
    lowerMsg.includes('forbidden') ||
    lowerMsg.includes('401') ||
    lowerMsg.includes('403') ||
    lowerMsg.includes('invalid_api_key') ||
    lowerMsg.includes('auth')
  ) {
    return res.status(401).json({
      error: 'Authentication error: Please verify your API key is valid and has access to the selected model. Update it in Settings.',
    });
  }

  if (
    lowerMsg.includes('not found') ||
    lowerMsg.includes('model not found') ||
    lowerMsg.includes('does not exist') ||
    lowerMsg.includes('structured-outputs') ||
    lowerMsg.includes('does not support')
  ) {
    return res.status(400).json({
      error: `Model does not support structured output. Choose a different model, or if using OpenRouter try adding a "-json" suffix (e.g. "gpt-4o-mini" stays same, but "claude-3-haiku" → "claude-3-haiku-json").`,
    });
  }

  return res.status(500).json({
    error: errMsg || `An error occurred while ${contextMessage}.`,
  });
}

function buildLangInstruction(language?: string): string {
  if (language === 'Urdu') return 'Urdu (in Urdu script)';
  if (language === 'Roman Urdu') return 'Roman Urdu (Urdu words written using Roman / English script)';
  return 'English';
}

// 1. Start Interview Route
app.post(['/api/interview/start', '/interview/start'], async (req, res) => {
  try {
    const { role, difficulty, language, type, questionCount } = req.body;
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const apiConfig = extractApiConfig(req);
    if (!apiConfig) {
      return res.status(400).json({
        error: 'API not configured. Open Settings (gear icon) and set your API provider details (base URL, API key, model).',
      });
    }

    const langInstruction = buildLangInstruction(language);
    const systemInstruction = `You are InterviewAce AI, an expert, encouraging, and realistic job interviewer.
Your task is to conduct a mock interview for the role: "${role}".
Difficulty Level: ${difficulty}.
Interview Type: ${type} (Technical, HR/Behavioral, or Mixed).
Language requested: ${langInstruction}. Total Questions planned: ${questionCount}.

Generate Question 1 of ${questionCount}.
Rules:
- The question must be realistic, role-specific, and tailored to the requested difficulty level (${difficulty}).
- Ask ONLY ONE question.
- Write the question in ${langInstruction}.
- Keep tone professional, welcoming, and clear.
- Respond in valid JSON with fields: question (string), contextNote (optional string).`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'The first interview question' },
        contextNote: { type: Type.STRING, description: 'Optional brief tip or context' },
      },
      required: ['question'],
    };

    const text = await callAI({
      ...apiConfig,
      systemInstruction,
      contents: `Generate the first interview question for a candidate applying for: ${role}`,
      responseSchema,
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(cleanJsonText(text));
    } catch (e) {
      console.warn('JSON parse error in start interview:', e);
    }

    return res.json({
      questionIndex: 0,
      question: parsed.question || `Tell me about yourself and your background related to ${role}.`,
      contextNote: parsed.contextNote || 'Focus on highlighting your relevant experience and key technical skills.',
    });
  } catch (error: any) {
    return handleApiError(error, res, 'starting interview');
  }
});

// 2. Evaluate Step & Next Question Route
app.post(['/api/interview/evaluate-step', '/interview/evaluate-step'], async (req, res) => {
  try {
    const { config, currentQuestionIndex, question, answer, previousQA } = req.body;
    const { role, difficulty, language, type, questionCount } = config || {};

    const apiConfig = extractApiConfig(req);
    if (!apiConfig) {
      return res.status(400).json({
        error: 'API not configured. Open Settings (gear icon) and set your API provider details.',
      });
    }

    const langInstruction = buildLangInstruction(language);
    const isLast = currentQuestionIndex + 1 >= Number(questionCount);

    const systemInstruction = `You are InterviewAce AI, an expert job interviewer evaluating a candidate's response for the role of ${role}.
Difficulty: ${difficulty}. Type: ${type}. Language: ${langInstruction}.
Current Question Number: ${currentQuestionIndex + 1} out of ${questionCount}.

Evaluate the candidate's answer to the current question:
Question: "${question}"
Candidate Answer: "${answer || 'No answer provided / candidate skipped'}"

Your evaluation must include:
1. score (integer from 1 to 10 based on depth, accuracy, relevance, and clarity)
2. feedback (constructive, encouraging feedback highlighting what was done well and what was missing or needs improvement)
3. betterAnswer (a professionally rewritten, high-scoring model answer in ${langInstruction} that the user could study and adopt)
4. keyTakeaway (a quick 1-sentence tip to remember)
${!isLast ? `5. nextQuestion (the NEXT interview question #${currentQuestionIndex + 2} of ${questionCount} for ${role}, maintaining natural conversational flow based on previous responses)` : ''}

Language requirement: Provide all text (feedback, betterAnswer, nextQuestion) in ${langInstruction}.
Respond in valid JSON only.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: 'Score from 1 to 10' },
        feedback: { type: Type.STRING, description: 'Detailed constructive feedback' },
        betterAnswer: { type: Type.STRING, description: 'Professional rewritten ideal answer' },
        keyTakeaway: { type: Type.STRING, description: 'Key takeaway or tip' },
        nextQuestion: { type: Type.STRING, description: 'Next interview question if not last question' },
      },
      required: ['score', 'feedback', 'betterAnswer', 'keyTakeaway'],
    };

    const text = await callAI({
      ...apiConfig,
      systemInstruction,
      contents: `Evaluate candidate's answer for question ${currentQuestionIndex + 1}: "${question}". Previous QA history: ${JSON.stringify(previousQA || [])}`,
      responseSchema,
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(cleanJsonText(text));
    } catch (e) {
      console.warn('JSON parse error in evaluate-step:', e);
    }

    return res.json({
      score: typeof parsed.score === 'number' ? parsed.score : 7,
      feedback: parsed.feedback || 'Good attempt. Focus on providing specific structured examples.',
      betterAnswer: parsed.betterAnswer || 'A structured response highlighting key achievements and technologies used.',
      keyTakeaway: parsed.keyTakeaway || 'Use the STAR method (Situation, Task, Action, Result) for structured answers.',
      nextQuestion: isLast ? null : parsed.nextQuestion || `What is a challenging project you worked on as a ${role}?`,
    });
  } catch (error: any) {
    return handleApiError(error, res, 'evaluating step');
  }
});

// 3. Final Overall Report Route
app.post(['/api/interview/evaluate-final', '/interview/evaluate-final'], async (req, res) => {
  try {
    const { config, qaList } = req.body;
    const { role, difficulty, language, type, questionCount } = config || {};

    const apiConfig = extractApiConfig(req);
    if (!apiConfig) {
      return res.status(400).json({
        error: 'API not configured. Open Settings (gear icon) and set your API provider details.',
      });
    }

    const langInstruction = buildLangInstruction(language);

    const systemInstruction = `You are InterviewAce AI, an elite talent acquisition specialist and career mentor.
Analyze the complete interview session for candidate applying as: "${role}".
Difficulty: ${difficulty}. Type: ${type}. Language: ${langInstruction}. Total Questions: ${questionCount}.

Here is the complete transcript of Questions, Candidate Answers, and individual question scores:
${JSON.stringify(qaList, null, 2)}

Provide a comprehensive, high-value final evaluation report containing:
1. overallScore (1 to 100 integer)
2. breakdown:
   - communication (1 to 10)
   - technicalKnowledge (1 to 10)
   - confidence (1 to 10)
   - problemSolving (1 to 10)
   - grammar (1 to 10)
   - professionalism (1 to 10)
3. strengths: array of 3-5 specific, encouraging bullet points
4. weaknesses: array of 3-5 clear, constructive improvement areas
5. professionalSummary: detailed executive summary paragraph on the candidate's interview performance and job readiness
6. roadmap: a 7-Day structured preparation plan (Array of 7 items, day 1 through 7). Each item must have:
   - day: number (1-7)
   - title: string (e.g., "Day 1: Technical Core Fundamentals")
   - focus: string
   - tasks: array of 3-4 specific actionable study/practice items
7. suggestedTopics: array of 5 key concepts/skills to study further for ${role}
8. recommendedQuestions: array of 4-6 recommended practice interview questions for further self-prep.

Ensure feedback tone is empowering, realistic, and highly educational. Respond in ${langInstruction}.
Respond in valid JSON only.`;

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER, description: 'Overall score 1-100' },
        breakdown: {
          type: Type.OBJECT,
          properties: {
            communication: { type: Type.INTEGER },
            technicalKnowledge: { type: Type.INTEGER },
            confidence: { type: Type.INTEGER },
            problemSolving: { type: Type.INTEGER },
            grammar: { type: Type.INTEGER },
            professionalism: { type: Type.INTEGER },
          },
          required: ['communication', 'technicalKnowledge', 'confidence', 'problemSolving', 'grammar', 'professionalism'],
        },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        professionalSummary: { type: Type.STRING },
        roadmap: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.INTEGER },
              title: { type: Type.STRING },
              focus: { type: Type.STRING },
              tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['day', 'title', 'focus', 'tasks'],
          },
        },
        suggestedTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['overallScore', 'breakdown', 'strengths', 'weaknesses', 'professionalSummary', 'roadmap', 'suggestedTopics', 'recommendedQuestions'],
    };

    const text = await callAI({
      ...apiConfig,
      systemInstruction,
      contents: `Generate final interview evaluation report for ${role}`,
      responseSchema,
    });

    let parsed: any = null;
    try {
      parsed = JSON.parse(cleanJsonText(text));
    } catch (e) {
      console.warn('JSON parse error in final evaluation:', e);
    }

    if (!parsed || typeof parsed !== 'object' || !parsed.overallScore) {
      parsed = {
        overallScore: 78,
        breakdown: {
          communication: 8, technicalKnowledge: 7, confidence: 8,
          problemSolving: 8, grammar: 8, professionalism: 8,
        },
        strengths: ['Clear articulate answers', 'Good problem solving structure', 'Professional attitude'],
        weaknesses: ['Add more quantifiable achievements', 'Elaborate further on architecture decisions'],
        professionalSummary: `Solid interview performance showing strong fundamental skills and readiness for ${role}.`,
        roadmap: [
          { day: 1, title: 'Day 1: Core Fundamentals', focus: 'Review core concepts', tasks: ['Review key definitions', 'Practice basic questions'] },
          { day: 2, title: 'Day 2: Deep Technical Concepts', focus: 'System architecture', tasks: ['Study key design patterns', 'Review previous project code'] },
          { day: 3, title: 'Day 3: Behavioral Prep', focus: 'STAR Method', tasks: ['Prepare 3 STAR stories', 'Practice delivery aloud'] },
          { day: 4, title: 'Day 4: Problem Solving', focus: 'Scenario challenges', tasks: ['Solve 2 scenario problems', 'Explain thought process clearly'] },
          { day: 5, title: 'Day 5: Mock Interview', focus: 'Time-bound practice', tasks: ['Record a mock session', 'Identify areas to improve'] },
          { day: 6, title: 'Day 6: Advanced Topics', focus: 'Best practices & Optimization', tasks: ['Study industry standard practices', 'Review performance optimizations'] },
          { day: 7, title: 'Day 7: Final Polish', focus: 'Confidence & Strategy', tasks: ['Prepare questions for interviewer', 'Rest and prepare mentally'] },
        ],
        suggestedTopics: ['Core Architecture', 'Performance Optimization', 'Error Handling', 'Best Practices'],
        recommendedQuestions: [
          `How do you handle technical disagreements in a project?`,
          `What is the most complex technical issue you solved?`,
          `How do you keep your technical skills updated?`,
        ],
      };
    }

    return res.json(parsed);
  } catch (error: any) {
    return handleApiError(error, res, 'final evaluation');
  }
});

export default app;

if (!process.env.VERCEL) {
  async function startServer() {
    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`InterviewAce AI server listening on http://0.0.0.0:${PORT}`);
    });
  }

  startServer();
}
