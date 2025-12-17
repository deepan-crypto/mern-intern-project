// PLANT DETAILS PAGE (Product.jsx)
// This shows detailed information about a single plant
// Users can water, fertilize, edit, or delete the plant here
import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, NavLink, useNavigate } from 'react-router-dom';

export default function Product() {
  const { id } = useParams(); // get plant ID from URL
  const { token } = useOutletContext();
  const navigate = useNavigate();

  // Store plant data and activity history in state
  const [plant, setPlant] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch plant details when page loads
  useEffect(() => {
    if (!token) return;

    // Get plant data from backend
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
        setLoading(false);
      });

    // Get activity history for this plant
    fetch(`http://localhost:5000/api/activities?plantId=${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Make sure data is an array before setting activities
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error('Activities data is not an array:', data);
          setActivities([]);
        }
      })
      .catch(err => {
        console.error('Error fetching activities:', err);
        setActivities([]); // ensure it's an array on error
      });
  }, [id, token]);

  // WATER NOW - Mark plant as watered
  const handleWaterNow = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/plants/${id}/water`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        // Update plant data with new watering info
        setPlant(data);

        // Reload activities to show the new "watered" entry
        const actRes = await fetch(`http://localhost:5000/api/activities?plantId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const actData = await actRes.json();
        // Safety check: make sure actData is an array
        if (Array.isArray(actData)) {
          setActivities(actData);
        } else {
          console.error('Activities reload failed, not an array');
        }

        alert('✓ Plant watered successfully!');
      }
    } catch (err) {
      alert('Error watering plant. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // FERTILIZE NOW - Mark plant as fertilized
  const handleFertilizeNow = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/plants/${id}/fertilize`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        // Update plant data with new fertilizing info
        setPlant(data);

        // Reload activities
        const actRes = await fetch(`http://localhost:5000/api/activities?plantId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const actData = await actRes.json();
        // Safety check: make sure actData is an array
        if (Array.isArray(actData)) {
          setActivities(actData);
        } else {
          console.error('Activities reload failed, not an array');
        }

        alert('✓ Plant fertilized successfully!');
      }
    } catch (err) {
      alert('Error fertilizing plant. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE PLANT
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${plant.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/plants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/'); // go back to dashboard
    } catch (err) {
      alert('Error deleting plant. Please try again.');
    }
  };

  // Show loading message while fetching data
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
      <div className="container">
        <div className="card">
          <h2>Plant not found</h2>
          <p>This plant may have been deleted.</p>
          <NavLink to="/" className="button">Go to Dashboard</NavLink>
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
