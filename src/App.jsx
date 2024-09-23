import React, { useState } from 'react';
import QuestionInput from './components/QuestionInput';
import AnswerInput from './components/AnswerInput';
import Quiz from './components/Quiz';
import { parseQuestions, parseAnswers, generateQuiz } from './utils/parser';

function App() {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [quizType, setQuizType] = useState('multiple-choice'); // New state for quiz type
  const [darkMode, setDarkMode] = useState(false); // State to track dark mode

  const handleGenerateQuiz = () => {
    const questions = parseQuestions(questionText, quizType);
    const answers = parseAnswers(answerText, quizType);
    const quiz = generateQuiz(questions, answers);
    setQuizData(quiz);
  };

  // Toggle between dark and light mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="container mx-auto p-4 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-center text-4xl font-bold text-blue-600 dark:text-blue-400">fQuiz</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {!quizData.length ? (
          <div className="space-y-4">
            {/* Quiz Type Selection */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Select Quiz Type:</label>
              <select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value)}
                className="px-4 py-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="true-false">True/False</option>
              </select>
            </div>

            <QuestionInput value={questionText} onChange={(e) => setQuestionText(e.target.value)} />
            <AnswerInput value={answerText} onChange={(e) => setAnswerText(e.target.value)} />
            <button
              onClick={handleGenerateQuiz}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Generate Quiz
            </button>
          </div>
        ) : (
          <Quiz quizData={quizData} />
        )}
      </div>
    </div>
  );
}

export default App;
