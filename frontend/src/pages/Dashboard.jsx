// DASHBOARD PAGE
// This is the main page where users see all their plants
import React from 'react';
import { NavLink, useOutletContext } from 'react-router-dom';

export default function Dashboard() {
  // Get plants data from parent component (App.jsx)
  // useOutletContext is a React Router hook that gets data from parent
  const { plants, error, token } = useOutletContext();

  // Make sure plants is an array (list of plants), not something else
  const list = Array.isArray(plants) ? plants : [];

  // If user is not logged in, show a message
  if (!token) {
    return (
      <div className="container">
        <div className="auth-card fade-in">
          <h2>Welcome to Plant Tracker! 🌱</h2>
          <p style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            Please login or register to start tracking your plants.
          </p>
          <div className="button-group" style={{ justifyContent: 'center' }}>
            <NavLink to="/login" className="button">Login</NavLink>
            <NavLink to="/register" className="button">Register</NavLink>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics for the stats cards
  const totalPlants = list.length;

  // Count how many tasks are overdue (past their watering/fertilizing date)
  const now = new Date();
  const overdueTasks = list.reduce((count, plant) => {
    // Check if watering is overdue
    if (plant.nextWateringDate && new Date(plant.nextWateringDate) < now) {
      count += 1;
    }
    // Check if fertilizing is overdue
    if (plant.nextFertilizingDate && new Date(plant.nextFertilizingDate) < now) {
      count += 1;
    }
    return count;
  }, 0);

  // Count upcoming tasks (in next 3 days)
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
  const upcomingTasks = list.reduce((count, plant) => {
    const nextWater = plant.nextWateringDate ? new Date(plant.nextWateringDate) : null;
    const nextFert = plant.nextFertilizingDate ? new Date(plant.nextFertilizingDate) : null;

    if (nextWater && nextWater >= now && nextWater <= threeDaysFromNow) count += 1;
    if (nextFert && nextFert >= now && nextFert <= threeDaysFromNow) count += 1;
    return count;
  }, 0);

  return (
    <div className="container fade-in">
      <h2>🌿 My Plant Dashboard</h2>

      {/* Show error message if there's a problem loading plants */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* STATISTICS CARDS - Show quick overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalPlants}</div>
          <div className="stat-label">Total Plants</div>
        </div>
        <div className="stat-card" style={{ background: overdueTasks > 0 ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : undefined }}>
          <div className="stat-number">{overdueTasks}</div>
          <div className="stat-label">Overdue Tasks</div>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ffc107, #ff9800)' }}>
          <div className="stat-number">{upcomingTasks}</div>
          <div className="stat-label">Upcoming Tasks (3 days)</div>
        </div>
      </div>

      {/* ADD PLANT BUTTON */}
      <div style={{ marginBottom: '2rem' }}>
        <NavLink to="/add" className="button">+ Add New Plant</NavLink>
      </div>

      {/* PLANTS GRID - Show all plants as cards */}
      {list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No plants yet! 🌱</h3>
          <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
            Start by adding your first plant to track its watering and fertilizing schedule.
          </p>
          <NavLink to="/add" className="button">Add Your First Plant</NavLink>
        </div>
      ) : (
        <div className="plant-grid">
          {list.map(plant => {
            // Check if this plant has overdue tasks
            const waterOverdue = plant.nextWateringDate && new Date(plant.nextWateringDate) < now;
            const fertOverdue = plant.nextFertilizingDate && new Date(plant.nextFertilizingDate) < now;
            const isOverdue = waterOverdue || fertOverdue;

            return (
              <NavLink
                key={plant._id}
                to={`/product/${plant._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="plant-card">
                  {/* Show plant image if available */}
                  {plant.image ? (
                    <img src={plant.image} alt={plant.name} />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '200px',
                      background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '4rem',
                      marginBottom: '1rem'
                    }}>
                      🌿
                    </div>
                  )}

                  <h3>{plant.name}</h3>
                  {plant.species && <p className="plant-info">Species: {plant.species}</p>}

                  <p className="plant-info">
                    💧 Next watering: {plant.nextWateringDate
                      ? new Date(plant.nextWateringDate).toLocaleDateString()
                      : 'Not set'}
                  </p>
                  <p className="plant-info">
                    🌱 Next fertilizing: {plant.nextFertilizingDate
                      ? new Date(plant.nextFertilizingDate).toLocaleDateString()
                      : 'Not set'}
                  </p>

                  {/* Show badge if plant has overdue tasks */}
                  {isOverdue && (
                    <span className="plant-badge badge-overdue">
                      ⚠️ Needs attention!
                    </span>
                  )}
                  {!isOverdue && (
                    <span className="plant-badge badge-ok">
                      ✅ Up to date
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
