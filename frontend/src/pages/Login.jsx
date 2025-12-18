// LOGIN PAGE
// This is where users can sign in to their account
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // Store form data in state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Prepare login data
    const data = { email, password };

    try {
      // Send login request to backend
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.token) {
        // Success! Store token and go to dashboard
        localStorage.setItem('token', result.token);
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>🔐 Login</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Logging in...' : '✓ Login'}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        Don't have an account? <NavLink to="/register">Register here</NavLink>
      </div>
    </div>
  );
}
