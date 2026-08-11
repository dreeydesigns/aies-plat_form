import { GoogleGenAI } from '@google/genai';

type RequestLike = { method?: string; body?: Buffer; headers: Record<string, string | string[] | undefined> };
type ResponseLike = { status: (status: number) => ResponseLike; json: (body: unknown) => void };
const allowedTypes = new Set(['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation']);

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const mimeType = String(req.headers['x-document-mime'] || '');
    if (!allowedTypes.has(mimeType) || !Buffer.isBuffer(req.body)) return res.status(400).json({ error: 'Upload a PDF, DOCX, or PPTX file.' });
    if (req.body.length > 4_000_000) return res.status(413).json({ error: 'The document is larger than 4 MB.' });
    const brief = JSON.parse(Buffer.from(String(req.headers['x-curriculum-brief'] || ''), 'base64url').toString('utf8'));
    if (!process.env.GEMINI_API_KEY) return res.status(503).json({ error: 'Course AI is not configured.' });
    const prompt = `You are an expert curriculum designer. Read the supplied source document and create a complete, accurate course. Do not invent facts not supported by the source. Adapt it to: ${JSON.stringify(brief)}. Return ONLY valid JSON matching {"title":"string","description":"string","lessons":[{"title":"string","content":"string","type":"reading"|"video"|"vr"|"quiz","quiz":null|{"title":"string","questions":[{"text":"string","options":["string","string","string","string"],"correctAnswer":0}]} }]}. Create 4-8 sequenced lessons with an introduction, applied lesson, and final 5-10 question quiz.`;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({ model: 'gemini-3.6-flash', contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: req.body.toString('base64') } }, { text: prompt }] }], config: { responseMimeType: 'application/json' } });
    const course = JSON.parse(response.text || '{}');
    if (!course.title || !Array.isArray(course.lessons) || !course.lessons.length) throw new Error('The AI returned an incomplete course.');
    res.status(200).json(course);
  } catch (error: any) {
    console.error('Course generation failed:', error);
    res.status(500).json({ error: error?.message || 'Course generation failed. Please try again.' });
  }
}
