import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOn } from '../../store/sidebarSlice';
import { setSignupModalOn } from '../../store/signupModalSlice';
import { getAllCategories } from '../../store/categorySlice';
import { getAllCarts, getCartItemsCount, getCartTotal } from '../../store/cartSlice';
import { logoutUser } from '../../store/authSlice'; // ✅ Import logout action
import CartModal from '../CartModal/CartModal';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🟢 Authentication state
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const categories = useSelector(getAllCategories);
  const carts = useSelector(getAllCarts);
  const itemsCount = useSelector(getCartItemsCount);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getCartTotal());
  }, [carts, dispatch]);

  const handleSearchTerm = e => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-cnt flex align-center">
        {/* ✅ Brand Logo */}
        <div className="brand-and-toggler flex align-center">
          <Link to="/" className="navbar-brand flex align-center">
            <span className="navbar-brand-ico">
              <i className="fa-solid fa-bag-shopping"></i>
            </span>
            <span className="navbar-brand-txt mx-2">
              <span className="fw-7">Cart</span>X
            </span>
          </Link>
        </div>

        {/* ✅ Search Bar */}
        <div className="navbar-collapse w-100">
          <div className="navbar-search bg-white">
            <div className="flex align-center">
              <button
                type="button"
                className="sidebar-show-btn text-blue"
                onClick={() => dispatch(setSidebarOn())}
              >
                All <i className="fa-solid fa-circle-arrow-left"></i>
              </button>

              <input
                type="text"
                className="form-control fs-14"
                placeholder="Search CartX"
                value={searchTerm}
                onChange={handleSearchTerm}
              />
              <Link
                to={`search/${searchTerm}`}
                className="text-white search-btn flex align-center justify-center"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
              </Link>
            </div>
          </div>

          {/* ✅ Categories */}
          <ul className="navbar-nav flex align-center fs-12 fw-4 font-manrope">
            {categories.slice(0, 8).map((category, idx) => (
              <li className="nav-item no-wrap" key={idx}>
                <Link to={`category/${category.slug}`} className="nav-link text-capitalize">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ User Account Actions */}
        <div className="navbar-actions flex align-center">
          {isAuthenticated ? (
            // 🔵 Show Profile & Logout when logged in
            <div className="auth-buttons flex align-center">
              {/* Profile Icon */}
              <button
                className="profile-btn px-3 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                onClick={() => navigate('/profile')}
              >
                <i className="fas fa-user-circle text-blue-600"></i>
              </button>

              {/* Logout Button */}
              <button
                className="logout-btn px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors ml-3"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            // 🔴 Show "Account" button when not logged in (opens signup modal)
            <button
              className="account-btn px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => dispatch(setSignupModalOn())}
            >
              <i className="fas fa-user"></i>
              Account
            </button>
          )}

          {/* ✅ Cart Button */}
          <div className="navbar-cart flex align-center ml-4">
            <Link to="/cart" className="cart-btn">
              <i className="fa-solid fa-cart-shopping"></i>
              <div className="cart-items-value">{itemsCount}</div>
              <CartModal carts={carts} />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
