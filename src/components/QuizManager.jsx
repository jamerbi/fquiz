import React from 'react';

const QuizManager = ({ quizzes, startQuiz, resetQuiz, setCurrentView, onEditQuiz, onDeleteQuiz }) => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Manage Quizzes</h2>
      {quizzes.length === 0 ? (
        <p className="text-center">No quizzes saved yet. Create a new quiz to get started!</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="bg-white dark:bg-gray-800 p-6 rounded shadow-md flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0"
            >
              <div className="flex-grow">
                <span className="font-semibold text-lg break-words">{quiz.name}</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  ({quiz.questions.length} questions, {quiz.type})
                </span>
                <div className="mt-2 text-sm">
                  <p>Times completed: {quiz.stats.timesCompleted}</p>
                  <p>Average time: {quiz.stats.averageTime.toFixed(2)} seconds</p>
                  <p>Questions answered: {quiz.stats.questionsAnswered}</p>
                </div>
              </div>

              <div className="flex flex-shrink-0 space-x-2">
                <button
                  onClick={() => startQuiz(quiz)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Start Quiz
                </button>
                <button
                  onClick={() => onEditQuiz(quiz)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteQuiz(quiz.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => setCurrentView('create')}
        className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded block mx-auto md:ml-0"
      >
        Create New Quiz
      </button>
    </div>
  );
};

export default QuizManager;
