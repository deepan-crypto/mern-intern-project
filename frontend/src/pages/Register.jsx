// REGISTER PAGE
// This is where new users can create an account
import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  // Store form data in state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Prepare user data
    const data = {
      name,
      age: age ? Number(age) : null,
      email,
      password,
      collegeName
    };

    try {
      // Send registration request to backend
      const response = await fetch('http://localhost:5000/api/register', {
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
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>📝 Create Account</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            min="1"
          />
        </div>

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
            placeholder="Create a strong password"
          />
        </div>

        <div className="form-group">
          <label>College Name</label>
          <input
            type="text"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            placeholder="Enter your college name"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? 'Creating Account...' : '✓ Register'}
        </button>
      </form>

      <div style={{ marginTop: 12 }}>
        Already have an account? <NavLink to="/login">Login here</NavLink>
      </div>
    </div>
  );
}
