/**
 * Normalizes lesson content (from AI generation, teacher input, or legacy data)
 * so that Markdown headings, lists, inline math ($...$), and block equations ($$...$$)
 * render cleanly across all languages (native, local, and international) and STEM subjects.
 */
export function formatLessonContent(content: string): string {
  if (!content) return '';

  let normalized = content;

  // 1. Convert backslash-escaped dollar signs (\$) to standard math dollars ($)
  normalized = normalized.replace(/\\+\$/g, '$');

  // 2. Convert standard LaTeX display brackets \[ ... \] to $$ ... $$
  normalized = normalized.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (_match, eq) => `\n\n$$${eq.trim()}$$\n\n`);

  // 3. Convert standard LaTeX inline brackets \( ... \) to $ ... $
  normalized = normalized.replace(/\\\(\s*([\s\S]*?)\s*\\\)/g, (_match, eq) => `$${eq.trim()}$`);

  // Keywords indicating LaTeX mathematical / scientific notation
  const latexKeywords = /\\(?:frac|sqrt|Delta|alpha|beta|gamma|delta|theta|pi|pm|int|sum|infty|lim|matrix|vec|hat|bar|cdot|times|approx|neq|le|ge|partial|rightarrow|lambda|mu|sigma|omega|Omega)\b/;

  // 4. Line-by-line processing for bare equation lines and inline LaTeX commands
  const lines = normalized.split('\n');
  const formattedLines = lines.map((line) => {
    const trimmed = line.trim();

    // Skip empty lines, lines already containing math delimiters, or Markdown headers/lists
    if (!trimmed || trimmed.includes('$')) return line;

    // Standalone equation line containing raw LaTeX commands
    if (latexKeywords.test(trimmed)) {
      // Check if line has a label prefix like "• Formula: \frac{a}{b}" or "Quadratic formula: x = \frac..."
      const colonIndex = trimmed.indexOf(':');
      if (colonIndex !== -1 && colonIndex < trimmed.length - 1) {
        const prefix = trimmed.substring(0, colonIndex + 1);
        const formula = trimmed.substring(colonIndex + 1).trim();
        if (latexKeywords.test(formula) && !formula.includes('$')) {
          const leadingSpace = line.match(/^\s*/)?.[0] || '';
          return `${leadingSpace}${prefix} $${formula}$`;
        }
      }

      // If the line starts with an equation or is a standalone equation
      if (!trimmed.startsWith('#')) {
        const leadingSpace = line.match(/^\s*/)?.[0] || '';
        return `${leadingSpace}$$${trimmed}$$`;
      }
    }

    // Inline raw LaTeX command inside prose (e.g. "where \Delta = b^2 - 4ac.")
    if (latexKeywords.test(line) && !line.includes('$')) {
      return line.replace(
        /(\\+(?:Delta|alpha|beta|gamma|delta|theta|pi|pm|sqrt|frac|int|sum|infty|vec|hat|bar|cdot|times|approx|neq|le|ge|partial|rightarrow)\b[^\s,\.\;\:]*\s*(?:=|<|>|\le|\ge|\pm|\+|-|\*|\/)?\s*[^,\.\;\:]*)/g,
        (match) => {
          const mTrim = match.trim();
          if (!mTrim) return match;
          return `$${mTrim}$`;
        }
      );
    }

    return line;
  });

  normalized = formattedLines.join('\n');

  // 5. Ensure proper line breaks around Markdown headings
  normalized = normalized.replace(/\s+(#{1,6}\s+)/g, '\n\n$1');

  return normalized;
}
