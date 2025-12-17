import React from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';

// show list of plants and link to Product using NavLink
export default function Dashboard() {
  const { plants } = useOutletContext();

  const totalPlants = plants.length;
  let overdueCount = 0;
  const now = new Date();

  plants.forEach(p => {
    if (p.nextWateringDate && new Date(p.nextWateringDate) < now) overdueCount += 1;
    if (p.nextFertilizingDate && new Date(p.nextFertilizingDate) < now) overdueCount += 1;
  });

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <NavLink to="/add" className="button">Add Plant</NavLink>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div>Total plants: {totalPlants}</div>
        <div>Overdue tasks: {overdueCount}</div>
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
          {plants.length === 0 && (
            <tr><td colSpan="3">No plants yet</td></tr>
          )}
          {plants.map(p => (
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
