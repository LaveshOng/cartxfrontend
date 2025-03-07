import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EmailConfirmationPage.scss';

const EmailConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || sessionStorage.getItem('userEmail');

  const handleResendEmail = () => {
    // TODO: Implement resend email functionality
    console.log('Resending email to:', email);
  };

  return (
    <div className="email-confirmation">
      <div className="container">
        <div className="email-confirmation-content">
          <div className="email-confirmation-icon">
            <i className="fas fa-envelope-open-text"></i>
          </div>
          <h1 className="email-confirmation-title">Check your email</h1>
          <p className="email-confirmation-message">
            We've sent a verification link to <strong>{email}</strong>. Please check your email and click the link to verify your account.
          </p>
          <div className="email-confirmation-actions">
            <button className="resend-btn" onClick={handleResendEmail}>
              Resend verification email
            </button>
            <button className="back-btn" onClick={() => navigate('/')}>
              Back to home
            </button>
          </div>
          <p className="email-confirmation-help">
            Didn't receive the email? Check your spam folder or try a different email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage; 