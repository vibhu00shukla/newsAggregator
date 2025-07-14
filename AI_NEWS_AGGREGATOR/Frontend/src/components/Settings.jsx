import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Lock, LogOut, Save, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import './Settings.css';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const categories = [
    { value: 'Technology', label: 'Technology' },
    { value: 'Business', label: 'Business' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Smart Home', label: 'Smart Home' },
    { value: 'Social Media', label: 'Social Media' },
    { value: 'Retail', label: 'Retail' }
  ];

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.categories) {
          setSelectedCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
        setMessage({ type: 'error', text: 'Failed to load preferences' });
      }
    };

    fetchUserPreferences();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSavePreferences = async () => {
    if (selectedCategories.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one category' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/update`,
        { categories: selectedCategories },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Preferences updated successfully!' });
       
        setUser(prevUser => ({
          ...prevUser,
          categories: selectedCategories
        }));
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setMessage({ type: 'error', text: 'Failed to update preferences' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/update`,
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordSection(false);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="settings-container">
      
      <header className="settings-header">
        <div className="container">
          <div className="header-content">
            <Link to="/feed" className="back-button">
              <ArrowLeft className="back-icon" />
              Back to Feed
            </Link>
            
            <h1 className="settings-title">Settings</h1>
          </div>
        </div>
      </header>

     
      <main className="settings-main">
        <div className="container">
          <div className="settings-content">
            
            <div className="settings-section">
              <div className="section-header">
                <User className="section-icon" />
                <h2>Account Information</h2>
              </div>
              <div className="user-info">
                <div className="info-item">
                  <label>Name:</label>
                  <span>{user?.name || 'Loading...'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user?.email || 'Loading...'}</span>
                </div>
              </div>
            </div>

           
            <div className="settings-section">
              <div className="section-header">
                <h2>News Categories</h2>
                <p>Select the categories you're interested in</p>
              </div>
              
              <div className="categories-container">
                {categories.map(category => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => handleCategoryChange(category.value)}
                    className={`category-btn ${
                      selectedCategories.includes(category.value) ? 'selected' : ''
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {selectedCategories.length > 0 && (
                <p className="selected-count">
                  {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
                </p>
              )}

              <button
                onClick={handleSavePreferences}
                disabled={isLoading}
                className="btn btn-primary save-button"
              >
                <Save className="button-icon" />
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>

           
            <div className="settings-section change-password-card">
              <div className="change-password-header">
                <Lock className="section-icon" />
                Change Password
                <button 
                  className="change-password-toggle" 
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                >
                  {showPasswordSection ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              {showPasswordSection && (
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="input dark"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPasswords.current ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="input dark"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPasswords.new ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <div className="input-wrapper">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="input dark"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPasswords.confirm ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>

            
            <div className="settings-section">
              <div className="section-header">
                <LogOut className="section-icon" />
                <h2>Account Actions</h2>
              </div>
              
              <button
                onClick={handleLogout}
                className="btn btn-danger logout-button"
              >
                <LogOut className="button-icon" />
                Logout
              </button>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;