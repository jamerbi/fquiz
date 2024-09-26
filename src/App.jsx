import React, { useState, useEffect } from 'react';
import QuestionInput from './components/QuestionInput';
import AnswerInput from './components/AnswerInput';
import Quiz from './components/Quiz';
import QuizManager from './components/QuizManager';
import QuizOptions from './components/QuizOptions';
import { parseQuestions, parseAnswers, generateQuiz } from './utils/parser';

function App() {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [quizType, setQuizType] = useState('multiple-choice');
  const [darkMode, setDarkMode] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [currentView, setCurrentView] = useState('create'); // 'create', 'options', 'quiz', or 'manage'
  const [currentQuiz, setCurrentQuiz] = useState(null);

  useEffect(() => {
    const storedQuizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    setQuizzes(storedQuizzes);
  }, []);

  const handleGenerateQuiz = () => {
    const questions = parseQuestions(questionText, quizType);
    const answers = parseAnswers(answerText, quizType);
    const quiz = generateQuiz(questions, answers);
    setQuizData(quiz);
    setCurrentView('options');
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const saveQuiz = (configuredQuiz) => {
    const newQuiz = {
      ...configuredQuiz,
      id: Date.now(),
      type: quizType,
    };
    const updatedQuizzes = [...quizzes, newQuiz];
    setQuizzes(updatedQuizzes);
    localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes));
    startQuiz(newQuiz);
  };

  const startQuiz = (quiz) => {
    let quizQuestions = [...quiz.questions];
    if (quiz.randomized) {
      quizQuestions = shuffleArray(quizQuestions);
    }
    setCurrentQuiz({...quiz, questions: quizQuestions});
    setCurrentView('quiz');
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const resetQuiz = () => {
    setQuizData([]);
    setQuestionText('');
    setAnswerText('');
    setCurrentQuiz(null);
    setCurrentView('create');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="container mx-auto p-4 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-center text-4xl font-bold text-blue-600 dark:text-blue-400">fQuiz</h1>
          <div>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={() => setCurrentView('manage')}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Manage Quizzes
            </button>
          </div>
        </div>

        {currentView === 'create' && (
          <div className="space-y-4">
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
        )}

        {currentView === 'options' && (
          <QuizOptions
            quizData={quizData}
            onSaveAndStart={saveQuiz}
            onCancel={resetQuiz}
          />
        )}

{currentView === 'quiz' && currentQuiz && (
          <div>
            <Quiz 
              quizData={currentQuiz.questions} 
              timeLimit={currentQuiz.timeLimit}
              quizName={currentQuiz.name}
            />
            <div className="mt-4 space-x-2">
              <button
                onClick={resetQuiz}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                End Quiz
              </button>
            </div>
          </div>
        )}

        {currentView === 'manage' && (
          <QuizManager
            quizzes={quizzes}
            startQuiz={startQuiz}
            resetQuiz={resetQuiz}
            setCurrentView={setCurrentView}
          />
        )}
      </div>
    </div>
  );
}

export default App;