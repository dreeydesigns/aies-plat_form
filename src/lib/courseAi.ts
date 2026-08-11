export interface CurriculumBrief {
  learnerAge: string;
  learnerLevel: string;
  subject: string;
  learningGoals: string;
  duration: string;
  deliveryStyle: string;
  accessibilityNeeds: string;
}

export interface GeneratedQuiz {
  title: string;
  questions: Array<{ text: string; options: string[]; correctAnswer: number }>;
}

export interface GeneratedCourse {
  title: string;
  description: string;
  lessons: Array<{ title: string; content: string; type: 'reading' | 'video' | 'vr' | 'quiz'; quiz: GeneratedQuiz | null }>;
}

export async function generateCourseFromDocument(file: File, brief: CurriculumBrief, _userId: string): Promise<GeneratedCourse> {
  if (file.size > 4_000_000) throw new Error('Upload a document smaller than 4 MB. This free route does not require Firebase Storage.');
  const response = await fetch('/api/generate-course-upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream', 'x-document-mime': file.type, 'x-curriculum-brief': btoa(unescape(encodeURIComponent(JSON.stringify(brief)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') },
    body: file,
  });
  const raw = await response.text();
  let data: any;
  try { data = JSON.parse(raw); } catch { throw new Error(response.status === 413 ? 'The document is too large for processing.' : `Course AI service error (${response.status}). Please try again.`); }
  if (!response.ok) throw new Error(data.error || 'Course generation failed.');
  return data as GeneratedCourse;
}
