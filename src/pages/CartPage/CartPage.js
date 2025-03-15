import React from 'react';
import './CartPage.scss';
import { useSelector, useDispatch } from 'react-redux';
import { shopping_cart } from '../../utils/images';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import {
  getAllCarts,
  removeFromCart,
  toggleCartQty,
  clearCart,
  getCartTotal,
} from '../../store/cartSlice';
import { useToast } from '../../context/ToastContext';
import { checkAuth } from '../../store/authSlice';
const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const carts = useSelector(getAllCarts);
  const { itemsCount, totalAmount } = useSelector(state => state.cart);
  const authState = useSelector(state => state.auth);
  const handleCheckout = async () => {
    // console.log('🚀 Initial Auth State:', authState);

    try {
      // If user is not authenticated, check authentication
      if (!authState.isAuthenticated) {
        console.log('🔍 User is not authenticated, dispatching checkAuth...');
        const result = await dispatch(checkAuth()).unwrap(); // ✅ Use `unwrap()` to get the direct result

        console.log('🔄 checkAuth result:', result);

        // If authentication failed, redirect to login
        if (!result) {
          console.log('❌ User is still not authenticated after checkAuth.');
          showToast('Please login to continue with checkout', 'info');
          navigate('/login');
          return;
        }
      }

      console.log('✅ Authentication successful, navigating to checkout...');
      navigate('/checkout');
    } catch (error) {
      console.error('⚠️ Auth check failed:', error);
      showToast('Please login to continue with checkout', 'error');
      navigate('/login');
    }
  };
  // const handleCheckout = async () => {
  //   try {
  //     // If user is not authenticated, try checking authentication
  //     if (!authState.isAuthenticated) {
  //       console.log('🔍 User is not authenticated, dispatching checkAuth...');
  //       await dispatch(checkAuth());
  //     } else {
  //       console.log('✅ User is already authenticated, proceeding to checkout...');
  //     }
  //     if (!authState.isAuthenticated) {
  //       console.log('❌ User is still not authenticated after checkAuth.');
  //       showToast('Please login to continue with checkout', 'info');
  //       navigate('/login');
  //       return;
  //     }

  //     console.log('✅ Authentication successful, navigating to checkout...');
  //     navigate('/checkout');
  //   } catch (error) {
  //     console.error('⚠️ Auth check failed:', error);
  //     showToast('Please login to continue with checkout', 'error');
  //     navigate('/login');
  //   }
  // };
  if (carts.length === 0) {
    return (
      <div className="container my-5">
        <div className="empty-cart flex justify-center align-center flex-column font-manrope">
          <img src={shopping_cart} alt="" />
          <span className="fw-6 fs-15 text-gray">Your shopping cart is empty.</span>
          <Link to="/" className="shopping-btn bg-blue text-white fw-5">
            Go shopping Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-content">
          <div className="cart-left">
            <div className="cart-items">
              {carts.map(cart => (
                <div className="cart-item" key={cart.id}>
                  <div className="cart-item-img">
                    <img src={cart.images[0]} alt={cart.title} />
                  </div>
                  <div className="cart-item-info">
                    <h6 className="fs-16 fw-5">{cart.title}</h6>
                    <div className="qty flex align-center">
                      <span className="text-light-blue qty-text">Qty: </span>
                      <div className="qty-change flex align-center mx-2">
                        <button
                          type="button"
                          className="qty-dec fs-14"
                          onClick={() => dispatch(toggleCartQty({ id: cart.id, type: 'DEC' }))}
                        >
                          <i className="fas fa-minus text-light-blue"></i>
                        </button>
                        <span className="qty-value flex align-center justify-center">
                          {cart.quantity}
                        </span>
                        <button
                          type="button"
                          className="qty-inc fs-14"
                          onClick={() => dispatch(toggleCartQty({ id: cart.id, type: 'INC' }))}
                        >
                          <i className="fas fa-plus text-light-blue"></i>
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-price">₹{formatPrice(cart.discountedPrice)}</div>
                    <button
                      type="button"
                      className="remove-btn text-dark"
                      onClick={() => dispatch(removeFromCart(cart.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="clear-cart-btn" onClick={() => dispatch(clearCart())}>
              <i className="fas fa-trash"></i>
              <span className="mx-2">Clear Cart</span>
            </button>
          </div>

          <div className="cart-right">
            <div className="cart-summary">
              <h2>Cart Summary</h2>
              <div className="cart-summary-info">
                <div className="summary-item">
                  <span>Total Items:</span>
                  <span>{itemsCount}</span>
                </div>
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>₹{formatPrice(totalAmount)}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery:</span>
                  <span>₹40</span>
                </div>
                <div className="summary-item total">
                  <span>Total:</span>
                  <span>₹{formatPrice(totalAmount + 40)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
