import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// HEADER COMPONENT
// This shows the navigation bar at the top of every page
export default function Header() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for storage changes (when token is updated in another tab or same tab)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    
    // Listen for cross-tab storage changes
    window.addEventListener('storage', handleStorageChange);
    // Listen for same-tab custom event (dispatched after login/register)
    window.addEventListener('tokenChanged', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChanged', handleStorageChange);
    };
  }, []);

  // Logout function - removes token and navigates to home
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.dispatchEvent(new Event('tokenChanged'));
    window.location.href = '/'; // go back to home page
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
