import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, studentName } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is missing' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are an empathetic socio-emotional AI counselor for an educational platform.
Analyze the following message sent by student "${studentName || 'Student'}":
"${text}"

Check if it contains harmful, toxic, passive-aggressive, or bullying language.
Return ONLY valid JSON matching this exact schema:
{
  "isToxic": boolean,
  "severity": "none" | "low" | "medium" | "high",
  "constructiveNudge": "string (gentle, encouraging alternative wording if toxic; empty string if harmless)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Moderation API error:', error);
    return res.status(500).json({ isToxic: false, severity: 'none', constructiveNudge: '' });
  }
}
