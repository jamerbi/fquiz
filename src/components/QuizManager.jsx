import React from 'react';

const QuizManager = ({ quizzes, startQuiz, resetQuiz, setCurrentView }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes saved yet. Create a new quiz to get started!</p>
      ) : (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <span className="font-semibold">{quiz.name}</span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                ({quiz.questions.length} questions, {quiz.type})
              </span>
              <button
                onClick={() => startQuiz(quiz)}
                className="ml-4 px-3 py-1 bg-blue-600 text-white rounded"
              >
                Start Quiz
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setCurrentView('create')}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Create New Quiz
      </button>
    </div>
  );
};

export default QuizManager;