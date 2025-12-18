import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';

// App fetches plants and gives them to pages using Outlet context
export default function App() {
  const [plants, setPlants] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState(null);
  const [backendError, setBackendError] = useState(false);
  const navigate = useNavigate();

  // Check if token exists and is valid
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t !== token) {
      setToken(t);
    }
  }, []);

  // Fetch plants when token changes
  useEffect(() => {
    if (!token) {
      setPlants([]);
      setError(null);
      setBackendError(false);
      return;
    }

    fetch('http://localhost:5000/api/plants', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        // Handle 401 Unauthorized - token is invalid or expired
        if (res.status === 401) {
          console.warn('Token expired or invalid. Logging out.');
          localStorage.removeItem('token');
          setToken(null);
          setPlants([]);
          setError('Your session has expired. Please login again.');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        
        // backend might return an object with message on error
        if (Array.isArray(data)) {
          setPlants(data);
          setError(null);
          setBackendError(false);
        } else {
          setPlants([]);
          setError(data.message || 'Failed to fetch plants');
          setBackendError(false);
        }
      })
      .catch(err => {
        console.error('Error fetching plants', err);
        setPlants([]);
        setError('Cannot connect to backend server. Make sure it is running on port 5000.');
        setBackendError(true);
      });
  }, [token]);

  return (
    <div>
      <Header />
      <div className="container">
        {/* Show backend connection error prominently */}
        {backendError && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            <strong>⚠️ Backend Server Error:</strong> Cannot connect to backend server. 
            Please make sure the backend is running: <code>cd backend && npm run dev</code>
          </div>
        )}
        
        {/* Show session expired error */}
        {error && error.includes('session') && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            <strong>Session Expired:</strong> {error}
          </div>
        )}
        
        <Outlet context={{ plants, setPlants, token, error }} />
      </div>
    </div>
  );
}
