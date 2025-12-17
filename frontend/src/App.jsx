import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';

// App fetches plants and gives them to pages using Outlet context
export default function App() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    // fetch plants from backend
    fetch('http://localhost:5000/api/plants')
      .then(res => res.json())
      .then(data => setPlants(data))
      .catch(err => console.error('Error fetching plants', err));
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <Outlet context={{ plants, setPlants }} />
      </div>
    </div>
  );
}
