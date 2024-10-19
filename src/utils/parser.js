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

  // For True/False quiz, add True/False as options if needed
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
      let correctOption = answerMatch[2]; // e.g., "True", "False" or "A"

      // Convert "True" and "False" to their corresponding labels for consistency
      if (correctOption === 'True') {
        correctOption = 'A';
      } else if (correctOption === 'False') {
        correctOption = 'B';
      }

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

export const parseFlashcards = (text, quizType) => {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  const flashcards = lines.map((line) => {
    const [question, answer] = line.split('\t').map((item) => item.trim());
    return { question, answer };
  });

  return flashcards.map((card, index) => {
    let options;
    let correctAnswer;
    let falseAnswer;

    if (quizType === 'multiple-choice') {
      // Generate 3 random incorrect options from other flashcards
      const incorrectOptions = flashcards
        .filter((_, i) => i !== index)
        .map((c) => c.answer)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      options = [
        { label: 'A', answer: card.answer },
        { label: 'B', answer: incorrectOptions[0] },
        { label: 'C', answer: incorrectOptions[1] },
        { label: 'D', answer: incorrectOptions[2] },
      ];

      // Shuffle options
      options = options.sort(() => 0.5 - Math.random());

      // Find the new position of the correct answer
      correctAnswer = options.find(opt => opt.answer === card.answer).label;
    } else if (quizType === 'true-false') {
      const isTrue = Math.random() < 0.5;
      falseAnswer = flashcards
        .filter((_, i) => i !== index)
        .map((c) => c.answer)
        .sort(() => 0.5 - Math.random())[0];

      options = [
        { label: 'A', answer: 'True' },
        { label: 'B', answer: 'False' },
      ];

      correctAnswer = isTrue ? 'A' : 'B';
    }

    return {
      number: (index + 1).toString(),
      text: `${card.question} -- ${quizType === 'true-false' ? (correctAnswer === 'A' ? card.answer : falseAnswer) : ''}`,
      options,
      correctAnswer,
    };
  });
};

// Unit tests for the utility functions
describe('Parser Utility Functions', () => {
  test('parseQuestions should correctly parse questions and options', () => {
    const text = `1. What is the capital of France?\nA. Paris\nB. London\nC. Berlin\nD. Madrid\n2. What is 2 + 2?\nA. 3\nB. 4\nC. 5\nD. 6`;
    const quizType = 'multiple-choice';
    const result = parseQuestions(text, quizType);
    expect(result).toEqual([
      {
        number: '1',
        text: 'What is the capital of France?',
        options: [
          { label: 'A', answer: 'Paris' },
          { label: 'B', answer: 'London' },
          { label: 'C', answer: 'Berlin' },
          { label: 'D', answer: 'Madrid' },
        ],
      },
      {
        number: '2',
        text: 'What is 2 + 2?',
        options: [
          { label: 'A', answer: '3' },
          { label: 'B', answer: '4' },
          { label: 'C', answer: '5' },
          { label: 'D', answer: '6' },
        ],
      },
    ]);
  });

  test('parseAnswers should correctly parse answers', () => {
    const text = `1. A\n2. B`;
    const result = parseAnswers(text);
    expect(result).toEqual({
      '1': 'A',
      '2': 'B',
    });
  });

  test('generateQuiz should correctly generate quiz with correct answers', () => {
    const questions = [
      {
        number: '1',
        text: 'What is the capital of France?',
        options: [
          { label: 'A', answer: 'Paris' },
          { label: 'B', answer: 'London' },
          { label: 'C', answer: 'Berlin' },
          { label: 'D', answer: 'Madrid' },
        ],
      },
      {
        number: '2',
        text: 'What is 2 + 2?',
        options: [
          { label: 'A', answer: '3' },
          { label: 'B', answer: '4' },
          { label: 'C', answer: '5' },
          { label: 'D', answer: '6' },
        ],
      },
    ];
    const answers = {
      '1': 'A',
      '2': 'B',
    };
    const result = generateQuiz(questions, answers);
    expect(result).toEqual([
      {
        number: '1',
        text: 'What is the capital of France?',
        options: [
          { label: 'A', answer: 'Paris' },
          { label: 'B', answer: 'London' },
          { label: 'C', answer: 'Berlin' },
          { label: 'D', answer: 'Madrid' },
        ],
        correctAnswer: 'A',
      },
      {
        number: '2',
        text: 'What is 2 + 2?',
        options: [
          { label: 'A', answer: '3' },
          { label: 'B', answer: '4' },
          { label: 'C', answer: '5' },
          { label: 'D', answer: '6' },
        ],
        correctAnswer: 'B',
      },
    ]);
  });

  test('parseFlashcards should correctly parse flashcards and generate options', () => {
    const text = `What is the capital of France?\tParis\nWhat is 2 + 2?\t4`;
    const quizType = 'multiple-choice';
    const result = parseFlashcards(text, quizType);
    expect(result.length).toBe(2);
    expect(result[0].options.length).toBe(4);
    expect(result[1].options.length).toBe(4);
  });
});
