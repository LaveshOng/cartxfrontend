import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateUser } from '../../store/authSlice';
import { useToast } from '../../context/ToastContext';
import './Profile.scss';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // TODO: Implement API call to update user profile
      // const response = await apiClient.auth.updateProfile(formData);
      // dispatch(updateUser(response.data));
      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast(error.message || 'Failed to update profile', 'error');
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          {/* Left Sidebar */}
          <div className="profile-sidebar">
            <div className="user-brief">
              <div className="user-avatar">{user?.fullName?.[0]?.toUpperCase() || 'U'}</div>
              <div className="user-info">
                <p>Hello,</p>
                <h3>{user?.fullName || 'User'}</h3>
              </div>
            </div>

            <nav className="profile-nav">
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user"></i>
                Profile Information
              </button>
              <Link to="/orders" className="nav-item">
                <i className="fas fa-box"></i>
                My Orders
              </Link>
              <button
                className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <i className="fas fa-map-marker-alt"></i>
                Manage Addresses
              </button>
              <button
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="fas fa-cog"></i>
                Account Settings
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {activeTab === 'profile' && (
              <div className="profile-info">
                <div className="section-header">
                  <h2>Profile Information</h2>
                  <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    ) : (
                      <p>{user?.fullName || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <p>{user?.email}</p>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p>{user?.phone || 'Not provided'}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    {isEditing ? (
                      <select name="gender" value={formData.gender} onChange={handleInputChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <p>{user?.gender || 'Not provided'}</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="form-actions">
                      <button type="submit" className="save-btn">
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="addresses-section">
                <div className="section-header">
                  <h2>Manage Addresses</h2>
                  <button className="add-btn">Add New Address</button>
                </div>
                {/* Address list will be implemented here */}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-section">
                <div className="section-header">
                  <h2>Account Settings</h2>
                </div>
                <div className="settings-options">
                  <div className="setting-item">
                    <h3>Change Password</h3>
                    <button className="change-btn">Change</button>
                  </div>
                  <div className="setting-item">
                    <h3>Email Notifications</h3>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item danger">
                    <h3>Delete Account</h3>
                    <button className="delete-btn">Delete Account</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
