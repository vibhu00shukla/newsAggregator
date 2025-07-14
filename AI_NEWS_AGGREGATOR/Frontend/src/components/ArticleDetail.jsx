import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Settings, LogOut, Share2, Bookmark } from 'lucide-react';
import './ArticleDetail.css';

// Mock article data - replace with actual API calls
const mockArticleData = {
  1: {
    id: 1,
    title: "AI Breakthrough: New Model Achieves Human-Level Understanding",
    description: "Researchers have developed a new artificial intelligence model that demonstrates unprecedented capabilities in natural language understanding and reasoning.",
    content: `In a groundbreaking development that could reshape the landscape of artificial intelligence, researchers have unveiled a new AI model that demonstrates unprecedented capabilities in natural language understanding and reasoning. This breakthrough represents a significant step forward in the quest to create AI systems that can truly understand and interact with human language in meaningful ways.

The new model, developed through a collaborative effort between leading research institutions, has achieved remarkable results across a wide range of language tasks. Unlike previous AI systems that relied heavily on pattern recognition and statistical correlations, this new approach incorporates deeper understanding of context, semantics, and logical reasoning.

Key Features of the New AI Model:

1. Enhanced Context Understanding: The model can maintain context across longer conversations and documents, allowing for more coherent and relevant responses.

2. Improved Reasoning Capabilities: Unlike traditional language models, this system can perform logical reasoning tasks, solve complex problems, and provide explanations for its conclusions.

3. Better Factual Accuracy: The model demonstrates improved accuracy in factual information, reducing the likelihood of generating incorrect or misleading information.

4. Multilingual Proficiency: The system shows strong performance across multiple languages, making it more accessible to global users.

The research team utilized a novel architecture that combines the strengths of transformer-based models with innovative approaches to knowledge representation and reasoning. This hybrid approach allows the AI to not only process language but also understand the underlying concepts and relationships.

"Previous AI models were excellent at predicting the next word in a sentence, but they often struggled with truly understanding what they were reading," explains Dr. Sarah Chen, lead researcher on the project. "Our new model goes beyond surface-level pattern matching to develop a deeper comprehension of language and meaning."

The implications of this breakthrough are far-reaching. Potential applications include:

- More accurate and helpful virtual assistants
- Improved machine translation services
- Better content moderation systems
- Enhanced educational tools
- More sophisticated chatbots for customer service

However, the researchers emphasize that this is still a research prototype and that significant work remains before such capabilities can be safely deployed in real-world applications. They also highlight the importance of responsible AI development and the need for ongoing research into AI safety and ethics.

The team has made their research findings publicly available and is collaborating with other institutions to further develop and refine the technology. They hope that this work will contribute to the broader AI research community and help advance the field toward more capable and beneficial AI systems.

"This is an exciting step forward, but it's important to remember that we're still in the early stages of AI development," says Dr. Chen. "There's still much work to be done to ensure these systems are safe, reliable, and beneficial to society."`,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: "technology",
    publishedAt: "2024-01-15T10:30:00Z",
    source: "Tech News Daily",
    author: "Dr. Sarah Chen",
    aiSummary: "This article reports on a significant breakthrough in artificial intelligence, where researchers have developed a new AI model with unprecedented natural language understanding and reasoning capabilities. The model represents a major advancement beyond traditional pattern-matching approaches, incorporating deeper context understanding, improved logical reasoning, and better factual accuracy. The research team used a novel hybrid architecture combining transformer-based models with innovative knowledge representation techniques. While still a research prototype, the technology has potential applications in virtual assistants, machine translation, content moderation, and educational tools. The researchers emphasize the importance of responsible AI development and ongoing safety research.",
    readTime: "8 min read"
  },
  2: {
    id: 2,
    title: "Global Markets React to New Economic Policies",
    description: "Financial markets worldwide are responding to recent policy changes, with significant movements in major indices and currency pairs.",
    content: "Financial markets around the world experienced significant volatility as investors reacted to newly announced economic policies...",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
    category: "business",
    publishedAt: "2024-01-15T09:15:00Z",
    source: "Business Insider",
    author: "Michael Rodriguez",
    aiSummary: "Global financial markets showed significant volatility in response to new economic policy announcements...",
    readTime: "5 min read"
  }
};

const ArticleDetail = ({ user, onLogout }) => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  // Load bookmarks from localStorage
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const saved = localStorage.getItem(`bookmarks_${user.email}`);
    if (!saved) return false;
    const arr = JSON.parse(saved);
    return arr.includes(Number(id));
  });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const articleData = mockArticleData[id];
      if (articleData) {
        setArticle(articleData);
      }
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Sync isBookmarked with Feed bookmarks
  useEffect(() => {
    const saved = localStorage.getItem(`bookmarks_${user.email}`);
    if (!saved) return setIsBookmarked(false);
    const arr = JSON.parse(saved);
    setIsBookmarked(arr.includes(Number(id)));
  }, [id, user.email]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    const saved = localStorage.getItem(`bookmarks_${user.email}`);
    let arr = saved ? JSON.parse(saved) : [];
    const articleId = Number(id);
    if (arr.includes(articleId)) {
      arr = arr.filter(bid => bid !== articleId);
    } else {
      arr.push(articleId);
    }
    localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(arr));
    setIsBookmarked(arr.includes(articleId));
    // Sync with Feed if open
    if (window.__setBookmarks) window.__setBookmarks(arr);
  };

  if (isLoading) {
    return (
      <div className="article-loading">
        <div className="loading-spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-error">
        <h2>Article Not Found</h2>
        <p>The article you're looking for doesn't exist.</p>
        <Link to="/feed" className="btn btn-primary">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="article-container">
      {/* Header */}
      <header className="article-header">
        <div className="container">
          <div className="header-content">
            <Link to="/feed" className="back-button">
              <ArrowLeft className="back-icon" />
              Back to Feed
            </Link>
            
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
                  <button onClick={onLogout} className="menu-item">
                    <LogOut className="menu-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="article-main">
        <div className="container">
          <article className="article-content">
            {/* Article Header */}
            <div className="article-header-content">
              <div className="article-meta">
                <span className="article-category">{article.category}</span>
                <span className="article-date">
                  <Clock className="meta-icon" />
                  {formatDate(article.publishedAt)}
                </span>
                <span className="article-read-time">
                  <Clock className="meta-icon" />
                  {article.readTime}
                </span>
              </div>
              
              <h1 className="article-title">{article.title}</h1>
              <p className="article-description">{article.description}</p>
              
              <div className="article-author">
                <User className="author-icon" />
                <span>By {article.author}</span>
                <span className="article-source">• {article.source}</span>
              </div>
            </div>

            {/* Article Image */}
            <div className="article-image">
              <img src={article.image} alt={article.title} />
            </div>

            {/* AI Summary */}
            <div className="ai-summary">
              <h3>🤖 AI Summary</h3>
              <p>{article.aiSummary}</p>
            </div>

            {/* Article Body */}
            <div className="article-body">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="article-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Article Actions */}
            <div className="article-actions">
              <button className="btn btn-secondary" onClick={handleShare}>
                <Share2 style={{ marginRight: '0.5rem' }} /> Share Article
              </button>
              <button className={`btn ${isBookmarked ? 'btn-primary' : 'btn-secondary'}`} onClick={handleBookmark}>
                <Bookmark style={{ marginRight: '0.5rem' }} /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
};

export default ArticleDetail; 