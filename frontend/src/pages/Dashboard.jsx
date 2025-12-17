import React from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';

// show list of plants and link to Product using NavLink
export default function Dashboard() {
  const { plants, error, token } = useOutletContext();

  // make sure plants is an array, otherwise use empty list
  const list = Array.isArray(plants) ? plants : [];

  if (!token) {
    // simple message if not logged in
    return (
      <div>
        <h2>Dashboard</h2>
        <p>Please <NavLink to="/login">login</NavLink> or <NavLink to="/register">register</NavLink> to see your plants.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>Error: {error}</div>}
      <div style={{ marginBottom: 12 }}>
        <NavLink to="/add" className="button">Add Plant</NavLink>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div>Total plants: {list.length}</div>
        <div>
          Overdue tasks: {
            // compute overdue safely
            list.reduce((acc, p) => {
              const now = new Date();
              if (p.nextWateringDate && new Date(p.nextWateringDate) < now) acc += 1;
              if (p.nextFertilizingDate && new Date(p.nextFertilizingDate) < now) acc += 1;
              return acc;
            }, 0)
          }
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Next Watering</th>
            <th>Next Fertilizing</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr><td colSpan="3">No plants yet</td></tr>
          )}
          {list.map(p => (
            <tr key={p._id}>
              <td>
                <NavLink to={`/product/${p._id}`} state={{ plantId: p._id }}>
                  {p.name}
                </NavLink>
              </td>
              <td>{p.nextWateringDate ? new Date(p.nextWateringDate).toLocaleDateString() : '—'}</td>
              <td>{p.nextFertilizingDate ? new Date(p.nextFertilizingDate).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
