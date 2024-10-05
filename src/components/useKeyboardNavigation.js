import { useEffect } from 'react';

const useKeyboardNavigation = (quizData, currentQuestionIndex, userAnswers, handleAnswerSelection) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const currentQuestion = quizData[currentQuestionIndex];
      if (!currentQuestion) return;

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

      if (selectedIndex !== -1 && !userAnswers[currentQuestion.number]) {
        const selectedOption = currentQuestion.options[selectedIndex];
        handleAnswerSelection(
          currentQuestion.number,
          selectedOption.label,
          currentQuestion.correctAnswer
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentQuestionIndex, quizData, userAnswers, handleAnswerSelection]);
};

export default useKeyboardNavigation;