import Quiz from './Quiz';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

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

// Unit tests for QuizView component
describe('QuizView Component', () => {
    const mockQuiz = {
        questions: [
            { number: 1, text: 'Question 1', options: [{ label: 'A', answer: 'Answer 1' }] },
            { number: 2, text: 'Question 2', options: [{ label: 'B', answer: 'Answer 2' }] }
        ],
        timeLimit: 10,
        name: 'Sample Quiz'
    };

    const mockResetQuiz = jest.fn();
    const mockHandleQuizCompletion = jest.fn();

    test('renders Quiz component with correct props', () => {
        render(<QuizView currentQuiz={mockQuiz} resetQuiz={mockResetQuiz} handleQuizCompletion={mockHandleQuizCompletion} />);
        expect(screen.getByText('Sample Quiz')).toBeInTheDocument();
        expect(screen.getByText('Question 1')).toBeInTheDocument();
        expect(screen.getByText('Question 2')).toBeInTheDocument();
    });

    test('calls resetQuiz function when End Quiz button is clicked', () => {
        render(<QuizView currentQuiz={mockQuiz} resetQuiz={mockResetQuiz} handleQuizCompletion={mockHandleQuizCompletion} />);
        fireEvent.click(screen.getByText('End Quiz'));
        expect(mockResetQuiz).toHaveBeenCalled();
    });
});
