import React from 'react';

const QuizHeader = ({ quizName, answeredQuestions, totalQuestions, timeLimit, quizStartTime }) => (
    <div className="sticky top-0 w-full bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 z-10 p-4 sm:p-2 shadow-lg">
        <h2 className="text-xl font-bold mb-2">{quizName}</h2>
        <div className="relative w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 border-2 border-blue-500 dark:border-blue-300">
            <div
                className="bg-blue-600 dark:bg-blue-400 h-3 rounded-full transition-all"
                style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            ></div>
        </div>
        <p className="text-center mt-2 font-medium text-sm sm:text-xs">
            {answeredQuestions} of {totalQuestions} questions answered
        </p>
        {timeLimit > 0 && (
            <p className="text-center mt-1 font-medium text-sm sm:text-xs">
                Time remaining: {Math.max(0, timeLimit * 60 - Math.floor((Date.now() - quizStartTime) / 1000))} seconds
            </p>
        )}
    </div>
);

export default QuizHeader;