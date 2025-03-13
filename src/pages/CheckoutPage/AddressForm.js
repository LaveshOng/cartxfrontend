import React, { useState } from 'react';
import './AddressForm.scss';

const AddressForm = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    phoneNumber: initialData?.phoneNumber || '',
    addressLine1: initialData?.addressLine1 || '',
    addressLine2: initialData?.addressLine2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'India',
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="address-form">
      <div className="form-header">
        <h2>{initialData ? 'Edit Address' : 'Add New Address'}</h2>
        <button onClick={onClose} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name *"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number *"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1 *"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Address Line 2 (Optional)"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City *"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State *"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code *"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country *"
              required
            />
          </div>
        </div>

        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            Set as default address
          </label>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            {initialData ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
