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

export async function generateCourseFromDocument(file: File, brief: CurriculumBrief): Promise<GeneratedCourse> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected document.'));
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const response = await fetch('/api/generate-course', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document: { name: file.name, mimeType: file.type, base64 }, brief }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Course generation failed.');
  return data as GeneratedCourse;
}
