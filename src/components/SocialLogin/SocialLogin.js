import React from 'react';
import { apiClient } from '../../utils/apiClient';
import './SocialLogin.scss';

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = apiClient.auth.getGoogleAuthUrl();
  };

  const handleMicrosoftLogin = () => {
    window.location.href = apiClient.auth.getMicrosoftAuthUrl();
  };

  const handleAppleLogin = () => {
    window.location.href = apiClient.auth.getAppleAuthUrl();
  };

  return (
    <div className="social-login">
      <button className="social-btn google" onClick={handleGoogleLogin}>
        <img src="/images/google-icon.svg" alt="Google" />
        Continue with Google
      </button>

      <button className="social-btn microsoft" onClick={handleMicrosoftLogin}>
        <img src="/images/microsoft-icon.svg" alt="Microsoft" />
        Continue with Microsoft
      </button>

      <button className="social-btn apple" onClick={handleAppleLogin}>
        <img src="/images/apple-icon.svg" alt="Apple" />
        Continue with Apple
      </button>
    </div>
  );
};

export default SocialLogin;
