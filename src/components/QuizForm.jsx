import QuestionInput from './QuestionInput';
import AnswerInput from './AnswerInput';

const QuizForm = ({ quizFormat, setQuizFormat, quizType, setQuizType, questionText, setQuestionText, answerText, setAnswerText, handleGenerateQuiz }) => (
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
);

export default QuizForm;
