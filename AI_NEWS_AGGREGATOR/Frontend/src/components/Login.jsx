import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import './Login.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
const Login = () => {
  const navigate = useNavigate()
  const {setUser} = useContext(UserContext)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('login');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/user/login`,
      { email: formData.email, password: formData.password }
    );

    if(response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);  
      localStorage.setItem('user', JSON.stringify(data.user)); // <-- persist user
      navigate('/feed');
    }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-split-bg">
      <div className="auth-split-left">
        <div className="brand-icon">📰</div>
        <h1 className="brand-title">AI News</h1>
        <p className="brand-desc">Stay ahead with AI-powered news summaries.<br/>Personalized. Fast. Smart.</p>
        <ul className="brand-features">
          <li>⚡ Instant AI summaries</li>
          <li>🎯 Personalized categories</li>
          <li>🌙 Modern dark mode</li>
        </ul>
      </div>
      <div className="auth-split-right">
        <div className="auth-card dark">
          <div className="auth-tabs">
            <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Login</button>
            <Link to="/signup" className={tab === 'signup' ? 'active' : ''} onClick={() => setTab('signup')}>Sign Up</Link>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Access your AI-powered news feed</p>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input dark"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input dark"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <div className="auth-footer">
            <p>
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="auth-link">Sign up here</Link>
            </p>
          </div>
          <div className="admin-note">
            <p>Demo Login: demo@gmail.com / abc12345</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;