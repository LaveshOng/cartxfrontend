import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSignupModalOff, setSigninModalOff } from '../store/signupModalSlice';
import Header from './Header/Header';
import Sidebar from './Sidebar/Sidebar';
import Footer from './Footer/Footer';
import {
  Home,
  ProductSingle,
  CategoryProduct,
  Cart,
  Search,
  EmailConfirmationPage,
} from '../pages/index';
import VerifyEmail from '../pages/VerifyEmail/VerifyEmail';

function AppContent() {
  const dispatch = useDispatch();

  return (
    <>
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
        {/* email verification */}
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>

      <Footer />
    </>
  );
}

export default AppContent;
