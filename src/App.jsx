// src/App.jsx
import React, { useState } from 'react';
import QuestionInput from './components/QuestionInput';
import AnswerInput from './components/AnswerInput';
import Quiz from './components/Quiz';
import { parseQuestions, parseAnswers, generateQuiz } from './utils/parser';

function App() {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [quizData, setQuizData] = useState([]);

  const handleGenerateQuiz = () => {
    const questions = parseQuestions(questionText);
    const answers = parseAnswers(answerText);
    const quiz = generateQuiz(questions, answers);
    setQuizData(quiz);
  };

  return (
    <div className="container mx-auto p-4">
      {!quizData.length ? (
        <div className="space-y-4">
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
