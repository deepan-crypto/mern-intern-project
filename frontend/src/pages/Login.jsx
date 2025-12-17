// LOGIN PAGE
// This is where users login to their account
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  // useState is a React hook that lets us store data
  // Here we store email, password, error message, and loading state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // This function runs when user clicks Login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page from reloading
    setError(''); // clear any old errors
    setLoading(true); // show loading state

    try {
      // Send login request to backend API
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // send email and password
      });

      const data = await response.json();

      if (data.token) {
        // Login successful! Save token to browser
        localStorage.setItem('token', data.token);
        window.location = '/'; // go to dashboard
      } else {
        // Login failed - show error message
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2>🌱 Welcome Back!</h2>

        {/* Show error message if there is one */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // update email when user types
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // update password when user types
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="button" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
