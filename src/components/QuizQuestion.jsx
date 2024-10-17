import React, { useState } from 'react';

const QuizQuestion = ({
    question,
    answerMode,
    feedback,
    userAnswer,
    onAnswerSubmission,
    isCurrent,
    inputRef
}) => {
    const [typedAnswer, setTypedAnswer] = useState('');
    const [showOptions, setShowOptions] = useState(answerMode === 'select');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (answerMode === 'type' && typedAnswer.trim() !== '') {
            onAnswerSubmission(question.number, typedAnswer);
        }
    };

    const handleOptionClick = (optionLabel) => {
        if (answerMode === 'select') {
            onAnswerSubmission(question.number, optionLabel);
        }
    };

    const getCardColor = () => {
        if (feedback === 'correct') return 'bg-green-100 dark:bg-green-900 border-green-400 dark:border-green-600';
        if (feedback === 'incorrect') return 'bg-red-100 dark:bg-red-900 border-red-400 dark:border-red-600';
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600';
    };

    return (
        <div
            className={`p-3 rounded-xl shadow-md transition-all duration-300 border ${getCardColor()} ${isCurrent ? 'ring-2 ring-blue-500' : ''}`}
        >
            <h3 className="text-lg sm:text-base font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 dark:border-gray-500">
                {question.number}. {question.text}
            </h3>

            {answerMode === 'type' && (
                <div className="mb-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={showOptions}
                            onChange={() => setShowOptions(!showOptions)}
                            className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span>Show answer options</span>
                    </label>
                </div>
            )}

            {answerMode === 'select' && (showOptions || feedback) && (
                <div className="grid grid-cols-1 gap-4 mb-4">
                    {question.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt.label)}
                            disabled={feedback === 'correct'}
                            className={`w-full py-3 px-4 sm:py-2 sm:px-2 rounded-lg font-medium text-left flex items-center space-x-3 transition-all duration-200
${userAnswer === opt.label
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
            )}

            {answerMode === 'type' && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <input
                        type="text"
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        placeholder="Type your answer here"
                        className="w-full p-2 border rounded mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                        disabled={feedback === 'correct'}
                        ref={inputRef}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                        disabled={feedback === 'correct'}
                    >
                        Submit Answer
                    </button>
                </form>
            )}

            {showOptions && answerMode === 'type' && (
                <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                    <h4 className="font-semibold mb-2">Answer options:</h4>
                    <ul className="list-disc pl-5">
                        {question.options.map((opt, idx) => (
                            <li key={idx}>{opt.answer}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuizQuestion;