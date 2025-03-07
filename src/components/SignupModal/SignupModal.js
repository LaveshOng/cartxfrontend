import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupModal.scss';

const SOCIAL_PROVIDERS = [
  {
    id: 'google',
    name: 'Google',
    icon: '/icons/google-icon.svg',
    className: 'bg-white hover:bg-gray-50 text-gray-700'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: '/icons/microsoft-icon.svg',
    className: 'bg-[#2F2F2F] hover:bg-black text-white'
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: '/icons/apple-icon.svg',
    className: 'bg-white hover:bg-gray-50 text-gray-700'
  }
];

const SignupModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    email: '',
    isValidEmail: true,
    isLoading: false
  });

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormState((prev) => ({
      ...prev,
      email: value,
      isValidEmail: true
    }));
  };

  const handleEmailSubmit = async () => {
    const { email } = formState;

    if (!validateEmail(email)) {
      setFormState((prev) => ({ ...prev, isValidEmail: false }));
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true }));
    sessionStorage.setItem('userEmail', email);

    try {
      // TODO: Implement your API call here
      // await apiClient.auth.register({ email });
      // Toast.success('Verification email sent successfully!');
      onClose();
      navigate('/email-confirmation', { state: { email } });
    } catch (error) {
      // Toast.error(JSON.parse(error.message).data.error || 'Email verification failed');
      console.error('Email verification failed:', error);
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSocialLogin = (provider) => {
    try {
      onClose();
      const baseUrl = process.env.REACT_APP_API_URL;
      window.location.href = `${baseUrl}/auth/${provider}`;
    } catch (error) {
      // Toast.error(`Failed to connect with ${provider}`);
      console.error(`Failed to connect with ${provider}:`, error);
    }
  };

  const { email, isValidEmail, isLoading } = formState;

  return (
    <div className="signup-modal">
      <div className="signup-modal-content">
        <div className="signup-modal-header">
          <h2 className="text-2xl font-bold text-gray-900">Create your free account</h2>
          <p className="text-gray-600 mt-2">100% free. No credit card needed.</p>
        </div>

        <div className="signup-modal-social">
          {SOCIAL_PROVIDERS.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleSocialLogin(provider.id)}
              disabled={isLoading}
              className={`social-btn ${provider.className}`}
            >
              <img src={provider.icon} alt={provider.name} className="social-icon" />
              <span>Continue with {provider.name}</span>
            </button>
          ))}
        </div>

        <div className="signup-modal-divider">
          <div className="divider-line"></div>
          <span className="divider-text">Or</span>
        </div>

        <div className="signup-modal-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
              className={`form-input ${!isValidEmail ? 'error' : ''}`}
            />
            {!isValidEmail && <p className="error-message">Please enter a valid email address</p>}
          </div>
          <button
            onClick={handleEmailSubmit}
            disabled={isLoading}
            className="submit-btn"
          >
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              'Verify email'
            )}
          </button>
        </div>

        <p className="privacy-notice">
          We&apos;re committed to your privacy. CartX uses the information you provide to contact you about our relevant content,
          products, and services. You may unsubscribe from these communications at any time. For more information, check out our{' '}
          <a href="/privacy" className="privacy-link">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupModal; 