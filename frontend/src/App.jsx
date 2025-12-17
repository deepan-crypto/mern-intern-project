import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

// App fetches plants and gives them to pages using Outlet context
export default function App() {
  const [plants, setPlants] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    // update token state if user logs in/out in other tabs
    const t = localStorage.getItem('token');
    if (t !== token) setToken(t);
  }, []);

  useEffect(() => {
    // fetch plants if we have a token, otherwise clear
    if (!token) {
      setPlants([]);
      return;
    }
    fetch('http://localhost:5000/api/plants', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPlants(data))
      .catch(err => console.error('Error fetching plants', err));
  }, [token]);

  return (
    <div>
      <Header />
      <div className="container">
        <Outlet context={{ plants, setPlants, token }} />
      </div>
    </div>
  );
}
