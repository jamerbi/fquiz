import React, { forwardRef } from 'react';

const QuizQuestion = forwardRef(({ question, feedback, selectedOption, userAnswer, onAnswerSelection }, ref) => (
  <div
    ref={ref}
    className={`p-3 rounded-xl shadow-md transition-all duration-300 border ${
      feedback === 'correct'
        ? 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
    }`}
  >
    <h3 className="text-lg sm:text-base font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-500">
      {question.number}. {question.text}
    </h3>

    <div className="grid grid-cols-1 gap-4">
      {question.options.map((opt, idx) => (
        <button
          key={idx}
          onClick={() => onAnswerSelection(question.number, opt.label, question.correctAnswer)}
          disabled={userAnswer !== undefined}
          className={`w-full py-3 px-4 sm:py-2 sm:px-2 rounded-lg font-medium text-left flex items-center space-x-3 transition-all duration-200
            ${
              selectedOption === opt.label
                ? feedback === 'correct'
                  ? 'bg-green-500 dark:bg-green-700 text-white'
                  : 'bg-red-500 dark:bg-red-700 text-white'
                : 'bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-600'
            }`}
        >
          <div className="flex-shrink-0 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-white dark:bg-gray-300 text-blue-500 dark:text-blue-800 font-semibold flex justify-center items-center">
            {opt.label}
          </div>
          <span className="flex-grow">{opt.answer}</span>
        </button>
      ))}
    </div>
  </div>
));

export default QuizQuestion;