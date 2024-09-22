import React, { useRef, useState, useEffect } from 'react';

const Quiz = ({ quizData }) => {
  const questionRefs = useRef([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({}); // Track feedback for each question

  // Track the number of questions answered
  const totalQuestions = quizData.length;
  const answeredQuestions = Object.keys(userAnswers).length;

  // Handle the scrolling effect when an answer is correct
  useEffect(() => {
    if (answeredQuestions > 0 && answeredQuestions < totalQuestions) {
      const nextIndex = answeredQuestions; // Get the next question index
      if (questionRefs.current[nextIndex]) {
        const targetElement = questionRefs.current[nextIndex];
        // Scroll to the middle of the screen
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [answeredQuestions]);

  const handleAnswerSelection = (questionNumber, selectedOptionLabel, correctOptionLabel) => {
    if (selectedOptionLabel === correctOptionLabel) {
      setUserAnswers((prev) => ({ ...prev, [questionNumber]: selectedOptionLabel }));
      setFeedback((prev) => ({ ...prev, [questionNumber]: 'correct' }));
    } else {
      setFeedback((prev) => ({ ...prev, [questionNumber]: 'incorrect' }));
    }
  };

  return (
    <div className="relative flex flex-col space-y-6 px-4">
      {/* Sticky Progress bar */}
      <div className="sticky top-0 w-full bg-white z-10 p-4">
        <div className="w-full bg-gray-300 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <p className="text-center mt-2 font-medium">
          {answeredQuestions} of {totalQuestions} questions answered
        </p>
      </div>

      {quizData.map((q, index) => (
        <div
          key={q.number}
          ref={(el) => (questionRefs.current[index] = el)}
          className={`p-6 rounded-xl shadow-md transition-all duration-300 border ${
            feedback[q.number] === 'correct' ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            {q.number}. {q.text}
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() =>
                  handleAnswerSelection(q.number, opt.label, q.correctAnswer)
                }
                disabled={userAnswers[q.number] !== undefined}
                className={`w-full py-3 px-4 rounded-lg font-medium text-left flex items-center space-x-3 transition-all duration-200
                  ${
                    userAnswers[q.number] === opt.label
                      ? feedback[q.number] === 'correct'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
              >
                {/* Circle for the option letter */}
                <div className="w-8 h-8 rounded-full bg-white text-blue-500 font-semibold flex justify-center items-center">
                  {opt.label}
                </div>
                <span>{opt.answer}</span>
              </button>
            ))}
          </div>

          {feedback[q.number] === 'incorrect' && (
            <p className="text-red-600 mt-3 font-medium">Wrong answer! Please try again.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Quiz;
