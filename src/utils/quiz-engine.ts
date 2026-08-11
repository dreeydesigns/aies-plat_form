import { Quiz } from '../context/AppContext';

export interface DetailedQuestionResult {
  id: string;
  text: string;
  options: string[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizResult {
  score: number; // 0 to 100
  correctCount: number;
  totalQuestions: number;
  adaptivePath: 'remedial' | 'standard' | 'advanced';
  pointsEarned: number;
  questionDetails: DetailedQuestionResult[];
}

export const evaluateQuiz = (quiz: Quiz, answers: Record<string, number>): QuizResult => {
  let correct = 0;
  const questionDetails: DetailedQuestionResult[] = [];

  quiz.questions.forEach((q) => {
    const selected = answers[q.id] !== undefined ? answers[q.id] : -1;
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) {
      correct++;
    }

    const selectedText = selected >= 0 ? q.options[selected] : 'No answer selected';
    const correctText = q.options[q.correctAnswer] || 'Correct answer';

    let explanation = '';
    if (isCorrect) {
      explanation = `Correct! You correctly identified '${correctText}'. Excellent understanding!`;
    } else {
      explanation = `Incorrect. You chose '${selectedText}', but the correct answer is '${correctText}'. Review the lesson notes on this concept to reinforce your understanding.`;
    }

    questionDetails.push({
      id: q.id,
      text: q.text,
      options: q.options,
      selectedAnswer: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation,
    });
  });

  const totalQuestions = quiz.questions.length;
  const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
  
  let adaptivePath: 'remedial' | 'standard' | 'advanced' = 'standard';
  let pointsEarned = 0;

  if (score >= 85) {
    adaptivePath = 'advanced';
    pointsEarned = 200 + score; // Base 200 + score bonus
  } else if (score >= 60) {
    adaptivePath = 'standard';
    pointsEarned = 150 + score; // Base 150 + score bonus
  } else {
    adaptivePath = 'remedial';
    pointsEarned = 50 + score; // Remedial base + score
  }

  return {
    score,
    correctCount: correct,
    totalQuestions,
    adaptivePath,
    pointsEarned,
    questionDetails,
  };
};
