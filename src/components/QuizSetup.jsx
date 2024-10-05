import React, { useState } from 'react';

const QuizSetup = ({ onStart }) => {
    const [selectedMode, setSelectedMode] = useState('select');
  
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Quiz Setup</h2>
        <div className="mb-4">
          <label className="block mb-2">Choose answer mode:</label>
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            <option value="select">Select from options</option>
            <option value="type">Type the answer</option>
          </select>
        </div>
        <button
          onClick={() => onStart(selectedMode)}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
        >
          Start Quiz
        </button>
      </div>
    );
  };
  
  export default QuizSetup;