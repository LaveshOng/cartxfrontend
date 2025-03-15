import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';
import { setSignupModalOff } from '../../store/signupModalSlice';
import './SignupModal.scss';

const SOCIAL_PROVIDERS = [
  {
    id: 'google',
    name: 'Google',
    icon: '/icons/google-icon.svg',
    className: 'bg-white text-gray-700',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: '/icons/microsoft-icon.svg',
    className: 'bg-[#2F2F2F] text-white',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: '/icons/apple-icon.svg',
    className: 'bg-white text-gray-700',
  },
];

const SignupModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isSignupMode, setIsSignupMode] = useState(true);
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isValidEmail: true,
    isLoading: false,
  });

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleEmailChange = e => {
    const { value } = e.target;
    setFormState(prev => ({
      ...prev,
      email: value,
      isValidEmail: true,
    }));
  };

  const handlePasswordChange = e => {
    const { value } = e.target;
    setFormState(prev => ({
      ...prev,
      password: value,
    }));
  };

  const handleFirstNameChange = e => {
    const { value } = e.target;
    setFormState(prev => ({
      ...prev,
      firstName: value,
    }));
  };

  const handleLastNameChange = e => {
    const { value } = e.target;
    setFormState(prev => ({
      ...prev,
      lastName: value,
    }));
  };

  const handleConfirmPasswordChange = e => {
    const { value } = e.target;
    setFormState(prev => ({
      ...prev,
      confirmPassword: value,
    }));
  };

  const handleEmailSubmit = async e => {
    e?.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formState;

    if (!validateEmail(email)) {
      setFormState(prev => ({ ...prev, isValidEmail: false }));
      return;
    }

    if (!password) {
      showToast('Please enter your password', 'error');
      return;
    }

    if (isSignupMode) {
      if (!firstName.trim()) {
        showToast('Please enter your first name', 'error');
        return;
      }
      if (!lastName.trim()) {
        showToast('Please enter your last name', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      if (isSignupMode) {
        await apiClient.auth.register({
          firstName,
          lastName,
          email,
          password,
        });
        showToast('Registration successful! Please check your email for verification.', 'success');
        dispatch(setSignupModalOff());
        navigate('/email-confirmation', { state: { email } });
      } else {
        const response = await apiClient.auth.login({ email, password });
        if (response.status === 'success') {
          showToast('Successfully logged in!', 'success');
          dispatch(setSignupModalOff());
        } else {
          throw new Error(response.message || 'Login failed');
        }
      }
    } catch (error) {
      const errorMessage = error.message
        ? JSON.parse(error.message).data.error
        : 'Authentication failed';
      showToast(errorMessage, 'error');
      console.error('Authentication failed:', error);
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleSocialLogin = provider => {
    try {
      dispatch(setSignupModalOff());
      const baseUrl = process.env.REACT_APP_API_URL;
      window.location.href = `${baseUrl}/auth/${provider}`;
    } catch (error) {
      showToast(`Failed to connect with ${provider}`, 'error');
      console.error(`Failed to connect with ${provider}:`, error);
    }
  };

  const handleClose = () => {
    dispatch(setSignupModalOff());
  };

  const handleClickOutside = e => {
    if (e.target.classList.contains('signup-modal')) {
      handleClose();
    }
  };

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode);
    setFormState(prev => ({
      ...prev,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isValidEmail: true,
    }));
  };

  const { firstName, lastName, email, password, confirmPassword, isValidEmail, isLoading } =
    formState;

  return (
    <div className="signup-modal" onClick={handleClickOutside}>
      <div className="signup-modal-content">
        <div className="signup-modal-header">
          <button
            onClick={handleClose}
            className="close-button"
            aria-label="Close modal"
            type="button"
          >
            <i className="fas fa-times"></i>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignupMode ? 'Create your free account' : 'Sign in to your account'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isSignupMode ? '100% free. No credit card needed.' : 'Welcome back!'}
          </p>
        </div>

        <div className="signup-modal-social">
          {SOCIAL_PROVIDERS.map(provider => (
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

        <form onSubmit={handleEmailSubmit} className="signup-modal-form">
          {isSignupMode && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className="form-input"
                />
              </div>
            </>
          )}
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
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="form-input"
            />
          </div>
          {isSignupMode && (
            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="form-input"
              />
            </div>
          )}
          <button type="submit" disabled={isLoading} className="submit-btn">
            {isLoading ? <div className="loader"></div> : isSignupMode ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="toggle-mode">
          <p>
            {isSignupMode ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={toggleMode} className="toggle-btn">
              {isSignupMode ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {isSignupMode && (
          <p className="privacy-notice">
            We&apos;re committed to your privacy. CartX uses the information you provide to contact
            you about our relevant content, products, and services. You may unsubscribe from these
            communications at any time. For more information, check out our{' '}
            <a href="/privacy" className="privacy-link">
              Privacy Policy
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default SignupModal;
