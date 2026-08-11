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
    const prompt = `You are an expert curriculum designer and plain-language education writer. Read the supplied source document and create an accurate, easy-to-understand course. Do not invent facts not supported by the source.

Interpret all seven teacher answers as learner needs, even if they are short, informal, misspelled, or overlap. Rephrase and organize the content for the stated age, level, goals, duration, delivery style, accessibility, and language needs. If the brief specifies a local, native, or international language (such as Swahili, Yoruba, Zulu, Amharic, French, Spanish, Portuguese, Arabic, Hindi, Chinese, English, etc.), generate the entire course in that language.

STEM & MATHEMATICAL FORMATTING:
For Physics, Math, Chemistry, Biology, and all STEM courses, write all equations, chemical reactions, units, figures, and symbols using standard Markdown and KaTeX LaTeX math notation:
- Use $...$ for inline math (e.g., $x^2 + y^2 = r^2$, $\\Delta < 0$, $H_2O$, $v = u + at$).
- Use $$...$$ on separate lines for block equations (e.g., $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$).
- Do NOT escape dollar signs with backslashes (never write \\$).
- Do NOT output bare LaTeX commands without wrapping them in $ or $$.

Every reading lesson must be well formatted using Markdown on separate lines in this order: ## What you will learn; a short friendly introduction; ## Key idea; ## Worked example; ## Try it yourself; ## Remember. Use short paragraphs and bullet lists. Never put a heading in the middle of a sentence. Provide complete, student-ready explanations—not notes or an outline.

Return ONLY valid JSON matching {"title":"string","description":"string","lessons":[{"title":"string","content":"string","type":"reading"|"video"|"vr"|"quiz","quiz":null|{"title":"string","questions":[{"text":"string","options":["string","string","string","string"],"correctAnswer":0}]} }]}. Create 4-8 sequenced lessons with an introduction, applied lesson, and final 5-10 question quiz.`;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const request = { contents: [{ role: 'user' as const, parts: [{ inlineData: { mimeType, data: req.body.toString('base64') } }, { text: prompt }] }], config: { responseMimeType: 'application/json' as const } };
    let response: any;
    let lastError: any;
    // Retry transient capacity errors first, then use the lighter current Flash model.
    for (const model of ['gemini-3.6-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite']) {
      try {
        response = await ai.models.generateContent({ model, ...request });
        break;
      } catch (error: any) {
        lastError = error;
        if (!String(error?.message || '').includes('503')) throw error;
        await new Promise(resolve => setTimeout(resolve, model === 'gemini-3.5-flash-lite' ? 0 : 1_500));
      }
    }
    if (!response) throw lastError || new Error('Course AI is temporarily unavailable.');
    const course = JSON.parse(response.text || '{}');
    if (!course.title || !Array.isArray(course.lessons) || !course.lessons.length) throw new Error('The AI returned an incomplete course.');
    res.status(200).json(course);
  } catch (error: any) {
    console.error('Course generation failed:', error);
    res.status(500).json({ error: error?.message || 'Course generation failed. Please try again.' });
  }
}
