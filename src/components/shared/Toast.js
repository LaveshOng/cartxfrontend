import React, { useEffect } from 'react';
import './Toast.scss';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        {type === 'success' && <i className="fas fa-check-circle"></i>}
        {type === 'error' && <i className="fas fa-exclamation-circle"></i>}
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;
