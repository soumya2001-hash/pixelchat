import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './containers/Home.jsx';
import Login from './components/Login.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { fetchUser } from './utils/fetchUser.js';




const App = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();
    if (!user) navigate('/login');
  }, [navigate]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
};

const WrappedApp = () => (
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <Router>
      <App />
    </Router>
  </GoogleOAuthProvider>
);

export default WrappedApp;
