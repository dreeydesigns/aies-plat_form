import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle, XCircle, Trophy, ArrowRight, BookOpen, AlertTriangle, HelpCircle, History, Sparkles, RefreshCw, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { evaluateQuiz, QuizResult } from '../../utils/quiz-engine';
import LessonContent from '../../components/shared/LessonContent';
import { AiTutorPanel } from '../../components/student/AiTutorPanel';

export default function LessonView() {
  const { courseId, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const retakePromptId = searchParams.get('retakePromptId');

  const {
    courses,
    quizzes,
    completeLesson,
    completedLessons,
    userProfile,
    submissions,
    retakePrompts,
    saveQuizSubmission,
    markRetakeCompleted
  } = useAppContext();

  const navigate = useNavigate();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTutorOpen, setIsTutorOpen] = useState(false);


  const course = courses.find(c => c.id === courseId);
  const lesson = course?.lessons.find(l => l.id === lessonId);

  // If URL has retakePromptId or autoQuiz=true, open quiz immediately
  useEffect(() => {
    if (retakePromptId || searchParams.get('mode') === 'quiz') {
      setShowQuiz(true);
    }
  }, [retakePromptId, searchParams]);

  if (!course || !lesson) return <div className="p-8 text-center text-neutral-500">Lesson not found</div>;

  const isCompleted = completedLessons.includes(lesson.id);
  const quiz = lesson.quizId ? quizzes[lesson.quizId] : null;

  // Previous attempts by this student for this quiz
  const studentQuizSubmissions = submissions.filter(
    s => s.studentId === userProfile?.id && s.quizId === (quiz?.id || lesson.quizId)
  );

  const handleComplete = () => {
    if (!isCompleted) {
      completeLesson(lesson.id, quizResult ? quizResult.pointsEarned : 100, quizResult ? quizResult.score : undefined);
    }
    navigate('/student');
  };

  const handleQuizSubmit = async () => {
    if (!quiz || !userProfile || isSubmitting) return;

    setIsSubmitting(true);
    const result = evaluateQuiz(quiz, selectedAnswers);
    setQuizResult(result);

    const attemptNumber = studentQuizSubmissions.length + 1;

    // Save detailed submission to Firestore
    await saveQuizSubmission({
      studentId: userProfile.id,
      studentName: userProfile.name || 'Student',
      courseId: course.id,
      lessonId: lesson.id,
      quizId: quiz.id,
      quizTitle: quiz.title || lesson.title,
      score: result.score,
      correctCount: result.correctCount,
      totalQuestions: result.totalQuestions,
      answers: selectedAnswers,
      questionDetails: result.questionDetails,
      adaptivePath: result.adaptivePath,
      pointsEarned: result.pointsEarned,
      submittedAt: new Date().toISOString(),
      attemptNumber,
      retakeStatus: retakePromptId ? 'completed' : 'none'
    });

    if (retakePromptId) {
      await markRetakeCompleted(retakePromptId);
    }

    if (result.score >= 60 && !isCompleted) {
      completeLesson(lesson.id, result.pointsEarned, result.score);
    }

    setIsSubmitting(false);
  };

  const currentPrompt = retakePrompts.find(p => p.id === retakePromptId && p.status === 'pending');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <span className="hover:text-neutral-800 cursor-pointer" onClick={() => navigate('/student')}>Dashboard</span>
        <span>/</span>
        <span className="hover:text-neutral-800 cursor-pointer">{course.title}</span>
        <span>/</span>
        <span className="text-neutral-900 font-medium">{lesson.title}</span>
      </div>

      {/* Teacher Prompt Alert Banner */}
      {currentPrompt && !quizResult && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-bold text-amber-900">Teacher Retake Request from {currentPrompt.teacherName}</h4>
            {currentPrompt.note && (
              <p className="text-amber-800 mt-1 italic font-medium">"{currentPrompt.note}"</p>
            )}
            <p className="text-amber-700 text-xs mt-2">Complete this exam to submit your updated score to your teacher.</p>
          </div>
        </div>
      )}

      {!showQuiz && !quizResult && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <BookOpen className="w-16 h-16 opacity-50" />
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">{lesson.title}</h1>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-bold uppercase tracking-wider">
                  {lesson.type}
                </span>
              </div>
              {isCompleted && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>

            <div className="max-w-none mb-8">
              <LessonContent content={lesson.content} />
            </div>

            <div className="flex justify-end pt-6 border-t border-neutral-100">
              {quiz ? (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {studentQuizSubmissions.length > 0 ? 'Retake Exam / Quiz' : 'Take Quiz to Complete'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  Mark as Complete
                  <CheckCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUIZ TAKING VIEW */}
      {showQuiz && !quizResult && quiz && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-neutral-900">{quiz.title || 'Knowledge Check'}</h2>
            {studentQuizSubmissions.length > 0 && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                Attempt #{studentQuizSubmissions.length + 1}
              </span>
            )}
          </div>
          <p className="text-neutral-500 mb-8">Answer the following questions to test your understanding and submit your work.</p>

          <div className="space-y-8">
            {quiz.questions.map((q, idx) => (
              <div key={q.id} className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-800">
                  {idx + 1}. {q.text}
                </h3>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAnswers[q.id] === optIdx
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-neutral-200 hover:border-blue-300 hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={selectedAnswers[q.id] === optIdx}
                        onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className={selectedAnswers[q.id] === optIdx ? 'font-medium text-blue-900' : 'text-neutral-700'}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(selectedAnswers).length < quiz.questions.length || isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting & Grading...' : 'Submit Answers'}
            </button>
          </div>
        </div>
      )}

      {/* QUIZ RESULTS & IMMEDIATE AI CORRECTIONS VIEW */}
      {quizResult !== null && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          {/* Summary Banner */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              quizResult.score >= 80 ? 'bg-green-100 text-green-600' : quizResult.score >= 60 ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <Trophy className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Exam Results & Feedback</h2>
            <p className="text-neutral-500 mb-6">
              You scored <span className="font-bold text-neutral-900 text-xl">{quizResult.score}%</span> ({quizResult.correctCount} of {quizResult.totalQuestions} correct)
            </p>

            <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
              <span className="px-4 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-full text-sm border border-blue-200">
                +{quizResult.pointsEarned} Points Earned
              </span>
              <span className={`px-4 py-1.5 font-bold rounded-full text-sm border ${
                quizResult.adaptivePath === 'advanced' ? 'bg-green-50 text-green-700 border-green-200' :
                quizResult.adaptivePath === 'standard' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                Adaptive Level: {quizResult.adaptivePath.toUpperCase()}
              </span>
            </div>

            <div className="bg-neutral-50 rounded-xl p-5 text-left border border-neutral-100 max-w-xl mx-auto">
              <h4 className="font-bold text-neutral-800 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Adaptive Recommendation
              </h4>
              {quizResult.adaptivePath === 'advanced' ? (
                <p className="text-green-700 text-sm">Excellent work! You've mastered this topic. Your submission has been saved for your teacher.</p>
              ) : quizResult.adaptivePath === 'standard' ? (
                <p className="text-blue-700 text-sm">Good job! You passed the requirements. Review the corrections below before continuing.</p>
              ) : (
                <p className="text-amber-700 text-sm">Review the detailed corrections below to understand where to improve, then consider re-attempting this quiz.</p>
              )}
            </div>
          </div>

          {/* Detailed Question-by-Question Corrections & Explanations */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 space-y-6">
            <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-neutral-900">Question Corrections & Guidance</h3>
              <span className="text-xs text-neutral-500 font-medium">Submitted to Teacher Roster</span>
            </div>

            <div className="space-y-6 divide-y divide-neutral-100">
              {quizResult.questionDetails.map((q, idx) => (
                <div key={q.id} className={`${idx > 0 ? 'pt-6' : ''} space-y-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold text-neutral-900 text-base">
                      {idx + 1}. {q.text}
                    </h4>
                    {q.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>

                  {/* Options status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = q.selectedAnswer === optIdx;
                      const isCorrect = q.correctAnswer === optIdx;

                      let style = "bg-neutral-50 text-neutral-700 border-neutral-200";
                      if (isCorrect) {
                        style = "bg-green-50 text-green-900 border-green-300 font-medium";
                      } else if (isChosen && !isCorrect) {
                        style = "bg-red-50 text-red-900 border-red-300 line-through";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-lg border flex items-center justify-between ${style}`}>
                          <span>{opt}</span>
                          {isCorrect && <span className="text-xs font-bold text-green-700">✓ Correct Answer</span>}
                          {isChosen && !isCorrect && <span className="text-xs font-bold text-red-700">Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* AI Explanation / Revision Guidance */}
                  {q.explanation && (
                    <div className={`p-4 rounded-xl text-sm border ${
                      q.isCorrect ? 'bg-green-50/50 border-green-100 text-green-900' : 'bg-amber-50/60 border-amber-200 text-amber-900'
                    }`}>
                      <p className="font-semibold mb-1 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        {q.isCorrect ? 'Understanding Summary' : 'Correction & Revision Guidance'}
                      </p>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Attempt History */}
          {studentQuizSubmissions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
              <h3 className="font-bold text-neutral-800 text-base mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                Attempt History for this Exam
              </h3>
              <div className="space-y-2">
                {studentQuizSubmissions.map((sub, idx) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 text-sm border border-neutral-100">
                    <div>
                      <span className="font-bold text-neutral-800">Attempt #{sub.attemptNumber || idx + 1}</span>
                      <span className="text-neutral-500 text-xs ml-3">{new Date(sub.submittedAt).toLocaleDateString()} at {new Date(sub.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-900">{sub.score}%</span>
                      {sub.retakeStatus === 'completed' && (
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">Teacher Retake</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => {
                setQuizResult(null);
                setSelectedAnswers({});
                setShowQuiz(true);
              }}
              className="px-6 py-3 bg-white border border-neutral-300 text-neutral-700 font-bold rounded-xl hover:bg-neutral-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retake Exam Now
            </button>

            <button
              onClick={handleComplete}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Floating AI Tutor Toggle Button */}
      {!isTutorOpen && (
        <button
          onClick={() => setIsTutorOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-full shadow-2xl flex items-center gap-2.5 text-sm ring-4 ring-purple-100 transition-all hover:scale-105"
        >
          <Bot className="w-5 h-5 text-yellow-300" />
          <span>Ask AI Tutor Hadithi</span>
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
        </button>
      )}

      {/* Mounted AI Tutor Panel */}
      <AiTutorPanel
        lessonTitle={lesson.title}
        lessonContent={lesson.content}
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
      />
    </div>
  );
}

