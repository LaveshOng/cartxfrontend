import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';
import './VerifyEmail.scss';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isVerifying = useRef(false);
  const [verificationStatus, setVerificationStatus] = useState({
    isLoading: true,
    isSuccess: false,
    error: null,
  });

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      // Prevent multiple API calls
      if (isVerifying.current) return;
      isVerifying.current = true;

      if (!token) {
        setVerificationStatus({
          isLoading: false,
          isSuccess: false,
          error: 'Verification token is missing',
        });
        isVerifying.current = false;
        return;
      }

      try {
        const response = await apiClient.auth.verifyEmail(token);
        if (response.status === 'success') {
          setVerificationStatus({
            isLoading: false,
            isSuccess: true,
            error: null,
          });
          showToast('Email verified successfully!', 'success');
          // Redirect to login after 3 seconds
          const timeoutId = setTimeout(() => {
            navigate('/');
          }, 3000);
          return () => clearTimeout(timeoutId);
        } else {
          throw new Error(response.message || 'Verification failed');
        }
      } catch (error) {
        setVerificationStatus({
          isLoading: false,
          isSuccess: false,
          error: error.message || 'Email verification failed',
        });
        showToast('Email verification failed', 'error');
      } finally {
        isVerifying.current = false;
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="verify-email">
      <div className="verify-email-container">
        {verificationStatus.isLoading ? (
          <div className="verify-email-loading">
            <div className="loader"></div>
            <p>Verifying your email...</p>
          </div>
        ) : verificationStatus.isSuccess ? (
          <div className="verify-email-success">
            <i className="fas fa-check-circle"></i>
            <h2>Email Verified Successfully!</h2>
            <p>Your email has been verified. You will be redirected to the login page shortly.</p>
          </div>
        ) : (
          <div className="verify-email-error">
            <i className="fas fa-exclamation-circle"></i>
            <h2>Verification Failed</h2>
            <p>{verificationStatus.error}</p>
            <button onClick={() => navigate('/')} className="back-to-home">
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
