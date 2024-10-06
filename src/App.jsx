import React, { useState, useEffect } from 'react';
import QuizManager from './components/QuizManager';
import QuizForm from './components/QuizForm';
import QuizView from './components/QuizView';
import Header from './components/Header';
import QuizOptions from './components/QuizOptions';
import { parseQuestions, parseAnswers, generateQuiz, parseFlashcards } from './utils/parser';
import { initializeDB, saveQuizToDB, loadQuizzesFromDB, updateQuizStats } from './utils/database';
import { shuffleArray } from './utils/app';

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
      userId,
      stats: {
        timesCompleted: 0,
        averageTime: 0,
        questionsAnswered: 0,
        questionStats: configuredQuiz.questions.map((q) => ({
          id: q.number,
          timesAnswered: 0,
          timesCorrect: 0,
        })),
      },
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

  const handleQuizCompletion = (quizResults) => {
    updateQuizStats(currentQuiz.id, quizResults).then(() => {
      loadQuizzesFromDB().then(loadedQuizzes => {
        setQuizzes(loadedQuizzes);
      });
    });
    setCurrentView('complete');
  };

  const resetQuiz = () => {
    setCurrentQuiz(null);
    setCurrentView('create');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="p-4 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="mx-auto max-w-3xl">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} setCurrentView={setCurrentView} />

          {currentView === 'create' && (
            <QuizForm
              quizFormat={quizFormat}
              setQuizFormat={setQuizFormat}
              quizType={quizType}
              setQuizType={setQuizType}
              questionText={questionText}
              setQuestionText={setQuestionText}
              answerText={answerText}
              setAnswerText={setAnswerText}
              handleGenerateQuiz={handleGenerateQuiz}
            />
          )}

          {currentView === 'options' && (
            <QuizOptions
              quizData={quizData}
              onSaveAndStart={saveQuiz}
              onCancel={resetQuiz}
            />
          )}

          {currentView === 'quiz' && currentQuiz && (
            <QuizView 
              currentQuiz={currentQuiz} 
              resetQuiz={resetQuiz} 
              handleQuizCompletion={handleQuizCompletion} />
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

          {currentView === 'complete' && (
            <div>
              <h2>Quiz Completed!</h2>
              <button onClick={resetQuiz}>Create a new quiz</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
