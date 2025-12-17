import React from 'react';
import { NavLink } from 'react-router-dom';

// simple nav using NavLink only
export default function Header() {
  return (
    <header className="header">
      <h1 className="logo">Plant App</h1>
      <nav>
        <NavLink to="/" className="navlink">Dashboard</NavLink>
        <NavLink to="/add" className="navlink">Add Plant</NavLink>
        <NavLink to="/register" className="navlink">Register</NavLink>
      </nav>
    </header>
  );
}
