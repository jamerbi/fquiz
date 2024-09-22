// src/components/AnswerInput.jsx
import React from 'react';

const AnswerInput = ({ value, onChange }) => (
  <textarea
    className="w-full p-2 border rounded"
    value={value}
    onChange={onChange}
    placeholder="Enter your answers here..."
    rows={5}
  />
);

export default AnswerInput;
