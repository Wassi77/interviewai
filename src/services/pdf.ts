import { jsPDF } from 'jspdf';
import { InterviewReport } from '../types';

export function generatePDFReport(report: InterviewReport): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      // Header accent bar on new pages
      doc.setFillColor(30, 58, 138); // Deep Blue
      doc.rect(margin, y, contentWidth, 3, 'F');
      y += 15;
    }
  };

  // Header Banner
  doc.setFillColor(30, 58, 138); // Deep blue primary
  doc.rect(0, 0, pageWidth, 75, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('InterviewAce AI', margin, 42);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Mock Interview & AI Evaluation Report', margin, 60);

  doc.setFontSize(9);
  const formattedDate = new Date(report.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${formattedDate}`, pageWidth - margin - 140, 60);

  y = 95;

  // Overview Card
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(margin, y, contentWidth, 75, 8, 8, 'F');

  doc.setTextColor(17, 24, 39);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(`Role: ${report.config.role}`, margin + 15, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(`Difficulty: ${report.config.difficulty}`, margin + 15, y + 45);
  doc.text(`Type: ${report.config.type}`, margin + 140, y + 45);
  doc.text(`Language: ${report.config.language}`, margin + 260, y + 45);
  doc.text(`Questions: ${report.config.questionCount}`, margin + 380, y + 45);

  // Overall Score Badge
  doc.setFillColor(124, 58, 237); // Purple accent
  doc.roundedRect(pageWidth - margin - 110, y + 12, 95, 50, 6, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(`${report.overallScore}/100`, pageWidth - margin - 98, y + 36);
  doc.setFontSize(8);
  doc.text('OVERALL SCORE', pageWidth - margin - 100, y + 50);

  y += 95;

  // Score Breakdown
  checkPageBreak(120);
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Score Breakdown (Out of 10)', margin, y);
  y += 15;

  const breakdownItems = [
    { label: 'Communication', score: report.breakdown.communication },
    { label: 'Technical Knowledge', score: report.breakdown.technicalKnowledge },
    { label: 'Confidence', score: report.breakdown.confidence },
    { label: 'Problem Solving', score: report.breakdown.problemSolving },
    { label: 'Grammar', score: report.breakdown.grammar },
    { label: 'Professionalism', score: report.breakdown.professionalism },
  ];

  const colWidth = (contentWidth - 20) / 2;
  breakdownItems.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const itemX = margin + col * (colWidth + 20);
    const itemY = y + row * 28;

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(itemX, itemY, colWidth, 22, 4, 4, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(item.label, itemX + 8, itemY + 15);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text(`${item.score}/10`, itemX + colWidth - 35, itemY + 15);
  });

  y += Math.ceil(breakdownItems.length / 2) * 28 + 20;

  // Professional Summary
  if (report.professionalSummary) {
    checkPageBreak(80);
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Professional Summary', margin, y);
    y += 15;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    const summaryLines = doc.splitTextToSize(report.professionalSummary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 14 + 20;
  }

  // Strengths & Weaknesses
  checkPageBreak(120);
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Strengths & Areas for Improvement', margin, y);
  y += 15;

  const halfWidth = (contentWidth - 15) / 2;

  // Strengths Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, halfWidth, 100, 6, 6, 'FD');
  doc.setTextColor(22, 101, 52);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Key Strengths', margin + 10, y + 18);

  let strY = y + 34;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(21, 128, 61);
  report.strengths.forEach((s) => {
    const lines = doc.splitTextToSize(`• ${s}`, halfWidth - 20);
    doc.text(lines, margin + 10, strY);
    strY += lines.length * 12;
  });

  // Weaknesses Box
  const weakX = margin + halfWidth + 15;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(weakX, y, halfWidth, 100, 6, 6, 'FD');
  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Areas to Improve', weakX + 10, y + 18);

  let weakY = y + 34;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(185, 28, 28);
  report.weaknesses.forEach((w) => {
    const lines = doc.splitTextToSize(`• ${w}`, halfWidth - 20);
    doc.text(lines, weakX + 10, weakY);
    weakY += lines.length * 12;
  });

  y += 115;

  // Questions & Answers Section
  checkPageBreak(60);
  doc.setTextColor(30, 58, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Question-by-Question AI Evaluation', margin, y);
  y += 20;

  report.qaList.forEach((item, i) => {
    checkPageBreak(120);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);

    const startY = y;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    const qHeader = `Q${i + 1}: ${item.question}`;
    const qLines = doc.splitTextToSize(qHeader, contentWidth - 20);

    y += qLines.length * 14 + 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const ansText = `Your Answer: "${item.userAnswer || 'No answer provided'}"`;
    const ansLines = doc.splitTextToSize(ansText, contentWidth - 20);
    y += ansLines.length * 13 + 10;

    if (item.score !== undefined) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(124, 58, 237);
      doc.text(`Score: ${item.score}/10`, margin + 10, y);
      y += 15;
    }

    if (item.feedback) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(71, 85, 105);
      const fbLines = doc.splitTextToSize(`Feedback: ${item.feedback}`, contentWidth - 20);
      y += fbLines.length * 12 + 8;
    }

    if (item.betterAnswer) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 118, 110);
      const betterLines = doc.splitTextToSize(`AI Model Answer: ${item.betterAnswer}`, contentWidth - 20);
      y += betterLines.length * 12 + 10;
    }

    const boxHeight = y - startY + 10;
    doc.roundedRect(margin, startY - 5, contentWidth, boxHeight, 6, 6, 'FD');

    // Re-render text on top of roundedRect cleanly
    let renderY = startY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text(qLines, margin + 10, renderY);
    renderY += qLines.length * 14;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(ansLines, margin + 10, renderY);
    renderY += ansLines.length * 13;

    if (item.score !== undefined) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(124, 58, 237);
      doc.text(`Score: ${item.score}/10`, margin + 10, renderY);
      renderY += 15;
    }

    if (item.feedback) {
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(71, 85, 105);
      const fbLines = doc.splitTextToSize(`Feedback: ${item.feedback}`, contentWidth - 20);
      doc.text(fbLines, margin + 10, renderY);
      renderY += fbLines.length * 12;
    }

    if (item.betterAnswer) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 118, 110);
      const betterLines = doc.splitTextToSize(`Recommended Answer: ${item.betterAnswer}`, contentWidth - 20);
      doc.text(betterLines, margin + 10, renderY);
      renderY += betterLines.length * 12;
    }

    y = startY + boxHeight + 15;
  });

  // 7-Day Roadmap
  if (report.roadmap && report.roadmap.length > 0) {
    checkPageBreak(100);
    doc.setTextColor(30, 58, 138);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('7-Day Actionable Preparation Roadmap', margin, y);
    y += 18;

    report.roadmap.forEach((dayItem) => {
      checkPageBreak(50);
      doc.setFillColor(238, 242, 255);
      doc.roundedRect(margin, y, contentWidth, 22, 4, 4, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(67, 56, 202);
      doc.text(`Day ${dayItem.day}: ${dayItem.title || dayItem.focus}`, margin + 10, y + 15);
      y += 28;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(55, 65, 81);
      dayItem.tasks.forEach((t) => {
        checkPageBreak(20);
        const taskLines = doc.splitTextToSize(`• ${t}`, contentWidth - 20);
        doc.text(taskLines, margin + 15, y);
        y += taskLines.length * 12;
      });
      y += 8;
    });
  }

  // Footer / Page numbers
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`InterviewAce AI — Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 15, {
      align: 'center',
    });
  }

  const filename = `InterviewAce_${report.config.role.replace(/[^a-zA-Z0-0]/g, '_')}_Report.pdf`;
  doc.save(filename);
}
