import React, { useRef, useState, useEffect } from 'react';
import QuizHeader from './QuizHeader';
import QuizQuestion from './QuizQuestion';
import useKeyboardNavigation from './useKeyboardNavigation';

const Quiz = ({ quizData, timeLimit, quizName, onComplete }) => {
  const questionRefs = useRef([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [feedback, setFeedback] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizEndTime, setQuizEndTime] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalQuestions = quizData.length;
  const answeredQuestions = Object.keys(userAnswers).length;

  useEffect(() => {
    setQuizStartTime(Date.now());
  }, []);

  useEffect(() => {
    if (answeredQuestions > 0 && answeredQuestions < totalQuestions) {
      const nextIndex = answeredQuestions;
      if (questionRefs.current[nextIndex]) {
        const targetElement = questionRefs.current[nextIndex];
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setCurrentQuestionIndex(nextIndex);
    }

    if (answeredQuestions === totalQuestions) {
      setQuizEndTime(Date.now());
      const quizResults = {
        time: (Date.now() - quizStartTime) / 1000,
        answeredQuestions: totalQuestions,
        questionResults: Object.entries(userAnswers).map(([number, answer]) => ({
          id: number,
          correct: answer === quizData.find(q => q.number === number).correctAnswer
        }))
      };
      onComplete(quizResults);
    }
  }, [answeredQuestions, totalQuestions, quizData, quizStartTime, onComplete]);

  const handleAnswerSelection = (questionNumber, selectedOptionLabel, correctOptionLabel) => {
    const isCorrect = selectedOptionLabel === correctOptionLabel;

    setSelectedOptions((prev) => ({ ...prev, [questionNumber]: selectedOptionLabel }));

    if (isCorrect) {
      setUserAnswers((prev) => ({ ...prev, [questionNumber]: selectedOptionLabel }));
      setFeedback((prev) => ({ ...prev, [questionNumber]: 'correct' }));
    } else {
      setFeedback((prev) => ({ ...prev, [questionNumber]: 'incorrect' }));
    }
  };

  useKeyboardNavigation(quizData, currentQuestionIndex, userAnswers, handleAnswerSelection);

  return (
    <div className="relative flex flex-col space-y-6 px-1">
      <QuizHeader
        quizName={quizName}
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
        timeLimit={timeLimit}
        quizStartTime={quizStartTime}
      />

      {quizData.map((q, index) => (
        <QuizQuestion
          key={q.number}
          ref={(el) => (questionRefs.current[index] = el)}
          question={q}
          feedback={feedback[q.number]}
          selectedOption={selectedOptions[q.number]}
          userAnswer={userAnswers[q.number]}
          onAnswerSelection={handleAnswerSelection}
        />
      ))}
    </div>
  );
};

export default Quiz;