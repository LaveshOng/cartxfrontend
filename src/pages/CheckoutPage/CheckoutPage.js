import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getAllCarts, getCartTotal } from '../../store/cartSlice';
import { apiClient } from '../../utils/apiClient';
import { useToast } from '../../context/ToastContext';
import AddressForm from './AddressForm';
import './CheckoutPage.scss';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const carts = useSelector(getAllCarts);
  const { itemsCount, totalAmount } = useSelector(state => state.cart);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const deliveryCharge = 40; // Fixed delivery charge for now

  useEffect(() => {
    checkAuthAndFetchAddresses();
    dispatch(getCartTotal());
  }, [dispatch]);

  const checkAuthAndFetchAddresses = async () => {
    try {
      const response = await apiClient.auth.checkAuth();
      if (!response.isAuthenticated) {
        showToast('Please login to continue with checkout', 'info');
        navigate('/login');
        return;
      }
      fetchAddresses();
    } catch (error) {
      console.error('Auth check failed:', error);
      showToast('Please login to continue with checkout', 'error');
      navigate('/login');
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.address.getAll();
      if (response.status === 'success') {
        setAddresses(response.data);
        const defaultAddress = response.data.find(addr => addr.isDefault);
        setSelectedAddress(defaultAddress || response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      showToast('Failed to load addresses', 'error');
    }
  };

  const handleAddressSubmit = async addressData => {
    try {
      const response = await apiClient.address.add(addressData);
      if (response.status === 'success') {
        showToast('Address added successfully', 'success');
        setShowAddressForm(false);
        fetchAddresses();
      }
    } catch (error) {
      console.error('Failed to add address:', error);
      showToast('Failed to add address', 'error');
    }
  };

  const handleSetDefaultAddress = async addressId => {
    try {
      const response = await apiClient.address.setDefault(addressId);
      if (response.status === 'success') {
        fetchAddresses();
      }
    } catch (error) {
      console.error('Failed to set default address:', error);
      showToast('Failed to set default address', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.payment.createCheckoutSession({
        items: carts.map(item => ({
          name: item.title,
          price: item.discountedPrice,
          quantity: item.quantity,
        })),
        addressId: selectedAddress._id,
        deliveryCharge,
      });

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      showToast('Failed to process checkout', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (carts.length === 0) {
    return (
      <div className="container my-5">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-content">
          <div className="delivery-section">
            <h2>Delivery Address</h2>
            {addresses.length > 0 ? (
              <div className="addresses-list">
                {addresses.map(address => (
                  <div
                    key={address._id}
                    className={`address-card ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="address-details">
                      <h3>{address.fullName}</h3>
                      <p>{address.phoneNumber}</p>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{`${address.city}, ${address.state} ${address.postalCode}`}</p>
                      <p>{address.country}</p>
                    </div>
                    {!address.isDefault && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSetDefaultAddress(address._id);
                        }}
                        className="set-default-btn"
                      >
                        Set as Default
                      </button>
                    )}
                    {address.isDefault && <span className="default-badge">Default</span>}
                  </div>
                ))}
              </div>
            ) : null}

            <button onClick={() => setShowAddressForm(true)} className="add-address-btn">
              Add New Address
            </button>
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {carts.map(item => (
                <div key={item.id} className="summary-item">
                  <span className="item-name">{item.title}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                  <span className="item-price">₹{item.discountedPrice * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="summary-totals">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="delivery">
                <span>Delivery Charge</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span>₹{totalAmount + deliveryCharge}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isLoading || !selectedAddress}
              className="checkout-btn"
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>

      {showAddressForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddressForm onSubmit={handleAddressSubmit} onClose={() => setShowAddressForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
