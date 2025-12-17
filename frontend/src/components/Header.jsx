import React from 'react';
import { NavLink } from 'react-router-dom';

// simple nav using NavLink only
export default function Header() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    // remove token and reload to go back to public view
    localStorage.removeItem('token');
    window.location = '/';
  };

  return (
    <header className="header">
      <h1 className="logo">Plant App</h1>
      <nav>
        <NavLink to="/" className="navlink">Dashboard</NavLink>
        <NavLink to="/add" className="navlink">Add Plant</NavLink>
        <NavLink to="/activities" className="navlink">Activities</NavLink>

        {!token && <NavLink to="/login" className="navlink">Login</NavLink>}
        {!token && <NavLink to="/register" className="navlink">Register</NavLink>}
        {token && (
          <a onClick={handleLogout} className="navlink" style={{ cursor: 'pointer' }}>Logout</a>
        )}
      </nav>
    </header>
  );
}
