import './App.scss';
// react router v6
import { BrowserRouter } from 'react-router-dom';
// pages
import {
  Home,
  CategoryProduct,
  ProductSingle,
  Cart,
  Search,
  EmailConfirmationPage,
} from './pages/index';
// components
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Footer from './components/Footer/Footer';
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
