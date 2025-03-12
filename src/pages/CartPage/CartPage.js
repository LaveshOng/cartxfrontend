import React from 'react';
import './CartPage.scss';
import { useSelector, useDispatch } from 'react-redux';
import { shopping_cart } from '../../utils/images';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import {
  getAllCarts,
  removeFromCart,
  toggleCartQty,
  clearCart,
  getCartTotal,
} from '../../store/cartSlice';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51QzjnkATEExbY1sHLOsOfDZNlViPJ7bYDE7EISq2cWsQQgOaFCvBX81Oowa2oo7eq5OlgN4hIh58daGVxCTc9g5z00FkWeFpif'
);

const CartPage = () => {
  const dispatch = useDispatch();
  const carts = useSelector(getAllCarts);
  const { itemsCount, totalAmount } = useSelector(state => state.cart);

  const handleCheckout = async () => {
    console.log('button clicked');
    const stripe = await stripePromise;

    const response = await fetch('http://localhost:8000/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: carts.map(item => ({
          name: item.title,
          price: item.discountedPrice,
          quantity: item.quantity,
        })),
      }),
    });
    const { url } = await response.json();

    // Open Stripe Checkout in a new tab
    window.open(url, '_blank');
    // const { url } = await response.json();
    // window.location.href = url; // Redirect user to Stripe Checkout
  };
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
    <div className="cart bg-whitesmoke">
      <div className="container">
        <div className="cart-ctable">
          <div className="cart-chead bg-white">
            <div className="cart-ctr fw-6 font-manrope fs-15">
              <div className="cart-cth">
                <span className="cart-ctxt">S.N.</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Product</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Unit Price</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Quantity</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Total Price</span>
              </div>
              <div className="cart-cth">
                <span className="cart-ctxt">Actions</span>
              </div>
            </div>
          </div>

          <div className="cart-cbody bg-white">
            {carts.map((cart, idx) => {
              return (
                <div className="cart-ctr py-4" key={cart?.id}>
                  <div className="cart-ctd">
                    <span className="cart-ctxt">{idx + 1}</span>
                  </div>
                  <div className="cart-ctd">
                    <span className="cart-ctxt">{cart?.title}</span>
                  </div>
                  <div className="cart-ctd">
                    <span className="cart-ctxt">{formatPrice(cart?.discountedPrice)}</span>
                  </div>
                  <div className="cart-ctd">
                    <div className="qty-change flex align-center">
                      <button
                        type="button"
                        className="qty-decrease flex align-center justify-center"
                        onClick={() => dispatch(toggleCartQty({ id: cart?.id, type: 'DEC' }))}
                      >
                        <i className="fas fa-minus"></i>
                      </button>

                      <div className="qty-value flex align-center justify-center">
                        {cart?.quantity}
                      </div>

                      <button
                        type="button"
                        className="qty-increase flex align-center justify-center"
                        onClick={() => dispatch(toggleCartQty({ id: cart?.id, type: 'INC' }))}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="cart-ctd">
                    <span className="cart-ctxt text-blue fw-5">
                      {formatPrice(cart?.totalPrice)}
                    </span>
                  </div>

                  <div className="cart-ctd">
                    <button
                      type="button"
                      className="delete-btn text-dark"
                      onClick={() => dispatch(removeFromCart(cart?.id))}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-cfoot flex align-start justify-between py-3 bg-white">
            <div className="cart-cfoot-l">
              <button
                type="button"
                className="clear-cart-btn text-danger fs-15 text-uppercase fw-4"
                onClick={() => dispatch(clearCart())}
              >
                <i className="fas fa-trash"></i>
                <span className="mx-1">Clear Cart</span>
              </button>
            </div>

            <div className="cart-cfoot-r flex flex-column justify-end">
              <div className="total-txt flex align-center justify-end">
                <div className="font-manrope fw-5">Total ({itemsCount}) items: </div>
                <span className="text-blue fs-22 mx-2 fw-6">{formatPrice(totalAmount)}</span>
              </div>

              <button
                type="button"
                className="checkout-btn text-white bg-blue fs-16"
                onClick={handleCheckout}
              >
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
