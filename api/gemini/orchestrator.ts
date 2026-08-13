import { GoogleGenAI } from '@google/genai';

type ApiRequest = { method?: string; body?: any };
type ApiResponse = { status: (status: number) => ApiResponse; json: (body: unknown) => void };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { eventType, studentId, studentName, concept, userQuery, lessonTitle, lessonContent, priorCaseMemory } = req.body ?? {};

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI Orchestrator API key missing.' });
  }

  const systemInstruction = `You are the AIES Orchestrator Agent (Master Learning Brain).
Your role is to coordinate specialist agents (Diagnostician, Pedagogy Research, Socratic Tutor, Content Curator) to analyze student queries and misconceptions.

CONTEXT:
- Student: ${studentName || 'Student'} (ID: ${studentId || 'unknown'})
- Active Concept: "${concept || lessonTitle || 'General Topic'}"
- Lesson Material: ${lessonContent || 'No lesson text provided.'}
- Prior Case-Memory Strategy Found: ${priorCaseMemory ? JSON.stringify(priorCaseMemory) : 'None'}

INSTRUCTIONS:
1. Provide a Socratic, encouraging response that guides the student to solve the problem or overcome their misconception.
2. If prior case-memory exists, incorporate its highest-success remediation approach.
3. Compute an internal confidence score (0.00 to 1.00) based on how well the case-memory or lesson text addresses this question.
4. Output valid JSON in the exact format:
{
  "response": "Your Socratic answer text...",
  "diagnosedMisconception": "Short description of what student is confusing",
  "recommendedStrategy": "Strategy name used",
  "confidenceScore": 0.85,
  "requiresTeacherEscalation": false
}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const fullPrompt = `${systemInstruction}\n\nStudent Input: ${userQuery}\n\nStructured JSON Response:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    const rawText = response.text || '';
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Orchestrator API Error:', error);
    res.status(500).json({
      response: "I am examining this concept using our lesson materials. Let us break down the core principle together.",
      diagnosedMisconception: "General conceptual confusion",
      recommendedStrategy: "Socratic Step-by-Step Breakdown",
      confidenceScore: 0.65,
      requiresTeacherEscalation: true
    });
  }
}
