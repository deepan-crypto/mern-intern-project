// REGISTER PAGE
// This is where new users create an account
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  // Store all the form data using useState
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // This function runs when user submits the registration form
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    setError(''); // clear old errors
    setLoading(true);

    try {
      // Send registration data to backend
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          age: age ? Number(age) : undefined,
          collegeName
        })
      });

      const data = await response.json();

      if (data.token) {
        // Registration successful! Save token and go to dashboard
        localStorage.setItem('token', data.token);
        window.location = '/';
      } else {
        // Show error (like "email already exists")
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <h2>🌱 Create Account</h2>

        {/* Show error message if any */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
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
              placeholder="Create a password"
            />
          </div>

          <div className="form-group">
            <label>Age (optional)</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </div>

          <div className="form-group">
            <label>College Name (optional)</label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              placeholder="Enter your college name"
            />
          </div>

          <button type="submit" className="button" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
