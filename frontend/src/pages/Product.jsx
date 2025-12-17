import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, NavLink } from 'react-router-dom';

export default function Product() {
  const { id } = useParams();
  const { plants, token } = useOutletContext();
  const [plant, setPlant] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const p = plants.find(p => p._id === id);
    if (p) setPlant(p);
    // also fetch from backend in case list is stale
    if (token) {
      fetch(`http://localhost:5000/api/plants/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setPlant(d))
        .catch(() => {});
    }
  }, [id, plants, token]);

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:5000/api/activities?plantId=${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setHistory(data))
      .catch(() => {});
  }, [id, token]);

  if (!plant) {
    return <div><h2>Plant not found</h2><p>Try going back to Dashboard.</p></div>;
  }

  const handleDelete = () => {
    if (!token) return alert('Not logged in');
    if (!confirm('Delete this plant?')) return;
    fetch(`http://localhost:5000/api/plants/${plant._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      window.location = '/';
    }).catch(err => console.error('Delete error', err));
  };

  return (
    <div>
      <h2>{plant.name}</h2>
      {plant.image && <img src={plant.image} alt={plant.name} style={{ maxWidth: 200 }} />}
      <p><strong>Species:</strong> {plant.species}</p>
      <p><strong>Last watered:</strong> {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleString() : '—'}</p>
      <p><strong>Last fertilized:</strong> {plant.lastFertilizedDate ? new Date(plant.lastFertilizedDate).toLocaleString() : '—'}</p>
      <p><strong>Next watering:</strong> {plant.nextWateringDate ? new Date(plant.nextWateringDate).toLocaleString() : '—'}</p>
      <p><strong>Next fertilizing:</strong> {plant.nextFertilizingDate ? new Date(plant.nextFertilizingDate).toLocaleString() : '—'}</p>

      <div style={{ marginTop: 12 }}>
        <NavLink to={`/edit/${plant._id}`} className="button">Edit</NavLink>
        <button onClick={handleDelete} style={{ marginLeft: 8 }}>Delete</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Activity History</h3>
        {history.length === 0 && <p>No activity yet</p>}
        <ul>
          {history.map(a => (
            <li key={a._id}>{a.type} — {new Date(a.date).toLocaleString()} {a.note ? `(${a.note})` : ''}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
