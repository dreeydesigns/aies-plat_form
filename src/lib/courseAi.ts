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
  let documentPayload: { name: string; mimeType: string; sourceUrl?: string; base64?: string } = { name: file.name, mimeType: file.type };
  try {
    const storageRef = ref(storage, `course-sources/${userId}/${Date.now()}_${safeName}`);
    await uploadBytes(storageRef, file, { contentType: file.type });
    documentPayload.sourceUrl = await getDownloadURL(storageRef);
  } catch (storageError: any) {
    // A small document can still be processed when a project's Storage bucket
    // is temporarily unavailable. Larger files need Storage to avoid Vercel's
    // request-size limit.
    if (file.size > 2_500_000) {
      throw new Error('Firebase Storage is unavailable. Enable Firebase Storage for this project, then try again.');
    }
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Could not read the selected document.'));
      reader.onload = () => resolve(String(reader.result).split(',')[1]);
      reader.readAsDataURL(file);
    });
    documentPayload.base64 = base64;
  }
  const response = await fetch('/api/generate-course', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ document: documentPayload, brief }),
  });
  const raw = await response.text();
  let data: any;
  try { data = JSON.parse(raw); } catch { throw new Error(response.status === 413 ? 'The document is too large for processing.' : `Course AI service error (${response.status}). Please try again.`); }
  if (!response.ok) throw new Error(data.error || 'Course generation failed.');
  return data as GeneratedCourse;
}
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';
