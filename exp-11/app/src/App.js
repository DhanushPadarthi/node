import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';

function App() {
  return (
    <div>
      <h2>Simple React SPA</h2>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
