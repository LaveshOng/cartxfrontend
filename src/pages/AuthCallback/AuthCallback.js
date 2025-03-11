import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setTokens } from '../../utils/tokenManager';
import { useToast } from '../../context/ToastContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (error) {
          showToast('Authentication failed', 'error');
          navigate('/login');
          return;
        }

        if (!accessToken || !refreshToken) {
          throw new Error('Invalid authentication response');
        }

        // Store tokens
        setTokens(accessToken, refreshToken);
        showToast('Successfully logged in!', 'success');
        navigate('/');
      } catch (error) {
        console.error('Auth callback error:', error);
        showToast('Authentication failed', 'error');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, searchParams, showToast]);

  return (
    <div className="auth-callback">
      <div className="loader">Completing authentication...</div>
    </div>
  );
};

export default AuthCallback;
