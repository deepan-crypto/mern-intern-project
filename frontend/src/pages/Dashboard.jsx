import React from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';

// show list of plants and link to Product using NavLink
export default function Dashboard() {
  const { plants } = useOutletContext();

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: 12 }}>
        <NavLink to="/add" className="button">Add Plant</NavLink>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Scientific Name</th>
            <th>Category</th>
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
              <td>{p.scientificName}</td>
              <td>{p.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
