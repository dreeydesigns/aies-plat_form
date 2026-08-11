import React, { useEffect, useState } from 'react';
import { useAppContext, Course, Lesson } from '../../context/AppContext';
import { Plus, Save, PlayCircle, FileText, HelpCircle, CheckCircle, Trash2, GripVertical, Layers, Video, BookOpen } from 'lucide-react';
import { useAutoSave } from '../../hooks/useAutoSave';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { addDoc, collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CurriculumBrief, generateCourseFromDocument } from '../../lib/courseAi';

const curriculumQuestions: Array<{ key: keyof CurriculumBrief; label: string; placeholder: string }> = [
  { key: 'learnerAge', label: '1. Learner age range', placeholder: 'e.g. 13-15 years' },
  { key: 'learnerLevel', label: '2. Current level', placeholder: 'e.g. Grade 8, beginner' },
  { key: 'subject', label: '3. Subject / curriculum', placeholder: 'e.g. Biology, CBC' },
  { key: 'learningGoals', label: '4. Learning outcomes', placeholder: 'What should learners know or do?' },
  { key: 'duration', label: '5. Course duration', placeholder: 'e.g. 4 lessons across 2 weeks' },
  { key: 'deliveryStyle', label: '6. Preferred delivery style', placeholder: 'e.g. visual, practical, collaborative' },
  { key: 'accessibilityNeeds', label: '7. Accessibility and language needs', placeholder: 'e.g. simple English, captions, none' },
];
const briefSuggestions: Partial<Record<keyof CurriculumBrief, string[]>> = {
  learnerAge: ['6-8 years', '9-11 years', '12-14 years', '15-18 years', 'Adult learners'],
  learnerLevel: ['Beginner', 'Foundation level', 'Grade-level standard', 'Advanced', 'Mixed ability class'],
  learningGoals: ['Understand the basics', 'Apply ideas to real problems', 'Prepare for an exam', 'Build confidence', 'Master challenging questions'],
  duration: ['One 40-minute lesson', '3 lessons across 1 week', '5 lessons across 2 weeks', '1 month unit', 'Self-paced revision'],
  deliveryStyle: ['Simple English', 'Visual and step-by-step', 'Practical activities', 'Gamified missions', 'Collaborative learning'],
  accessibilityNeeds: ['Simple English', 'Short instructions', 'Extra worked examples', 'Captions and transcripts', 'Screen-reader friendly'],
};

function SortableLessonItem({ lesson, onDelete }: { lesson: Lesson; onDelete: (lesson: Lesson) => void; key?: React.Key }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center gap-3 group">
      <div {...attributes} {...listeners} className="cursor-grab text-neutral-400 hover:text-neutral-600 focus:outline-none">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="mt-1 text-emerald-600 flex-shrink-0">
        <CheckCircle className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-neutral-800 text-sm">{lesson.title}</h4>
        <p className="text-xs text-neutral-500 capitalize">{lesson.type}</p>
      </div>
      <button onClick={() => onDelete(lesson)} className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title={`Delete ${lesson.title}`}><Trash2 className="w-4 h-4" /></button>
    </div>
  );
}

