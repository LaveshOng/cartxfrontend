import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { checkAuth } from '';
import { setTokens } from '../../utils/tokenManager';
import { useToast } from '../../context/ToastContext';
import { checkAuth } from '../../store/authSlice';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  console.log('📍 Entered AuthCallback component');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Handling authentication callback...');
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const error = searchParams.get('error');

        if (error) {
          console.log('❌ Authentication failed:', error);
          showToast('Authentication failed', 'error');
          navigate('/login');
          return;
        }

        if (!accessToken || !refreshToken) {
          console.log('❌ Invalid authentication response');
          throw new Error('Invalid authentication response');
        }

        // ✅ Store tokens
        setTokens(accessToken, refreshToken);
        console.log('✅ Tokens stored successfully.');

        // ✅ Dispatch checkAuth to fetch user details
        await dispatch(checkAuth());

        showToast('Successfully logged in!', 'success');
        navigate('/');
      } catch (error) {
        console.error('⚠️ Auth callback error:', error);
        showToast('Authentication failed', 'error');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, searchParams, dispatch, showToast]);

  return (
    <div className="auth-callback">
      <div className="loader">Completing authentication...</div>
    </div>
  );
};

export default AuthCallback;
