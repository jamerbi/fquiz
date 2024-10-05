import { useEffect } from 'react';

const useKeyboardNavigation = (quizData, currentQuestionIndex, userAnswers, handleAnswerSubmission, answerMode) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (answerMode !== 'select') return; // Only handle keyboard navigation for 'select' mode

      const currentQuestion = quizData[currentQuestionIndex];
      if (!currentQuestion || userAnswers[currentQuestion.number]) return;

      const optionCount = currentQuestion.options.length;
      let selectedIndex = -1;

      if (optionCount === 2) {
        // For true/false questions
        if (['1', 'm'].includes(event.key)) selectedIndex = 0;
        if (['2', ','].includes(event.key)) selectedIndex = 1;
      } else if (optionCount === 4) {
        // For four-choice questions
        if (['1', 'm'].includes(event.key)) selectedIndex = 0;
        if (['2', ','].includes(event.key)) selectedIndex = 1;
        if (['3', '.'].includes(event.key)) selectedIndex = 2;
        if (['4', '/'].includes(event.key)) selectedIndex = 3;
      }

      if (selectedIndex !== -1) {
        const selectedOption = currentQuestion.options[selectedIndex];
        handleAnswerSubmission(currentQuestion.number, selectedOption.label);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [quizData, currentQuestionIndex, userAnswers, handleAnswerSubmission, answerMode]);
};

export default useKeyboardNavigation;