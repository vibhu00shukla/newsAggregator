import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import './PreferencesSetup.css';

const PreferencesSetup = ({ user, onUpdatePreferences }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'science', label: 'Science', icon: '🔬' },
    { value: 'health', label: 'Health', icon: '🏥' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'sports', label: 'Sports', icon: '⚽' }
  ];

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category to continue.');
      return;
    }

    setIsLoading(true);
    
    try {
      onUpdatePreferences(selectedCategories);
      navigate('/feed');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('There was an error saving your preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Set default preferences and continue
    onUpdatePreferences(['technology', 'business']);
    navigate('/feed');
  };

  return (
    <div className="preferences-container">
      <div className="preferences-card">
        <div className="preferences-header">
          <h1>Welcome to AI News!</h1>
          <p>Let's personalize your news experience by selecting your interests</p>
        </div>

        <div className="preferences-content">
          <div className="categories-section">
            <h2>Choose your news categories</h2>
            <p>Select the topics you're most interested in. You can change these later in settings.</p>
            
            <div className="categories-grid">
              {categories.map(category => (
                <button
                  key={category.value}
                  className={`category-option ${selectedCategories.includes(category.value) ? 'selected' : ''}`}
                  onClick={() => handleCategoryToggle(category.value)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <span className="category-label">{category.label}</span>
                  {selectedCategories.includes(category.value) && (
                    <Check className="check-icon" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="preferences-actions">
            <button
              onClick={handleSkip}
              className="btn btn-secondary skip-button"
            >
              Skip for now
            </button>
            
            <button
              onClick={handleContinue}
              disabled={isLoading || selectedCategories.length === 0}
              className="btn btn-primary continue-button"
            >
              {isLoading ? (
                'Setting up...'
              ) : (
                <>
                  Continue to Feed
                  <ArrowRight className="button-icon" />
                </>
              )}
            </button>
          </div>

          <div className="preferences-info">
            <p>Selected: {selectedCategories.length} categories</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSetup; 