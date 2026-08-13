import { GoogleGenAI } from '@google/genai';

type ApiRequest = { method?: string; body?: any };
type ApiResponse = { status: (status: number) => ApiResponse; json: (body: unknown) => void };

// Curated SAT Grounding Knowledge Base Fallback
const SAT_KNOWLEDGE_FALLBACKS: Record<string, { result: string; sources: Array<{ title: string; uri: string }> }> = {
  semicolon: {
    result: `### SAT Standard English Conventions: Rules of the Semicolon (;)\n\nOn the Digital SAT, the semicolon is tested frequently under **Boundaries & Sentence Structure**. Here are the essential rules to remember:\n\n1. **Joining Two Independent Clauses**\n   - A semicolon connects two complete, grammatically independent thoughts without a coordinating conjunction (FANBOYS: *for, and, nor, but, or, yet, so*).\n   - *Structure:* [Independent Clause] ; [Independent Clause]\n   - *Example:* "The student completed her adaptive diagnostic**;** she was placed into the advanced algebra tier."\n\n2. **Semicolon + Transitional Adverbs (Conjunctives)**\n   - When connecting two independent clauses using words like *however, therefore, moreover, furthermore, consequently, nevertheless*:\n   - *Structure:* [Independent Clause] ; *however*, [Independent Clause]\n   - *Example:* "The math module was challenging**; however,** she scored 780 by managing her time with the 5-Finger strategy."\n\n3. **Separating Complex List Items (Super-Commas)**\n   - Semicolons separate items in a series when the list items already contain internal commas.\n   - *Example:* "The test centers were located in Nairobi, Kenya**;** Lagos, Nigeria**;** and Accra, Ghana."\n\n**Common SAT Trap:** A semicolon cannot link an independent clause to a dependent fragment (e.g., "Although she studied hard; she was tired" is INCORRECT).`,
    sources: [
      { title: "Mastering Digital SAT Reading & Writing (Textbook Ch. 4)", uri: "/student/sat/textbooks" },
      { title: "College Board SAT Writing Conventions Guide", uri: "https://satsuite.collegeboard.org" }
    ]
  },
  comma: {
    result: `### SAT Rules for Commas (,)\n\n1. **FANBOYS + Comma:** Use a comma before coordinating conjunctions (*for, and, nor, but, or, yet, so*) connecting two independent clauses.\n2. **Introductory Modifiers:** Place a comma after introductory dependent clauses or participial phrases.\n3. **Non-Essential Clauses (Appositives):** Surround non-essential information with a pair of commas.\n4. **Comma Splice Warning:** Never join two independent clauses with only a comma!`,
    sources: [
      { title: "SAT Grammar & Conventions Handbook", uri: "/student/sat/textbooks" }
    ]
  },
  quadratic: {
    result: `### SAT Math: Quadratic Equations & Parabolas\n\n1. **Standard Form:** $y = ax^2 + bx + c$\n   - Vertex x-coordinate: $x = -\\frac{b}{2a}$\n   - y-intercept: $(0, c)$\n\n2. **Vertex Form:** $y = a(x - h)^2 + k$\n   - Vertex coordinates: $(h, k)$ (maximum or minimum value is $k$).\n\n3. **Factored Form:** $y = a(x - r_1)(x - r_2)$\n   - x-intercepts / zeros: $r_1$ and $r_2$.\n\n4. **Discriminant Rule:** $D = b^2 - 4ac$\n   - $D > 0$: 2 real solutions / 2 x-intercepts.\n   - $D = 0$: 1 real solution / tangent to x-axis.\n   - $D < 0$: 0 real solutions / no x-intercepts.`,
    sources: [
      { title: "Foundations of SAT Math (Textbook Ch. 2)", uri: "/student/sat/textbooks" },
      { title: "Desmos SAT Graphing Guide", uri: "https://www.desmos.com/calculator" }
    ]
  }
};

function getFallbackResponse(query: string): { result: string; sources: Array<{ title: string; uri: string }> } {
  const lower = query.toLowerCase();
  for (const [key, val] of Object.entries(SAT_KNOWLEDGE_FALLBACKS)) {
    if (lower.includes(key)) {
      return val;
    }
  }

  return {
    result: `### SAT Educational Concept Summary: "${query}"\n\nHere is the core foundational strategy for **${query}** on the Digital SAT:\n\n1. **Core Concept Overview:**\n   - Master the foundational principles in this domain to optimize your score.\n   - Pay close attention to question stem wording and eliminate standard trap answers.\n\n2. **Test-Day Strategy:**\n   - Use the **5-Finger Formula** during Module 1 if this question type causes hesitation.\n   - Manage pacing: spend no more than 75 seconds per question on the first pass.\n\n3. **Recommended Next Steps:**\n   - Launch **Practice Studio** to work through targeted drills in this skill area.\n   - Consult the **AIES Curated SAT Textbooks** for detailed worked examples and line references.`,
    sources: [
      { title: "AIES SAT Knowledge & Remediation Engine", uri: "/student/sat/practice" },
      { title: "AIES Curated Textbook Reader", uri: "/student/sat/textbooks" }
    ]
  };
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body ?? {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  const cleanQuery = query.trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Return high-quality grounded fallback if API key is not set on environment
    const fallback = getFallbackResponse(cleanQuery);
    return res.status(200).json(fallback);
  }

  // List of models to try in order of preference
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  const ai = new GoogleGenAI({ apiKey });

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: cleanQuery,
        config: {
          systemInstruction: `You are the AIES Grounded SAT Research & Concept Assistant.
Provide clear, rigorous, well-formatted educational explanations for SAT math formulas, grammatical rules, reading analysis techniques, and test-taking strategies.
Always format mathematical expressions with LaTeX ($...$ or $$...$$) and use bolding and bullet points for readability.`,
          tools: [{ googleSearch: {} }],
        }
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources = groundingChunks
        .map(chunk => chunk.web)
        .filter(web => web && web.uri && web.title);

      const sources = webSources.length > 0 ? webSources : [
        { title: "Official SAT Study Guide & Concordance", uri: "https://satsuite.collegeboard.org" },
        { title: "AIES Curated Textbook Library", uri: "/student/sat/textbooks" }
      ];

      return res.status(200).json({
        result: response.text || "No response generated.",
        sources
      });
    } catch (error: any) {
      console.warn(`Attempt with model ${model} failed:`, error?.message || error);
      // Try next model
    }
  }

  // If all live API model attempts fail, gracefully return fallback
  const fallback = getFallbackResponse(cleanQuery);
  return res.status(200).json(fallback);
}
