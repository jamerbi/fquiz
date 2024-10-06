import Quiz from './Quiz'

const QuizView = ({ currentQuiz, resetQuiz, handleQuizCompletion }) => (
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
);

export default QuizView;
