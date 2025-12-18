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
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 401) {
          // Token invalid - log user out
          localStorage.removeItem('token');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
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
          <div className="detail-value">{plant.fertilizingFrequencyDays} days</div>
        </div>
      </div>

      {/* DATES SECTION */}
      <h3>📅 Schedule Information</h3>
      <div className="detail-grid">
        <div className="detail-item">
          <div className="detail-label">Last Watered</div>
          <div className="detail-value">
            {plant.lastWateredDate
              ? new Date(plant.lastWateredDate).toLocaleDateString()
              : '—'}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Next Watering</div>
          <div className="detail-value" style={{ color: wateringOverdue ? '#c33' : '#3c3' }}>
            {plant.nextWateringDate
              ? new Date(plant.nextWateringDate).toLocaleDateString()
              : '—'}
            {wateringOverdue && ' (Overdue!)'}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Last Fertilized</div>
          <div className="detail-value">
            {plant.lastFertilizedDate
              ? new Date(plant.lastFertilizedDate).toLocaleDateString()
              : '—'}
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-label">Next Fertilizing</div>
          <div className="detail-value" style={{ color: fertilizingOverdue ? '#c33' : '#3c3' }}>
            {plant.nextFertilizingDate
              ? new Date(plant.nextFertilizingDate).toLocaleDateString()
              : '—'}
            {fertilizingOverdue && ' (Overdue!)'}
          </div>
        </div>
      </div>

      {/* NOTES SECTION */}
      {plant.notes && (
        <div>
          <h3>📝 Notes</h3>
          <div className="card">
            {plant.notes}
          </div>
        </div>
      )}

      {/* WATERING HISTORY */}
      <h3>💧 Watering History</h3>
      {wateredActivities.length === 0 ? (
        <p style={{ color: '#666' }}>No watering activities recorded yet.</p>
      ) : (
        <ul className="activity-list">
          {wateredActivities.map(activity => (
            <li key={activity._id} className="activity-item">
              <div className="activity-type">✓ Watered</div>
              <div className="activity-date">{new Date(activity.date).toLocaleString()}</div>
              {activity.note && <div className="activity-note">{activity.note}</div>}
            </li>
          ))}
        </ul>
      )}

      {/* FERTILIZING HISTORY */}
      <h3>🌾 Fertilizing History</h3>
      {fertilizedActivities.length === 0 ? (
        <p style={{ color: '#666' }}>No fertilizing activities recorded yet.</p>
      ) : (
        <ul className="activity-list">
          {fertilizedActivities.map(activity => (
            <li key={activity._id} className="activity-item">
              <div className="activity-type">✓ Fertilized</div>
              <div className="activity-date">{new Date(activity.date).toLocaleString()}</div>
              {activity.note && <div className="activity-note">{activity.note}</div>}
            </li>
          ))}
        </ul>
      )}

      {/* ACTION BUTTONS */}
      <div className="button-group" style={{ marginTop: '2rem' }}>
        <NavLink to={`/edit/${plant._id}`} className="button">
          ✏️ Edit Plant
        </NavLink>
        <button
          onClick={handleDelete}
          className="button button-danger"
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : '🗑️ Delete Plant'}
        </button>
      </div>
    </div>
  );
}
