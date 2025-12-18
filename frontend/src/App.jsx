import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

// App fetches plants and gives them to pages using Outlet context
export default function App() {
  const [plants, setPlants] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [error, setError] = useState(null); // simple error message
  const [backendError, setBackendError] = useState(false); // track backend connection

  useEffect(() => {
    // update token state if user logs in/out in other tabs
    const t = localStorage.getItem('token');
    if (t !== token) setToken(t);
  }, []);

  useEffect(() => {
    // fetch plants if we have a token, otherwise clear
    if (!token) {
      setPlants([]);
      setError(null);
      setBackendError(false);
      return;
    }

    fetch('http://localhost:5000/api/plants', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
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
        <Outlet context={{ plants, setPlants, token, error }} />
      </div>
    </div>
  );
}
