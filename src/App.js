import './App.scss';
// react router v6
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { useSelector, useDispatch } from 'react-redux';
import { getSignupModalStatus, setSignupModalOff } from './store/signupModalSlice';
import { ToastProvider } from './context/ToastContext';

function AppContent() {
  const isSignupModalOn = useSelector(getSignupModalStatus);
  const dispatch = useDispatch();

  return (
    <BrowserRouter>
      <Header />
      <Sidebar />

      <Routes>
        {/* home page route */}
        <Route path="/" element={<Home />} />
        {/* single product route */}
        <Route path="/product/:id" element={<ProductSingle />} />
        {/* category wise product listing route */}
        <Route path="/category/:category" element={<CategoryProduct />} />
        {/* cart */}
        <Route path="/cart" element={<Cart />} />
        {/* searched products */}
        <Route path="/search/:searchTerm" element={<Search />} />
        {/* email confirmation */}
        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
      </Routes>

      <Footer />
      {isSignupModalOn && <SignupModal onClose={() => dispatch(setSignupModalOff())} />}
    </BrowserRouter>
  );
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <div className="App">
          <AppContent />
        </div>
      </ToastProvider>
    </Provider>
  );
}

export default App;
