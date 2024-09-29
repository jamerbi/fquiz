import React, { useState } from 'react';

const QuizOptions = ({ quizData, onSaveAndStart, onCancel, quizFormat }) => {
  const [quizName, setQuizName] = useState(`Quiz ${Date.now()}`);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(quizData.length);
  const [timeLimit, setTimeLimit] = useState(0);
  const [randomizeOrder, setRandomizeOrder] = useState(false);

  const handleSaveAndStart = () => {
    let selectedQuestions = quizData.slice(0, selectedQuestionCount);
    if (randomizeOrder) {
      selectedQuestions = shuffleArray(selectedQuestions);
    }

    const configuredQuiz = {
      name: quizName,
      questions: selectedQuestions,
      timeLimit: timeLimit,
      randomized: randomizeOrder,
      format: quizFormat
    };
    onSaveAndStart(configuredQuiz);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Quiz Options</h2>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Quiz Name:</label>
        <input
          type="text"
          value={quizName}
          onChange={(e) => setQuizName(e.target.value)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Quiz Format:</label>
        <input
          type="text"
          value={quizFormat}
          readOnly
          className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Total Questions Available:</label>
        <input
          type="number"
          value={quizData.length}
          readOnly
          className="w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-600 dark:text-gray-300"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Number of Questions to Include:</label>
        <input
          type="number"
          min="1"
          max={quizData.length}
          value={selectedQuestionCount}
          onChange={(e) => setSelectedQuestionCount(Math.min(parseInt(e.target.value) || 1, quizData.length))}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Time Limit (minutes, 0 for no limit):</label>
        <input
          type="number"
          min="0"
          value={timeLimit}
          onChange={(e) => setTimeLimit(parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={randomizeOrder}
            onChange={(e) => setRandomizeOrder(e.target.checked)}
            className="mr-2"
          />
          <span className="font-semibold">Randomize Question Order</span>
        </label>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Preview (First 3 Questions):</h3>
        <ul className="list-disc pl-5">
          {quizData.slice(0, 3).map((question, index) => (
            <li key={index} className="mb-1">{question.text}</li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAndStart}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save and Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizOptions;