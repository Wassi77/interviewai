# InterviewAce AI

> **Practice Smarter. Interview with AI. Get Hired with Confidence.**

InterviewAce AI is an end-to-end, AI-powered mock interview simulator and career readiness platform. It empowers job seekers, university students, software engineers, and career changers to master job interviews through role-specific AI practice, real-time speech interaction, detailed candidate performance metrics, AI model answer rewrites, and custom 7-day preparation roadmaps.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [How to Run Locally](#how-to-run-locally)
4. [How to Deploy on Vercel](#how-to-deploy-on-vercel)
5. [Configuring AI Provider](#configuring-ai-provider)
6. [Privacy](#privacy)

---

## Features

| Feature | Description |
| :--- | :--- |
| **Role & Round Customization** | Select or type any custom job role, set difficulty, interview type, and question count |
| **Multilingual Support** | English, Urdu (script), or Roman Urdu |
| **Voice Studio** | Speech-to-text and text-to-speech for realistic mock interviews |
| **Instant AI Evaluation** | Score (1-10), feedback, model answer, and key takeaway after every answer |
| **Adaptive Questions** | Follow-up questions based on your previous answers |
| **6-Metric Breakdown** | Communication, Technical Knowledge, Confidence, Problem Solving, Grammar, Professionalism |
| **7-Day Roadmap** | Custom preparation plan targeting your weak points |
| **PDF Report** | One-click export of evaluation report |
| **Session History** | Past reports saved in browser, with retake support |
| **Dark/Light Theme** | Instant theme switching |

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 19 + TypeScript + Vite |
| **Styling** | Tailwind CSS v4 + Lucide Icons |
| **Backend** | Express.js (Node.js) |
| **AI** | Any OpenAI-compatible or Google Gemini API (configured in-app) |
| **Audio** | Web Speech API (SpeechRecognition + speechSynthesis) |
| **PDF** | jspdf |
| **Storage** | Browser localStorage |

---

## How to Run Locally

### Prerequisites

- Node.js v18+
- npm or bun

### Steps

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd interviewace-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser.

Then click the **gear icon** in the top-right to configure your AI provider (base URL, API key, model).

---

## How to Deploy on Vercel

### 1. Push to GitHub

```bash
git init
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/<user>/<repo>.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. No environment variables needed — the project already includes `vercel.json`
4. Click **Deploy**

> No need to set `GEMINI_API_KEY` or any other env vars on Vercel. Users configure their own API provider inside the app via the Settings UI.

---

## Configuring AI Provider

The app supports **any AI provider** that offers either:

- **OpenAI-compatible API** (OpenAI, Groq, OpenRouter, Together AI, DeepSeek, etc.)
- **Google Gemini API**

### How to configure

1. Click the **gear icon** in the top-right navbar
2. Pick a preset (OpenAI, Gemini, Groq, OpenRouter, Together) or enter custom values
3. Fill in:
   - **Base URL**: e.g. `https://api.openai.com/v1`
   - **API Key**: your API key
   - **Model**: e.g. `gpt-4o-mini`, `gemini-2.0-flash`, `llama-3.3-70b-versatile`
4. Click **Save Settings**

Your API key is stored in your browser's localStorage and sent only to your configured API endpoint.

### Supported providers (pre-configured presets)

| Provider | Base URL | Default Model |
| :--- | :--- | :--- |
| OpenAI | https://api.openai.com/v1 | gpt-4o-mini |
| Gemini | https://generativelanguage.googleapis.com | gemini-2.0-flash |
| Groq | https://api.groq.com/openai/v1 | llama-3.3-70b-versatile |
| OpenRouter | https://openrouter.ai/api/v1 | openai/gpt-4o-mini |
| Together AI | https://api.together.xyz/v1 | meta-llama/Llama-3.3-70B-Instruct-Turbo |

---

## Privacy

- **No registration required** — no accounts, no personal data collection
- **All data stays in your browser** — interview transcripts, scores, and reports are stored in `localStorage` only
- **Your API key is never sent to our server** — it's sent directly from your browser to your configured AI provider endpoint via our server-side proxy
- **Export or clear data anytime** — download PDF reports or clear history with one click
