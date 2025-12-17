import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Activities() {
  const { plants, token } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [filterPlant, setFilterPlant] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    if (!token) return;
    let url = 'http://localhost:5000/api/activities';
    const params = [];
    if (filterPlant) params.push(`plantId=${filterPlant}`);
    if (filterType) params.push(`type=${filterType}`);
    if (params.length) url += '?' + params.join('&');

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setActivities(data))
      .catch(() => {});
  }, [token, filterPlant, filterType]);

  return (
    <div>
      <h2>Activities</h2>

      <div style={{ marginBottom: 12 }}>
        <label>Filter by plant:
          <select onChange={e => setFilterPlant(e.target.value)} value={filterPlant}>
            <option value="">All</option>
            {plants.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
        </label>

        <label style={{ marginLeft: 12 }}>Filter by type:
          <select onChange={e => setFilterType(e.target.value)} value={filterType}>
            <option value="">All</option>
            <option value="watered">watered</option>
            <option value="fertilized">fertilized</option>
            <option value="overdue_watering">overdue_watering</option>
            <option value="overdue_fertilizing">overdue_fertilizing</option>
          </select>
        </label>
      </div>

      <table className="table">
        <thead>
          <tr><th>Plant</th><th>Type</th><th>Date</th><th>Note</th></tr>
        </thead>
        <tbody>
          {activities.map(a => (
            <tr key={a._id}>
              <td>{a.plant ? (plants.find(p => p._id === a.plant)?.name || 'plant') : '—'}</td>
              <td>{a.type}</td>
              <td>{new Date(a.date).toLocaleString()}</td>
              <td>{a.note || ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
