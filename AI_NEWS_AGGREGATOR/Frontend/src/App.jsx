import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Feed from './components/Feed';
import ArticleDetail from './components/ArticleDetail';
import Settings from './components/Settings';
import PreferencesSetup from './components/PreferencesSetup';
import './App.css';
import { UserContext } from '../context/UserContext';

const ADMIN_EMAIL = 'vibhu00shukla@gmail.com';
const ADMIN_PASSWORD = 'vibhu';

const ALL_CATEGORIES = ['Technology', 'Business', 'Entertainment', 'Environment', 'Finance', 'Smart Home', 'Social Media', 'Retail' ];

function App() {
  const {user} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  


  useEffect(() => {
    if (user) {
      if (!user.preferences || user.preferences.length === 0) {
        setShowPreferences(true);
      }
    }
    setIsLoading(false);
  }, [user]);

   if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(user)
  
  return (
 
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/feed" /> : <Login />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/feed" /> : <Signup />} 
          />
           <Route 
            path="/feed" 
            element={user ? <Feed   /> : <Navigate to="/login" />} 
          />
          {/* <Route 
            path="/article/:id" 
            element={user ? (showPreferences ? <Navigate to="/preferences-setup" /> : <ArticleDetail user={user}  />) : <Navigate to="/login" />} 
          /> */}
          <Route 
            path="/settings" 
            element={user ?  <Settings     /> : <Navigate to="/login" />} 
          />
          {/*
          <Route 
            path="/preferences-setup"
            element={user ? <PreferencesSetup user={user}  /> : <Navigate to="/login" />} 
          /> */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/feed" : "/login"} />} 
          />
        </Routes>
      </div>
  );
}

export default App; 