export default function CourseBuilder() {
  const { courses, addLesson, addQuiz, currentUser } = useAppContext();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newLessonTitle, setNewLessonTitle, clearLessonTitle] = useAutoSave('aies_draft_lesson_title', '');
  const [newLessonContent, setNewLessonContent, clearLessonContent] = useAutoSave('aies_draft_lesson_content', '');
  const [newLessonType, setNewLessonType, clearLessonType] = useAutoSave('aies_draft_lesson_type', 'text');
  
  // Quiz Builder State
  const [quizQuestions, setQuizQuestions, clearQuizQuestions] = useAutoSave('aies_draft_quiz_questions', [{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [brief, setBrief] = useState<CurriculumBrief>({ learnerAge: '', learnerLevel: '', subject: '', learningGoals: '', duration: '', deliveryStyle: '', accessibilityNeeds: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');

  useEffect(() => {
    setSelectedCourse((current) => courses.find((course) => course.id === current?.id) || courses[0] || null);
  }, [courses]);

  useEffect(() => {
    setCourseTitle(selectedCourse?.title || '');
    setCourseDescription(selectedCourse?.description || '');
  }, [selectedCourse?.id]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      let updatedCourseLessons: Lesson[] = [];
      setSelectedCourse((course) => {
        if (!course) return course;
        const oldIndex = course.lessons.findIndex(l => l.id === active.id);
        const newIndex = course.lessons.findIndex(l => l.id === over.id);
        
        updatedCourseLessons = arrayMove(course.lessons, oldIndex, newIndex);
        return {
          ...course,
          lessons: updatedCourseLessons,
        };
      });
      
      if (selectedCourse?.id && updatedCourseLessons.length > 0) {
        try {
          await updateDoc(doc(db, 'courses', selectedCourse.id), { lessons: updatedCourseLessons });
        } catch (e) {
          console.error("Failed to reorder lessons", e);
        }
      }
    }
  };

  const handleAddQuestion = () => {
    setQuizQuestions([...quizQuestions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const handleQuestionChange = (index: number, field: string, value: any, optionIndex?: number) => {
    const updated = [...quizQuestions];
    if (field === 'text') updated[index].text = value;
    if (field === 'correctAnswer') updated[index].correctAnswer = value;
    if (field === 'option' && optionIndex !== undefined) {
      updated[index].options[optionIndex] = value;
    }
    setQuizQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!newLessonTitle || !selectedCourse) return;
    
    const lessonId = `l${Date.now()}`;
    let quizId: string | undefined;

    if (newLessonType === 'quiz') {
      quizId = `q${Date.now()}`;
      addQuiz(quizId, {
        id: quizId,
        questions: quizQuestions.map((q, i) => ({
          id: `q${i}`,
          text: q.text || `Question ${i + 1}`,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      });
    }

    const newLesson = {
      id: lessonId,
      title: newLessonTitle,
      content: newLessonContent || (newLessonType === 'quiz' ? 'Take the quiz to test your knowledge.' : 'No content provided.'),
      type: newLessonType as any,
      ...(quizId ? { quizId } : {})
    };

    addLesson(selectedCourse.id, newLesson);
    
    // Update local selected course state so the UI reflects the change immediately
    setSelectedCourse(prev => prev ? ({
      ...prev,
      lessons: [...prev.lessons, newLesson]
    }) : prev);

    clearLessonTitle();
    clearLessonContent();
    clearQuizQuestions();
  };

  const saveCourseDetails = async () => {
    if (!selectedCourse || !courseTitle.trim()) return;
    await updateDoc(doc(db, 'courses', selectedCourse.id), { title: courseTitle.trim(), description: courseDescription.trim() });
    setSelectedCourse(current => current ? { ...current, title: courseTitle.trim(), description: courseDescription.trim() } : current);
  };

  const deleteLesson = async (lesson: Lesson) => {
    if (!selectedCourse || !window.confirm(`Delete “${lesson.title}”? This cannot be undone.`)) return;
    const lessons = selectedCourse.lessons.filter(item => item.id !== lesson.id);
    await updateDoc(doc(db, 'courses', selectedCourse.id), { lessons });
    setSelectedCourse({ ...selectedCourse, lessons });
  };

  const deleteCourse = async () => {
    if (!selectedCourse || !window.confirm(`Delete the course “${selectedCourse.title}” and all its lessons? This cannot be undone.`)) return;
    await deleteDoc(doc(db, 'courses', selectedCourse.id));
  };

  const handleCreateCourse = async () => {
    try {
      const courseData: Omit<Course, 'id'> = {
        title: 'Untitled Course',
        description: 'Add a description and lessons to begin building this course.',
        lessons: [],
      };
      const courseRef = await addDoc(collection(db, 'courses'), courseData);
      setSelectedCourse({ id: courseRef.id, ...courseData });
    } catch (error) {
      console.error('Failed to create course:', error);
    }
  };

  const handleGenerateCourse = async () => {
    if (!sourceFile || (Object.values(brief) as string[]).some(value => !value.trim())) {
      setGenerationError('Upload a document and answer all seven curriculum questions.');
      return;
    }
    setGenerationError('');
    setIsGenerating(true);
    try {
      if (!currentUser) throw new Error('Please sign in again before generating a course.');
      const generated = await generateCourseFromDocument(sourceFile, brief, currentUser.uid);
      const generatedQuizzes: Record<string, any> = {};
      const lessons: Lesson[] = generated.lessons.map((lesson, index) => {
        const quizId = lesson.quiz ? `q_${Date.now()}_${index}` : undefined;
        if (lesson.quiz && quizId) {
          generatedQuizzes[quizId] = { id: quizId, ...lesson.quiz, questions: lesson.quiz.questions.map((question, questionIndex) => ({ ...question, id: `${quizId}_${questionIndex}` })) };
        }
        return {
          id: `l_${Date.now()}_${index}`,
          title: lesson.title,
          content: lesson.content,
          type: lesson.type,
          ...(quizId ? { quizId } : {}),
        };
      });
      const courseData = { title: generated.title, description: generated.description, lessons, quizzes: generatedQuizzes, sourceDocument: sourceFile.name };
      const ref = await addDoc(collection(db, 'courses'), courseData);
      Object.entries(generatedQuizzes).forEach(([id, quiz]) => addQuiz(id, quiz as any));
      setSelectedCourse({ id: ref.id, ...courseData });
      setSourceFile(null);
    } catch (error: any) {
      setGenerationError(error?.message || 'Could not generate the course.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!selectedCourse) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm text-center">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create your first course</h1>
        <p className="text-neutral-500 mb-6">Start with an empty course, then add lessons and quizzes for your students.</p>
        <button onClick={handleCreateCourse} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
          Create Course
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Course Builder</h1>
          <p className="text-neutral-500">Choose a course, organize its lessons, and publish content with confidence.</p>
        </div>
        <div className="flex items-center gap-4">
          <select aria-label="Current course"
            className="bg-neutral-50 border border-neutral-200 text-neutral-700 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={selectedCourse.id}
            onChange={(e) => setSelectedCourse(courses.find(c => c.id === e.target.value) || courses[0])}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          <button onClick={handleCreateCourse} className="px-4 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100"><Plus className="w-4 h-4 inline mr-1" />New course</button>
        </div>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div className="flex items-start gap-3 mb-4"><div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg"><Layers className="w-5 h-5" /></div><div><h2 className="font-bold text-neutral-900">Current course details</h2><p className="text-sm text-neutral-500">Students will see this title and summary in My Courses.</p></div></div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3"><input value={courseTitle} onChange={event => setCourseTitle(event.target.value)} placeholder="Course title" className="px-4 py-3 rounded-xl border border-neutral-200" /><input value={courseDescription} onChange={event => setCourseDescription(event.target.value)} placeholder="Short course description" className="px-4 py-3 rounded-xl border border-neutral-200" /><button onClick={saveCourseDetails} disabled={!courseTitle.trim()} className="px-5 py-3 bg-neutral-900 text-white font-bold rounded-xl disabled:opacity-50"><Save className="w-4 h-4 inline mr-1" />Save</button></div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm overflow-y-auto max-h-[600px]">
          <div className="flex items-center justify-between mb-1"><div><h3 className="text-lg font-bold text-neutral-800">Lessons in this course</h3><p className="text-sm text-neutral-500">{selectedCourse.title} · {selectedCourse.lessons.length} lesson{selectedCourse.lessons.length === 1 ? '' : 's'}</p></div><button onClick={deleteCourse} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete course"><Trash2 className="w-5 h-5" /></button></div>
          <div className="space-y-3">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={selectedCourse.lessons.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {selectedCourse.lessons.map(lesson => (
                  <SortableLessonItem key={lesson.id} lesson={lesson} onDelete={deleteLesson} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" />
            Add New Lesson
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Lesson Title</label>
              <input 
                type="text" 
                value={newLessonTitle}
                onChange={e => setNewLessonTitle(e.target.value)}
                placeholder="e.g., Introduction to Cellular Respiration"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-neutral-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Content Type</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setNewLessonType('text')}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${newLessonType === 'text' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">Article</span>
                </button>
                <button 
                  onClick={() => setNewLessonType('video')}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${newLessonType === 'video' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <PlayCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Video</span>
                </button>
                <button 
                  onClick={() => setNewLessonType('quiz')}
                  className={`py-3 px-4 rounded-xl border flex flex-col items-center gap-2 transition-colors ${newLessonType === 'quiz' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-neutral-200 hover:bg-neutral-50'}`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Quiz</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">{newLessonType === 'video' ? 'Video URL or viewing instructions' : newLessonType === 'quiz' ? 'Quiz introduction for students' : 'Article content (headings and bullet lists supported)'}</label>
              <textarea 
                rows={8}
                value={newLessonContent}
                onChange={e => setNewLessonContent(e.target.value)}
                placeholder={newLessonType === 'video' ? 'Paste a secure video URL or write clear viewing instructions...' : newLessonType === 'quiz' ? 'Explain what learners will demonstrate in this quiz...' : 'Start with ## What you will learn, then use short paragraphs and bullet lists...'}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-neutral-50"
              ></textarea>
            </div>

            {newLessonType === 'quiz' && (
              <div className="space-y-6 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-neutral-800">Quiz Questions</h4>
                  <button 
                    onClick={handleAddQuestion}
                    className="text-emerald-600 text-sm font-bold hover:text-emerald-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Question
                  </button>
                </div>
                
                {quizQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4 relative group">
                    {quizQuestions.length > 1 && (
                      <button 
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Question {qIndex + 1}</label>
                      <input 
                        type="text"
                        value={q.text}
                        onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)}
                        placeholder="What is the capital of..."
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Options & Correct Answer</label>
                      {q.options.map((opt, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            name={`correct-${qIndex}`}
                            checked={q.correctAnswer === oIndex}
                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <input 
                            type="text"
                            value={opt}
                            onChange={e => handleQuestionChange(qIndex, 'option', e.target.value, oIndex)}
                            placeholder={`Option ${oIndex + 1}`}
                            className="flex-1 px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:border-emerald-500 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 flex justify-end">
              <button 
                onClick={handlePublish}
                disabled={!newLessonTitle}
                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                Publish Lesson
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h2 className="text-lg font-bold text-neutral-900">Create a complete course with AI</h2>
        <p className="mt-1 text-sm text-neutral-500">Upload a PDF, DOCX, or PPTX, then answer seven questions. AIES creates sequenced lessons and a final assessment from your source material.</p>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="md:col-span-2 block">
            <span className="block text-sm font-medium text-neutral-700 mb-2">Source document (PDF, DOCX, or PPTX; max 4 MB)</span>
            <input type="file" accept=".pdf,.docx,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation" onChange={event => setSourceFile(event.target.files?.[0] || null)} className="block w-full text-sm" />
          </label>
          {curriculumQuestions.map(question => <label key={question.key} className="block"><span className="block text-sm font-medium text-neutral-700 mb-1">{question.label}</span><input value={brief[question.key]} onChange={event => setBrief(current => ({ ...current, [question.key]: event.target.value }))} placeholder={question.placeholder} className="w-full px-3 py-2 rounded-lg border border-neutral-300" />{question.key !== 'subject' && <div className="mt-2 flex flex-wrap gap-1.5">{briefSuggestions[question.key]?.map(option => <button type="button" key={option} onClick={() => setBrief(current => ({ ...current, [question.key]: option }))} className="px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full hover:bg-emerald-100">{option}</button>)}</div>}</label>)}
        </div>
        {generationError && <p className="mt-4 text-sm text-red-600">{generationError}</p>}
        <button onClick={handleGenerateCourse} disabled={isGenerating} className="mt-5 px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50">{isGenerating ? 'Building course…' : 'Generate complete course'}</button>
      </section>
    </div>
  );
}
