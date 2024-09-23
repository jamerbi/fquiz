import React from 'react';

const AnswerInput = ({ value, onChange }) => (
  <textarea
    className="w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white dark:border-gray-600"
    value={value}
    onChange={onChange}
    placeholder="Enter your answers here..."
    rows={5}
  />
);

export default AnswerInput;
