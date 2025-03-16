import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import {
  fetchUserOrders,
  cancelOrder,
  getAllOrders,
  getOrdersLoading,
  getOrdersError,
  getCancellingOrder,
  getCancelError,
} from '../../store/orderSlice';

import { useToast } from '../../context/ToastContext';
import './Orders.scss';
import { checkAuth } from '../../store/authSlice';

const OrderStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-success';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      case 'shipped':
        return 'status-shipped';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className={`order-status ${getStatusColor()}`}>
      <span className="status-dot"></span>
      {status}
    </div>
  );
};

const OrderCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const isCancelling = useSelector(getCancellingOrder);
  const cancelError = useSelector(getCancelError);

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrder(order.orderId)).unwrap();
      showToast('Order cancelled successfully', 'success');
    } catch (error) {
      showToast(error || 'Failed to cancel order', 'error');
    }
  };

  return (
    <div className="order-card">
      <div className="order-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="order-basic-info">
          <div className="order-id">
            <h3>Order #{order.orderId.slice(-8)}</h3>
            <span className="order-date">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</span>
          </div>
          <OrderStatus status={order.status} />
        </div>
        <div className="order-summary">
          <div className="total-amount">
            <span className="label">Total:</span>
            <span className="amount">${order.totalAmount.toFixed(2)}</span>
          </div>
          <button className="expand-btn">{isExpanded ? 'Show Less' : 'Show Details'}</button>
        </div>
      </div>

      {isExpanded && (
        <div className="order-details">
          <div className="products-list">
            {order.items.map((item, index) => (
              <div key={index} className="product-item">
                <div className="product-image">
                  <img src={item.thumbnail} alt={item.title} />
                </div>
                <div className="product-info">
                  <h4>{item.title}</h4>
                  <p className="product-price">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="product-total">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <div className="shipping-info">
              <h4>Shipping Address</h4>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>${(order.totalAmount - order.deliveryCharge).toFixed(2)}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charge:</span>
                <span>${order.deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="order-actions">
            <button className="btn-track">Track Order</button>
            <button className="btn-invoice">Download Invoice</button>
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <button className="btn-cancel" onClick={handleCancel} disabled={isCancelling}>
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const orders = useSelector(getAllOrders);
  const isLoading = useSelector(getOrdersLoading);
  const error = useSelector(getOrdersError);
  const [activeFilter, setActiveFilter] = useState('all');
  console.log('ORDERS');
  useEffect(() => {
    const initializeOrders = async () => {
      console.log('🔄 Running initializeOrders useEffect');
      console.log(authState);
      if (authState.isAuthenticated && authState.user?.id) {
        console.log('📦 Fetching orders for user:', authState.user.id);
        const orderDetail = await dispatch(fetchUserOrders()).unwrap();
        console.log(orderDetail, 'orderDetail');
      } else if (!authState.isAuthenticated && !authState.isLoading) {
        console.log('🔍 Checking authentication');
        await dispatch(checkAuth()).unwrap();
      }
    };

    if (!authState.isLoading) {
      initializeOrders();
    }
  }, [authState.isAuthenticated, authState.user?._id]);

  const filterOrders = status => {
    setActiveFilter(status);
  };

  const getFilteredOrders = () => {
    if (activeFilter === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === activeFilter);
  };

  if (isLoading) {
    return (
      <div className="orders-page">
        <div className="loading-spinner">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="error-message">
          <h2>Error loading orders</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <div className="order-filters">
          <button
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => filterOrders('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${activeFilter === 'processing' ? 'active' : ''}`}
            onClick={() => filterOrders('processing')}
          >
            Processing
          </button>
          <button
            className={`filter-btn ${activeFilter === 'shipped' ? 'active' : ''}`}
            onClick={() => filterOrders('shipped')}
          >
            Shipped
          </button>
          <button
            className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
            onClick={() => filterOrders('delivered')}
          >
            Delivered
          </button>
          <button
            className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => filterOrders('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="orders-list">
        {getFilteredOrders().length === 0 ? (
          <div className="no-orders">
            <img src="/images/no-orders.svg" alt="No orders" />
            <h2>No orders found</h2>
            <p>Looks like you haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          getFilteredOrders().map(order => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
};

export default Orders;
