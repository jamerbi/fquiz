// src/components/QuestionInput.jsx
import React from 'react';

const QuestionInput = ({ value, onChange }) => (
  <textarea
    className="w-full p-2 border rounded"
    value={value}
    onChange={onChange}
    placeholder="Enter your questions here..."
    rows={10}
  />
);

export default QuestionInput;
