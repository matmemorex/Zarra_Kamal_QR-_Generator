import React from 'react';

const Alert = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="alert alert-success">
      <span className="alert-icon">✓</span>
      <span className="alert-message">{message}</span>
    </div>
  );
};

export default Alert;
