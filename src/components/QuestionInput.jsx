import React from 'react';

const QuestionInput = ({ value, onChange }) => (
  <textarea
    className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
    value={value}
    onChange={onChange}
    placeholder="Enter your questions here..."
    rows={10}
  />
);

export default QuestionInput;
