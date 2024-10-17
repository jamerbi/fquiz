import React, { useState, useEffect, useRef } from 'react';
import QuizHeader from './QuizHeader';
import QuizQuestion from './QuizQuestion';
import QuizSetup from './QuizSetup';
import useKeyboardNavigation from './useKeyboardNavigation';

import stringSimilarity from 'string-similarity';

const Quiz = ({ quizData, timeLimit, quizName, onComplete }) => {
  const questionRefs = useRef([]);
  const inputRefs = useRef(quizData.map(() => React.createRef()));

  const [answerMode, setAnswerMode] = useState('select'); // 'select' or 'type'
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalQuestions = quizData.length;
  const answeredQuestions = Object.keys(userAnswers).length;

  useEffect(() => {
    if (isQuizStarted) {
      setQuizStartTime(Date.now());
    }
  }, [isQuizStarted]);

  useEffect(() => {
    if (answeredQuestions > 0 && answeredQuestions < totalQuestions) {
      const nextIndex = answeredQuestions;
      if (questionRefs.current[nextIndex]) {
        questionRefs.current[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setCurrentQuestionIndex(nextIndex);
    }
  }, [answeredQuestions, totalQuestions]);

  useEffect(() => {
    if (answeredQuestions === totalQuestions) {
      const quizResults = {
        time: (Date.now() - quizStartTime) / 1000,
        answeredQuestions: totalQuestions,
        questionResults: Object.entries(userAnswers).map(([number, answer]) => ({
          id: number,
          correct: isAnswerCorrect(quizData.find(q => q.number === number), answer)
        }))
      };
      onComplete(quizResults);
    }
  }, [answeredQuestions, totalQuestions, quizData, quizStartTime, onComplete]);

  const isAnswerCorrect = (question, answer) => {
    if (answerMode === 'select') {
      return answer === question.correctAnswer;
    } else {
      let correctAnswer = question.options.find(option => (option.label === question.correctAnswer)).answer;
      const similarity = stringSimilarity.compareTwoStrings(correctAnswer.toLowerCase().trim(), answer.toLowerCase().trim());
      return similarity >= 0.8;
    }
  };

  const handleAnswerSubmission = (questionNumber, answer) => {
    const question = quizData.find(q => q.number === questionNumber);
    const isCorrect = isAnswerCorrect(question, answer);

    setFeedback(prev => ({ ...prev, [questionNumber]: isCorrect ? 'correct' : 'incorrect' }));

    if (isCorrect && currentQuestionIndex < totalQuestions - 1) {
      setUserAnswers(prev => ({ ...prev, [questionNumber]: answer }));
      setCurrentQuestionIndex(prev => Math.min(prev + 1, totalQuestions - 1));

      setTimeout(() => {
        const nextInput = inputRefs.current[currentQuestionIndex + 1].current;
        if (nextInput) {
          nextInput.focus();
        }
      }, 0);
    }
  };

  useKeyboardNavigation(quizData, currentQuestionIndex, userAnswers, handleAnswerSubmission, answerMode);

  if (!isQuizStarted) {
    return (
      <QuizSetup
        onStart={(mode) => {
          setAnswerMode(mode);
          setIsQuizStarted(true);
        }}
      />
    );
  }

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
        <div key={q.number} ref={el => questionRefs.current[index] = el}>
          <QuizQuestion
            key={q.number}
            question={q}
            answerMode={answerMode}
            feedback={feedback[q.number]}
            userAnswer={userAnswers[q.number]}
            onAnswerSubmission={handleAnswerSubmission}
            isCurrent={index === currentQuestionIndex}
            inputRef={inputRefs.current[index]}
          />
        </div>
      ))}
    </div>
  );
};

export default Quiz;

