export async function searchEducationalResources(query: string): Promise<{ result: string; sources?: any[] }> {
  try {
    const response = await fetch('/api/gemini/grounding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return {
      result: data.result,
      sources: data.sources || [],
    };
  } catch (error: any) {
    console.error('Gemini Grounding Error:', error);
    throw new Error(error.message || 'Failed to fetch grounded resources');
  }
}
