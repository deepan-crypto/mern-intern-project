// PLANT DETAILS PAGE
// This page shows full details for a single plant and its activity history
import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate, NavLink } from 'react-router-dom';

export default function Product() {
  const { id } = useParams();
  const { plants, token } = useOutletContext();
  const navigate = useNavigate();

  // State for plant data and activities
  const [plant, setPlant] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Fetch plant details and its activity history
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    // Try to find plant in the local list first
    const localPlant = plants.find(p => p._id === id);
    if (localPlant) {
      setPlant(localPlant);
    }

    // Also fetch from backend to get latest data
    fetch(`http://localhost:5000/api/plants/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPlant(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching plant:', err);
        setError('Failed to load plant details');
        setLoading(false);
      });
  }, [id, plants, token]);

  // Fetch activity history for this plant
  useEffect(() => {
    if (!token || !plant) return;

    fetch(`http://localhost:5000/api/activities?plantId=${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setActivities(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setActivities([]);
      });
  }, [id, plant, token]);

  // Handle plant deletion with confirmation
  const handleDelete = async () => {
    if (!token) return;
    if (!window.confirm('Are you sure you want to delete this plant? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        // Success! Go back to dashboard
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete plant');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Show login prompt if not authenticated
  if (!token) {
    return (
      <div className="container fade-in">
        <h2>🌱 Plant Details</h2>
        <div className="alert alert-info">
          Please <NavLink to="/login">login</NavLink> to view plant details.
        </div>
      </div>
    );
  }

  // Show loading spinner
  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Show error if plant not found
  if (!plant) {
    return (
      <div className="container fade-in">
        <h2>🌱 Plant Details</h2>
        <div className="alert alert-error">
          Plant not found. <NavLink to="/">Go back to dashboard</NavLink>
        </div>
      </div>
    );
  }

  // Function to filter activities by type
  const wateredActivities = activities.filter(a => a.type === 'watered');
  const fertilizedActivities = activities.filter(a => a.type === 'fertilized');

  // Check if plant is overdue
  const now = new Date();
  const wateringOverdue = plant.nextWateringDate && new Date(plant.nextWateringDate) < now;
  const fertilizingOverdue = plant.nextFertilizingDate && new Date(plant.nextFertilizingDate) < now;

  return (
    <div className="container fade-in">
      <h2>🌿 {plant.name}</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {/* PLANT IMAGE */}
      {plant.image && (
        <img src={plant.image} alt={plant.name} className="plant-detail-image" />
      )}

      {/* PLANT BASIC INFO GRID */}
      <div className="detail-grid">
        <div className="detail-item">
          <div className="detail-label">Species</div>
          <div className="detail-value">{plant.species || '—'}</div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Watering Frequency</div>
          <div className="detail-value">{plant.wateringFrequencyDays} days</div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Fertilizing Frequency</div>
        </div>
      </div>
    );
  }

  // Check if plant needs attention (overdue)
  const now = new Date();
  const waterOverdue = plant.nextWateringDate && new Date(plant.nextWateringDate) < now;
  const fertOverdue = plant.nextFertilizingDate && new Date(plant.nextFertilizingDate) < now;

  return (
    <div className="container plant-detail fade-in">
      <h2>{plant.name}</h2>

      {/* PLANT IMAGE */}
      {plant.image ? (
        <img src={plant.image} alt={plant.name} className="plant-detail-image" />
      ) : (
        <div style={{
          width: '100%',
          height: '300px',
          background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '6rem',
          marginBottom: '2rem'
        }}>
          🌿
        </div>
      )}

      {/* PLANT INFO GRID */}
      <div className="detail-grid">
        <div className="detail-item">
          <div className="detail-label">Species</div>
          <div className="detail-value">{plant.species || 'Not specified'}</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Watering Frequency</div>
          <div className="detail-value">Every {plant.wateringFrequencyDays} days</div>
        </div>
        <div className="detail-item">
          <div className="detail-label">Fertilizing Frequency</div>
          <div className="detail-value">Every {plant.fertilizingFrequencyDays} days</div>
        </div>
      </div>

      {/* WATERING & FERTILIZING INFO */}
      <div className="card">
        <h3>💧 Watering Schedule</h3>
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Last Watered:</strong> {plant.lastWateredDate ? new Date(plant.lastWateredDate).toLocaleString() : 'Never'}</p>
          <p><strong>Next Watering:</strong> {plant.nextWateringDate ? new Date(plant.nextWateringDate).toLocaleString() : 'Not set'}</p>
          {waterOverdue && <p style={{ color: 'var(--danger-red)', fontWeight: '600' }}>⚠️ Watering is overdue!</p>}
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <h3>🌱 Fertilizing Schedule</h3>
          <p><strong>Last Fertilized:</strong> {plant.lastFertilizedDate ? new Date(plant.lastFertilizedDate).toLocaleString() : 'Never'}</p>
          <p><strong>Next Fertilizing:</strong> {plant.nextFertilizingDate ? new Date(plant.nextFertilizingDate).toLocaleString() : 'Not set'}</p>
          {fertOverdue && <p style={{ color: 'var(--danger-red)', fontWeight: '600' }}>⚠️ Fertilizing is overdue!</p>}
        </div>

        {/* WATER & FERTILIZE BUTTONS - THE KEY FEATURE! */}
        <div className="button-group" style={{ marginTop: '2rem' }}>
          <button
            onClick={handleWaterNow}
            className="button"
            disabled={actionLoading}
            style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)' }}
          >
            💧 Water Now
          </button>
          <button
            onClick={handleFertilizeNow}
            className="button"
            disabled={actionLoading}
            style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}
          >
            🌱 Fertilize Now
          </button>
        </div>
      </div>

      {/* NOTES */}
      {plant.notes && (
        <div className="card">
          <h3>📝 Notes</h3>
          <p>{plant.notes}</p>
        </div>
      )}

      {/* ACTIVITY HISTORY */}
      <div className="card">
        <h3>📊 Activity History</h3>
        {/* Safety check: make sure activities is an array before checking length or mapping */}
        {!Array.isArray(activities) || activities.length === 0 ? (
          <p style={{ color: 'var(--text-light)' }}>No activities recorded yet.</p>
        ) : (
          <ul className="activity-list">
            {activities.map(activity => (
              <li key={activity._id} className="activity-item">
                <div className="activity-type">
                  {activity.type === 'watered' && '💧 Watered'}
                  {activity.type === 'fertilized' && '🌱 Fertilized'}
                  {activity.type === 'overdue_watering' && '⚠️ Overdue Watering'}
                  {activity.type === 'overdue_fertilizing' && '⚠️ Overdue Fertilizing'}
                </div>
                <div className="activity-date">{new Date(activity.date).toLocaleString()}</div>
                {activity.note && <div className="activity-note">{activity.note}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* EDIT & DELETE BUTTONS */}
      <div className="button-group">
        <NavLink to={`/edit/${plant._id}`} className="button button-secondary">
          ✏️ Edit Plant
        </NavLink>
        <button onClick={handleDelete} className="button button-danger">
          🗑️ Delete Plant
        </button>
      </div>
    </div>
  );
}
