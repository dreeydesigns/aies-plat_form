import { GoogleGenAI } from '@google/genai';

type ApiRequest = { method?: string; body?: any };
type ApiResponse = { status: (status: number) => ApiResponse; json: (body: unknown) => void };

const MAX_DOCUMENT_BYTES = 10_000_000;
const allowedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { document, brief } = req.body ?? {};
  if ((!document?.sourceUrl && !document?.base64) || !document?.mimeType || !document?.name || !brief) {
    return res.status(400).json({ error: 'A document and all curriculum brief answers are required.' });
  }
  if (!allowedMimeTypes.has(document.mimeType)) {
    return res.status(400).json({ error: 'Upload a PDF, DOCX, or PPTX file.' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ error: 'Course AI is not configured. Set GEMINI_API_KEY in Vercel.' });
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are an expert curriculum designer. Read the supplied source document and create a complete, accurate course. Do not invent facts that are not supported by the source. Adapt language, examples, pacing, assessment complexity, and activities to this brief:
${JSON.stringify(brief)}

LANGUAGE & ACCESSIBILITY INSTRUCTIONS:
- Recognize and respect any language requested in the brief or present in the source document (native, local, regional, or international languages such as Swahili, Amharic, Yoruba, Zulu, French, Spanish, Portuguese, Arabic, Hindi, Chinese, English, etc.). Write all titles, descriptions, and content in that language.

STEM & MATHEMATICAL FORMATTING INSTRUCTIONS:
- For Math, Physics, Chemistry, Biology, and all STEM subjects, render all formulas, equations, symbols, and figures cleanly using standard Markdown and KaTeX LaTeX math delimiters:
  * Inline math: use single dollar signs $...$ (e.g. $x^2 + y^2 = r^2$, $\\Delta < 0$, $v = u + at$, $H_2O$).
  * Display equations: use double dollar signs $$...$$ on separate lines (e.g. $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$).
  * NEVER escape dollar signs as \\$ in math blocks.
  * NEVER leave bare LaTeX commands like \\frac or \\sqrt without $ or $$ delimiters.

Return ONLY valid JSON matching this exact schema:
{"title":"string","description":"string","lessons":[{"title":"string","content":"string","type":"reading"|"video"|"vr"|"quiz","quiz":null|{"title":"string","questions":[{"text":"string","options":["string","string","string","string"],"correctAnswer":0}]} }]}

Create 4-8 sequenced lessons. Include an introductory lesson, at least one activity or applied lesson, and a final quiz with 5-10 questions. Lesson content must be useful, comprehensive, and ready for a student to read.`;

  try {
    let bytes: Buffer;
    if (document.sourceUrl) {
      const source = new URL(document.sourceUrl);
      if (!['firebasestorage.googleapis.com', 'storage.googleapis.com'].includes(source.hostname)) {
        return res.status(400).json({ error: 'Invalid document storage location.' });
      }
      const sourceResponse = await fetch(document.sourceUrl);
      if (!sourceResponse.ok) throw new Error('Could not retrieve the uploaded document.');
      bytes = Buffer.from(await sourceResponse.arrayBuffer());
    } else {
      bytes = Buffer.from(document.base64, 'base64');
    }
    if (bytes.length > MAX_DOCUMENT_BYTES) return res.status(413).json({ error: 'The document is too large. Upload a file smaller than 10 MB.' });
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [
        { inlineData: { mimeType: document.mimeType, data: bytes.toString('base64') } },
        { text: prompt },
      ] }],
      config: { responseMimeType: 'application/json' },
    });
    const parsed = JSON.parse(response.text ?? '{}');
    if (!parsed.title || !Array.isArray(parsed.lessons) || parsed.lessons.length === 0) {
      throw new Error('The AI returned an incomplete course.');
    }
    res.status(200).json(parsed);
  } catch (error: any) {
    console.error('Course generation failed:', error);
    res.status(500).json({ error: error?.message || 'Course generation failed. Please try again.' });
  }
}
