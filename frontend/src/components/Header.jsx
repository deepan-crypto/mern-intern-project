import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// HEADER COMPONENT
// This shows the navigation bar at the top of every page
export default function Header() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for storage changes (when token is updated in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Logout function - removes token and reloads page
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/'; // go back to home page
  };

  return (
    <header className="header">
      <h1 className="logo">🌿 Plant Tracker</h1>
      <nav className="nav-menu">
        {/* Main Pages (visible when logged in) */}
        {token && (
          <>
            <NavLink to="/" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              Add Plant
            </NavLink>
            <NavLink to="/activities" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              Activities
            </NavLink>
            <NavLink to="/product" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              Product
            </NavLink>
            <NavLink to="/edit" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              Edit Plant
            </NavLink>
          </>
        )}

        {/* Auth Pages (visible when not logged in) */}
        {!token && (
          <>
            <NavLink to="/login" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              Login
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}>
              Register
            </NavLink>
          </>
        )}

        {/* Logout (visible when logged in) */}
        {token && (
          <a 
            onClick={handleLogout} 
            className="navlink logout-link"
            style={{ cursor: 'pointer' }}
          >
            Logout
          </a>
        )}
      </nav>
    </header>
  );
}
