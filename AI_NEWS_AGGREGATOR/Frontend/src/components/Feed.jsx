import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, Search, Filter, Bookmark } from 'lucide-react';
import './Feed.css';
import axios from 'axios';
import { NewsContext } from '../../context/NewsProvider';
import { UserContext } from '../../context/UserContext';


const Feed = () => {
  const { news, setNews } = useContext(NewsContext);
  const {user, setUser} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();



useEffect(() => {
  const fetchNews = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/news`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.status === 200) {
        setNews(response.data.articles);
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Failed to fetch news:", error);
    }
  };

  fetchNews();
}, [setNews]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

   const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

 


  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Optionally show error to user
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };


  if (isLoading) {
    return (
      <div className="feed-loading">
        <div className="loading-spinner"></div>
        <p>Loading your personalized news...</p>
      </div>
    );
  }


  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1 className="logo">AI News</h1>
              <p className="welcome-text">Welcome back, {user?.name}!</p>
            </div>

            <div className="header-right">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="     Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="header-actions">
                <Link to="/settings" className="header-action-btn" title="Settings">
                  <Settings className="action-icon" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="header-action-btn"
                  title="Logout"
                >
                  <LogOut className="action-icon" />
                </button>

                <div className="user-menu-container">
                  <button
                    className="user-menu-button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <User className="user-icon" />
                    <span>{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="user-menu">
                      <Link to="/settings" className="menu-item">
                        <Settings className="menu-icon" />
                        Settings
                      </Link>
                      <button onClick={handleLogout} className="menu-item">
                        <LogOut className="menu-icon" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="feed-main">
        <div className="container">
          

          <div className="news-grid">
            {news.length === 0 ? (
              <div className="no-results">
                <p>No news articles found matching your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="btn btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              news.map(article => (
                <Link
                  key={article._id} 
                  to={`${article.website_url}`}
                  className="news-card"
                >
                  <div className="news-image">
                    <img src={article.picture} alt={article.heading} />
                    <div className="news-category">{article.categories}</div>
                  </div>
                  <div className="news-content">
                    <h3 className="news-title">{article.heading}</h3>
                    <p className="news-description">{article.description}</p>
                    <div className="news-meta">
                      <span className="news-source">{article.author}</span>
                      <span className="news-date">{formatDate(article.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Feed;

