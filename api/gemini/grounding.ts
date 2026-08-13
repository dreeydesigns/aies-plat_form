import { GoogleGenAI } from '@google/genai';

type ApiRequest = { method?: string; body?: any };
type ApiResponse = { status: (status: number) => ApiResponse; json: (body: unknown) => void };

// Curated SAT Grounding Knowledge Base Fallback
const SAT_KNOWLEDGE_FALLBACKS: Record<string, { result: string; sources: Array<{ title: string; uri: string }> }> = {
  semicolon: {
    result: `### SAT Standard English Conventions: Rules of the Semicolon (;)

On the Digital SAT, the semicolon is tested under **Boundaries & Sentence Structure**. Master these core rules:

#### 1. Joining Two Independent Clauses
- A semicolon links two complete, grammatically independent thoughts without a coordinating conjunction (FANBOYS: *for, and, nor, but, or, yet, so*).
- **Structure:** \`[Independent Clause] ; [Independent Clause]\`
- **Example:** "The student completed her adaptive diagnostic**;** she was placed into the advanced algebra tier."

#### 2. Semicolon + Transitional Adverbs (Conjunctives)
- When connecting two independent clauses with transitional words like *however, therefore, moreover, furthermore, consequently, nevertheless*:
- **Structure:** \`[Independent Clause] ; however, [Independent Clause]\`
- **Example:** "The math module was challenging**; however,** she scored 780 by managing her pacing with the 5-Finger strategy."

#### 3. Separating Complex List Items (Super-Commas)
- Semicolons separate items in a series when individual list items already contain internal commas.
- **Example:** "The test centers were located in Nairobi, Kenya**;** Lagos, Nigeria**;** and Accra, Ghana."

> **⚠️ Common SAT Trap:** A semicolon cannot link an independent clause to a dependent clause or fragment (e.g., *"Although she studied hard; she was tired"* is grammatically incorrect).`,
    sources: [
      { title: "Mastering Digital SAT Reading & Writing (Textbook Ch. 4)", uri: "/student/sat/textbooks" },
      { title: "Official College Board SAT Grammar Guidelines", uri: "https://satsuite.collegeboard.org" }
    ]
  },
  comma: {
    result: `### SAT Standard English Conventions: Rules for Commas (,)

#### 1. FANBOYS + Comma
Use a comma before a coordinating conjunction (*for, and, nor, but, or, yet, so*) when connecting two independent clauses.
- **Example:** "The timer was running**, but** the student remained calm."

#### 2. Introductory Dependent Clauses & Modifiers
Place a comma after introductory phrases or dependent clauses.
- **Example:** "After finishing Module 1**, she reviewed her flagged questions."

#### 3. Non-Essential Information (Appositives)
Surround non-essential clauses or parenthetical information with a pair of commas.
- **Example:** "Desmos**, the built-in graphing tool**, is available on all SAT Math modules."

> **⚠️ Common SAT Trap (Comma Splice):** Never connect two independent clauses with only a comma without a FANBOYS conjunction!`,
    sources: [
      { title: "SAT Grammar & Conventions Handbook", uri: "/student/sat/textbooks" },
      { title: "College Board SAT Conventions Guide", uri: "https://satsuite.collegeboard.org" }
    ]
  },
  quadratic: {
    result: `### SAT Math: Quadratic Equations & Parabolas

#### 1. Standard Form: $y = ax^2 + bx + c$
- **Vertex x-coordinate:** $x = -\\frac{b}{2a}$
- **y-intercept:** $(0, c)$

#### 2. Vertex Form: $y = a(x - h)^2 + k$
- **Vertex coordinates:** $(h, k)$
- Maximum or minimum value of the function is $k$.

#### 3. Factored (Intercept) Form: $y = a(x - r_1)(x - r_2)$
- **x-intercepts (zeros / roots):** $r_1$ and $r_2$
- **Axis of symmetry:** $x = \\frac{r_1 + r_2}{2}$

#### 4. The Discriminant Rule: $D = b^2 - 4ac$
- **$D > 0$:** 2 distinct real solutions (2 x-intercepts)
- **$D = 0$:** 1 real solution (tangent to x-axis / vertex on axis)
- **$D < 0$:** 0 real solutions (no x-intercepts)`,
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
    result: `### SAT Educational Concept Summary: "${query}"

Here are the core test-taking principles and strategies for **${query}** on the Digital SAT:

#### 1. Foundational Concept Mastery
- Master the core rules, definitions, and theorems in this domain to ensure speed and accuracy on test day.
- Pay strict attention to question stems: identify what is being asked before jumping to calculations.

#### 2. Test-Day Execution & 5-Finger Strategy
- Use the **5-Finger Formula** during Module 1 if this question type causes hesitation or takes longer than 75 seconds.
- Eliminate obvious trap answers (e.g., sign errors, partial solutions) before selecting your final answer.

#### 3. Recommended Remediation
- Launch the **Practice Studio** to work through targeted drills in this specific domain.
- Review related chapters in the **Curated SAT Textbooks** for worked step-by-step examples.`,
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
