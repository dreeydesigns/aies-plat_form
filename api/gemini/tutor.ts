import { GoogleGenAI } from '@google/genai';

type ApiRequest = { method?: string; body?: any };
type ApiResponse = { status: (status: number) => ApiResponse; json: (body: unknown) => void };

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, lessonTitle, lessonContent, language = 'English', history = [] } = req.body ?? {};

  if (!query || !lessonContent) {
    return res.status(400).json({ error: 'Query and lesson content are required.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI Tutor is not configured. Set GEMINI_API_KEY.' });
  }

  const systemInstruction = `You are Hadithi, an encouraging, highly knowledgeable AI Socratic Tutor for the AIES (Alternative International Education System) platform.
Your goal is to guide students to understand concepts deeply through thoughtful explanations, real-world examples, and Socratic guiding questions.

STUDENT & LESSON CONTEXT:
- Active Lesson: "${lessonTitle || 'Current Lesson'}"
- Lesson Material (Grounding Context):
${lessonContent}

INSTRUCTIONS:
1. Ground your answers strictly in the lesson material supplied above.
2. If a student asks a direct answer to a quiz or exam question, DO NOT give the direct answer. Instead, explain the underlying rule or ask a guiding question to lead them to the answer.
3. Language Instruction: Respond in ${language}.
4. Be friendly, inspiring, clear, and age-appropriate.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const formattedHistory = (history || []).map((h: any) => `${h.role === 'user' ? 'Student' : 'Tutor'}: ${h.text}`).join('\n');
    const fullPrompt = `${systemInstruction}\n\nRecent Conversation:\n${formattedHistory}\n\nStudent Question: ${query}\n\nTutor Answer:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
    });

    res.status(200).json({ answer: response.text });
  } catch (error: any) {
    console.error('AI Tutor API Error:', error);
    res.status(500).json({ error: error?.message || 'Failed to get answer from AI Tutor.' });
  }
}
