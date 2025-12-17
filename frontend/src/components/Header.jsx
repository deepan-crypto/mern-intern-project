import React from 'react';
import { NavLink } from 'react-router-dom';

// HEADER COMPONENT
// This shows the navigation bar at the top of every page
export default function Header() {
  // Check if user is logged in by looking for token in browser storage
  const token = localStorage.getItem('token');

  // Logout function - removes token and reloads page
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location = '/'; // go back to home page
  };

  return (
    <header className="header">
      <h1>🌿 Plant Tracker</h1>
      <nav>
        {/* These links will be highlighted when active */}
        <NavLink to="/" className="navlink">Dashboard</NavLink>
        <NavLink to="/add" className="navlink">Add Plant</NavLink>
        <NavLink to="/activities" className="navlink">Activities</NavLink>

        {/* Show Login/Register if not logged in */}
        {!token && <NavLink to="/login" className="navlink">Login</NavLink>}
        {!token && <NavLink to="/register" className="navlink">Register</NavLink>}

        {/* Show Logout button if logged in */}
        {token && (
          <button onClick={handleLogout} className="button button-secondary" style={{ padding: '0.5rem 1rem' }}>
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
