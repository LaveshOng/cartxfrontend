import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSignupModalOff } from '../store/signupModalSlice';
import { apiClient } from '../utils/apiClient';
import Toast from '../components/shared/Toast';

const SignupPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      Toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      Toast.error('Please enter your email');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      Toast.error('Please enter a password');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      Toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 'success') {
        Toast.success('Registration successful! Please check your email.');
        dispatch(setSignupModalOff());
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.message || 'Registration failed');
      Toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Create an Account</h2>
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-3 border border-gray-300 focus:border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-3 border border-gray-300 focus:border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-3 border border-gray-300 focus:border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-3 border border-gray-300 focus:border-purple-500 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
