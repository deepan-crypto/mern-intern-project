// ACTIVITY HISTORY PAGE
// This shows all watering and fertilizing activities for the user's plants
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function Activity() {
  const { token, plants } = useOutletContext();

  // Store activities and filter settings in state
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState('all'); // filter by plant
  const [selectedType, setSelectedType] = useState('all'); // filter by type

  // Load all activities when page loads
  useEffect(() => {
    if (!token) return;

    // Fetch all activities for this user
    fetch('http://localhost:5000/api/activities', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Make sure data is an array before setting it
        // If backend returns an error, it might be an object like { message: "error" }
        if (Array.isArray(data)) {
          setActivities(data);
        } else {
          console.error('Activities data is not an array:', data);
          setActivities([]); // set empty array if error
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading activities:', err);
        setActivities([]); // make sure it's an array even on error
        setLoading(false);
      });
  }, [token]);

  // Filter activities based on selected plant and type
  // Safety check: make sure activities is an array before filtering
  const filteredActivities = Array.isArray(activities) ? activities.filter(activity => {
    // Filter by plant
    if (selectedPlant !== 'all' && activity.plant && activity.plant._id !== selectedPlant) {
      return false;
    }

    // Filter by type (watered, fertilized, etc.)
    if (selectedType !== 'all' && activity.type !== selectedType) {
      return false;
    }

    return true;
  }) : [];

  // Show loading spinner
  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h2>📊 Activity History</h2>

      {/* FILTER SECTION */}
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="filter-grid">
          {/* Filter by Plant */}
          <div className="form-group">
            <label>Filter by Plant</label>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
            >
              <option value="all">All Plants</option>
              {/* Safety check: make sure plants is an array before mapping */}
              {Array.isArray(plants) && plants.map(plant => (
                <option key={plant._id} value={plant._id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Activity Type */}
          <div className="form-group">
            <label>Filter by Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="watered">Watered</option>
              <option value="fertilized">Fertilized</option>
              <option value="overdue_watering">Overdue Watering</option>
              <option value="overdue_fertilizing">Overdue Fertilizing</option>
            </select>
          </div>
        </div>
      </div>

      {/* ACTIVITY LIST */}
      {filteredActivities.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No activities found</h3>
          <p style={{ color: 'var(--text-light)' }}>
            {!Array.isArray(activities) || activities.length === 0
              ? "You haven't recorded any activities yet. Start watering your plants!"
              : "No activities match your filters. Try changing the filter settings."}
          </p>
        </div>
      ) : (
        <div>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
            Showing {filteredActivities.length} of {activities.length} activities
          </p>

          <ul className="activity-list">
            {filteredActivities.map(activity => {
              // Choose icon based on activity type
              let icon = '•';
              let color = 'var(--primary-green)';

              if (activity.type === 'watered') {
                icon = '💧';
                color = '#3498db';
              } else if (activity.type === 'fertilized') {
                icon = '🌱';
                color = '#f39c12';
              } else if (activity.type.includes('overdue')) {
                icon = '⚠️';
                color = '#e74c3c';
              }

              return (
                <li
                  key={activity._id}
                  className="activity-item"
                  style={{ borderLeftColor: color }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="activity-type" style={{ color }}>
                        {icon} {activity.type.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <div style={{ fontWeight: '600', marginTop: '0.3rem' }}>
                        {activity.plant && activity.plant.name ? activity.plant.name : 'Unknown Plant'}
                      </div>
                      {activity.note && (
                        <div className="activity-note">{activity.note}</div>
                      )}
                    </div>
                    <div className="activity-date">
                      {new Date(activity.date).toLocaleString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
