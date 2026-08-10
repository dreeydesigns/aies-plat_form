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

export async function generateCourseFromDocument(file: File, brief: CurriculumBrief, userId: string): Promise<GeneratedCourse> {
  if (file.size > 10_000_000) throw new Error('Upload a document smaller than 10 MB.');
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storageRef = ref(storage, `course-sources/${userId}/${Date.now()}_${safeName}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const sourceUrl = await getDownloadURL(storageRef);
  const response = await fetch('/api/generate-course', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document: { name: file.name, mimeType: file.type, sourceUrl }, brief }),
  });
  const raw = await response.text();
  let data: any;
  try { data = JSON.parse(raw); } catch { throw new Error(response.status === 413 ? 'The document is too large for processing.' : `Course AI service error (${response.status}). Please try again.`); }
  if (!response.ok) throw new Error(data.error || 'Course generation failed.');
  return data as GeneratedCourse;
}
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';
