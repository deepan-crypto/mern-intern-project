// DASHBOARD PAGE
// This is the main control center where users see all their plants
import React, { useEffect, useState } from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';

export default function Dashboard() {
  const { plants, token } = useOutletContext();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Make sure plants is an array
  const plantList = Array.isArray(plants) ? plants : [];

  // Load activities to show task completion stats
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/activities', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setActivities(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setActivities([]);
        setLoading(false);
      });
  }, [token]);

  // Function to calculate overdue tasks
  const getOverdueTasks = () => {
    const now = new Date();
    let count = 0;

    plantList.forEach(plant => {
      // Check if watering is overdue
      if (plant.nextWateringDate && new Date(plant.nextWateringDate) < now) {
        count += 1;
      }
      // Check if fertilizing is overdue
      if (plant.nextFertilizingDate && new Date(plant.nextFertilizingDate) < now) {
        count += 1;
      }
    });

    return count;
  };

  // Function to count completed tasks (watered or fertilized)
  const getCompletedTasks = () => {
    return activities.filter(a => a.type === 'watered' || a.type === 'fertilized').length;
  };

  // Show login prompt if not authenticated
  if (!token) {
    return (
      <div className="container fade-in">
        <h2>🌱 Plant Watering Tracker</h2>
        <div className="alert alert-info" style={{ background: '#eff6ff', color: '#0066cc', border: '1px solid #99ccff' }}>
          Please <NavLink to="/login">login</NavLink> or <NavLink to="/register">register</NavLink> to see your plants.
        </div>
      </div>
    );
  }

  const overdueTasks = getOverdueTasks();
  const completedTasks = getCompletedTasks();

  return (
    <div className="container fade-in">
      <h2>🌱 Dashboard</h2>

      {/* STATS SECTION */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{plantList.length}</div>
          <div className="stat-label">Total Plants</div>
        </div>

        <div className="stat-card">
          <div className="stat-number" style={{ color: overdueTasks > 0 ? '#c33' : '#3c3' }}>
            {overdueTasks}
          </div>
          <div className="stat-label">Overdue Tasks</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
      </div>

      {/* OVERDUE ALERTS */}
      {overdueTasks > 0 && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          ⚠️ You have {overdueTasks} overdue task{overdueTasks !== 1 ? 's' : ''}! Time to water or fertilize your plants.
        </div>
      )}

      {/* ADD PLANT BUTTON */}
      <div style={{ marginBottom: 20 }}>
        <NavLink to="/add" className="button">
          ➕ Add New Plant
        </NavLink>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="spinner"></div>
      )}

      {/* EMPTY STATE */}
      {!loading && plantList.length === 0 && (
        <div className="alert alert-info" style={{ background: '#f0f8ff', color: '#0066cc', border: '1px solid #99ccff' }}>
          <strong>No plants yet!</strong> Click "Add New Plant" to get started tracking your plants.
        </div>
      )}

      {/* PLANTS TABLE */}
      {!loading && plantList.length > 0 && (
        <div>
          <h3>Your Plants</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Plant Name</th>
                <th>Species</th>
                <th>Next Watering</th>
                <th>Next Fertilizing</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plantList.map(plant => {
                const now = new Date();
                const wateringOverdue = plant.nextWateringDate && new Date(plant.nextWateringDate) < now;
                const fertilizingOverdue = plant.nextFertilizingDate && new Date(plant.nextFertilizingDate) < now;
                const status = wateringOverdue || fertilizingOverdue ? '🔴 Overdue' : '✅ On track';

                return (
                  <tr key={plant._id}>
                    <td>
                      <NavLink to={`/product/${plant._id}`} style={{ fontWeight: 'bold', color: '#2d7cf0' }}>
                        {plant.name}
                      </NavLink>
                    </td>
                    <td>{plant.species || '—'}</td>
                    <td>
                      {plant.nextWateringDate
                        ? new Date(plant.nextWateringDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      {plant.nextFertilizingDate
                        ? new Date(plant.nextFertilizingDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
