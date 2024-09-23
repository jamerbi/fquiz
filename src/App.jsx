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

  const handleGenerateQuiz = () => {
    const questions = parseQuestions(questionText, quizType);
    const answers = parseAnswers(answerText, quizType);
    const quiz = generateQuiz(questions, answers);
    setQuizData(quiz);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Add title */}
      <h1 className="text-center text-4xl font-bold mb-6 text-blue-600">fQuiz</h1>

      {!quizData.length ? (
        <div className="space-y-4">
          {/* Add quiz type selection */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Select Quiz Type:</label>
            <select
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              className="px-4 py-2 border rounded"
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
  );
}

export default App;
