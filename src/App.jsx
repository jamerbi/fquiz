import React, { useState, useEffect } from 'react';
import QuestionInput from './components/QuestionInput';
import AnswerInput from './components/AnswerInput';
import Quiz from './components/Quiz';
import QuizManager from './components/QuizManager';
import QuizOptions from './components/QuizOptions';
import { parseQuestions, parseAnswers, generateQuiz, parseFlashcards } from './utils/parser';
import { initializeDB, saveQuizToDB, loadQuizzesFromDB, updateQuizStats } from './utils/database';

function App() {
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [quizType, setQuizType] = useState('multiple-choice');
  const [darkMode, setDarkMode] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [currentView, setCurrentView] = useState('create');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizFormat, setQuizFormat] = useState('standard');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
        } else {
          const newUserId = `user_${Date.now()}`;
          localStorage.setItem('userId', newUserId);
          setUserId(newUserId);
        }

        const storedDarkMode = localStorage.getItem('darkMode') === 'true';
        setDarkMode(storedDarkMode);

        await initializeDB();
        const loadedQuizzes = await loadQuizzesFromDB();
        setQuizzes(loadedQuizzes);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing app:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleGenerateQuiz = () => {
    let quiz;
    if (quizFormat === 'standard') {
      const questions = parseQuestions(questionText, quizType);
      const answers = parseAnswers(answerText, quizType);
      quiz = generateQuiz(questions, answers);
    } else if (quizFormat === 'flashcards') {
      quiz = parseFlashcards(questionText, quizType);
    }
    setQuizData(quiz);
    setCurrentView('options');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const saveQuiz = (configuredQuiz) => {
    const newQuiz = {
      ...configuredQuiz,
      id: Date.now(),
      type: quizType,
      userId: userId,
      stats: {
        timesCompleted: 0,
        averageTime: 0,
        questionsAnswered: 0,
        questionStats: configuredQuiz.questions.map(q => ({
          id: q.number,
          timesAnswered: 0,
          timesCorrect: 0
        }))
      }
    };
    saveQuizToDB(newQuiz).then(() => {
      setQuizzes([...quizzes, newQuiz]);
      startQuiz(newQuiz);
    });
  };

  const startQuiz = (quiz) => {
    let quizQuestions = [...quiz.questions];
    if (quiz.randomized) {
      quizQuestions = shuffleArray(quizQuestions);
    }
    setCurrentQuiz({ ...quiz, questions: quizQuestions });
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

  const handleQuizCompletion = (quizResults) => {
    updateQuizStats(currentQuiz.id, quizResults).then(() => {
      loadQuizzesFromDB().then(loadedQuizzes => {
        setQuizzes(loadedQuizzes);
      });
    });
    setCurrentView('manage');
  };
  
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="mx-auto max-w-3xl">
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
              <label className="block mb-2 font-semibold">Select Quiz Format:</label>
              <select
                value={quizFormat}
                onChange={(e) => setQuizFormat(e.target.value)}
                className="px-4 py-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
              >
                <option value="standard">Standard</option>
                <option value="flashcards">Flashcards</option>
              </select>
            </div>
            {quizFormat === 'standard' && (
              <>
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
              </>
            )}
            {quizFormat === 'flashcards' && (
              <>
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
                <QuestionInput
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter flashcards (one per line, question and answer separated by a tab)"
                />
              </>
            )}
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
              onComplete={handleQuizCompletion}
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
            onEditQuiz={(quiz) => {
              setQuizData(quiz.questions);
              setCurrentView('options');
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
}

export default App;