import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import SignupModal from './components/SignupModal/SignupModal';
import store from './store/store';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import { getSignupModalStatus, getSigninModalStatus } from './store/signupModalSlice';
import { ToastProvider } from './context/ToastContext';
import AppContent from './components/AppContent';

function AppContentWrapper() {
  const isSignupModalOn = useSelector(getSignupModalStatus);
  const isSigninModalOn = useSelector(getSigninModalStatus);

  return (
    <div className="App">
      <AppContent />
      {(isSignupModalOn || isSigninModalOn) && (
        <div className="modal-overlay">
          <div className="modal-content">
            <SignupModal />
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <ToastProvider>
          <AppContentWrapper />
        </ToastProvider>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
