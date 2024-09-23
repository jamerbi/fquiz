import React, { useRef, useState, useEffect } from 'react';

const Quiz = ({ quizData }) => {
  const questionRefs = useRef([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({}); // Track feedback for each question

  // Track the number of questions answered
  const totalQuestions = quizData.length;
  const answeredQuestions = Object.keys(userAnswers).length;

  // Handle the scrolling effect when an answer is correct
  useEffect(() => {
    if (answeredQuestions > 0 && answeredQuestions < totalQuestions) {
      const nextIndex = answeredQuestions; // Get the next question index
      if (questionRefs.current[nextIndex]) {
        const targetElement = questionRefs.current[nextIndex];
        // Scroll to the middle of the screen
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [answeredQuestions]);

  const handleAnswerSelection = (questionNumber, selectedOptionLabel, correctOptionLabel) => {
    // Handle True/False answers: map True = 'A', False = 'B'
    const isCorrect = selectedOptionLabel === correctOptionLabel;
    if (isCorrect) {
      setUserAnswers((prev) => ({ ...prev, [questionNumber]: selectedOptionLabel }));
      setFeedback((prev) => ({ ...prev, [questionNumber]: 'correct' }));
    } else {
      setFeedback((prev) => ({ ...prev, [questionNumber]: 'incorrect' }));
    }
  };

  return (
    <div className="relative flex flex-col space-y-6 px-1">
      {/* Sticky Progress bar */}
      <div className="sticky top-0 w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 z-10 p-4 sm:p-2 shadow-lg">
        <div className="relative w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 border-2 border-blue-500 dark:border-blue-300">
          <div
            className="bg-blue-600 dark:bg-blue-400 h-3 rounded-full transition-all"
            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 font-medium text-sm sm:text-xs">
          {answeredQuestions} of {totalQuestions} questions answered
        </p>
      </div>

      {quizData.map((q, index) => (
        <div
          key={q.number}
          ref={(el) => (questionRefs.current[index] = el)}
          className={`p-3 rounded-xl shadow-md transition-all duration-300 border ${
            feedback[q.number] === 'correct'
              ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
          }`}
        >
          <h3 className="text-lg sm:text-base font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-500">
            {q.number}. {q.text}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() =>
                  handleAnswerSelection(q.number, opt.label, q.correctAnswer)
                }
                disabled={userAnswers[q.number] !== undefined}
                className={`w-full py-3 px-4 sm:py-2 sm:px-2 rounded-lg font-medium text-left flex items-center space-x-3 transition-all duration-200
                  ${
                    userAnswers[q.number] === opt.label
                      ? feedback[q.number] === 'correct'
                        ? 'bg-green-500 dark:bg-green-700 text-white'
                        : 'bg-red-500 dark:bg-red-700 text-white'
                      : 'bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-600'
                  }`}
              >
                {/* Circle for the option letter */}
                <div className="flex-shrink-0 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-gray-300 text-blue-500 dark:text-blue-800 font-semibold flex justify-center items-center">
                  {opt.label}
                </div>
                <span className="flex-grow">{opt.answer}</span>
              </button>
            ))}
          </div>

          {feedback[q.number] === 'incorrect' && (
            <p className="text-red-600 dark:text-red-400 mt-3 font-medium text-sm">Wrong answer! Please try again.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Quiz;
