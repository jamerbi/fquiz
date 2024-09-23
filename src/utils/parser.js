export const parseQuestions = (text, quizType) => {
  const lines = text.split('\n').filter((line) => line.trim() !== ''); // Split by new lines and filter out empty lines
  const questions = [];
  let currentQuestion = null;

  lines.forEach((line) => {
    const questionMatch = line.match(/^(\d+)\.\s+(.*)/); // Match question number and text
    const optionMatch = line.match(/^([A-D])\.\s+(.*)/); // Match options A, B, C, D

    if (questionMatch) {
      if (currentQuestion) {
        questions.push(currentQuestion); // Push the previous question before starting a new one
      }
      currentQuestion = {
        number: questionMatch[1], // Question number (e.g., 1)
        text: questionMatch[2], // Question text (e.g., "What does a JavaScript promise represent?")
        options: [], // To store A, B, C, D or True/False options
      };
    } else if (optionMatch && currentQuestion) {
      currentQuestion.options.push({
        label: optionMatch[1], // Option label (e.g., "A")
        answer: optionMatch[2], // Option text (e.g., "A future value")
      });
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion); // Push the last question
  }

  // For True/False quiz, add True/False as options
  if (quizType === 'true-false') {
    questions.forEach((q) => {
      q.options = [
        { label: 'A', answer: 'True' },
        { label: 'B', answer: 'False' },
      ];
    });
  }

  return questions;
};

export const parseAnswers = (text) => {
  const lines = text.split('\n').filter((line) => line.trim() !== ''); // Split by new lines and filter out empty lines
  const answers = {};

  lines.forEach((line) => {
    const answerMatch = line.match(/^(\d+)\.\s+(True|False|[A-D])/); // Match question number and correct option
    if (answerMatch) {
      const questionNumber = answerMatch[1]; // e.g., 1
      const correctOption = answerMatch[2]; // e.g., "True" or "A"
      answers[questionNumber] = correctOption;
    }
  });

  return answers;
};

export const generateQuiz = (questions, answers) => {
  return questions.map((q) => {
    const correctAnswer = answers[q.number];
    return {
      ...q,
      correctAnswer,
    };
  });
};
