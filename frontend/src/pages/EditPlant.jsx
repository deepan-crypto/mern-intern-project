// EDIT PLANT PAGE
// This is where users can update their plant information
import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';

export default function EditPlant() {
  const { id } = useParams(); // get plant ID from URL
  const { token } = useOutletContext();
  const navigate = useNavigate();

  // Store form data in state
  const [plant, setPlant] = useState(null);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('7');
  const [fertilizingFrequency, setFertilizingFrequency] = useState('30');
  const [lastWatered, setLastWatered] = useState('');
  const [lastFertilized, setLastFertilized] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load plant data when page loads
  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:5000/api/plants/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPlant(data);
        // Fill form with existing data
        setName(data.name);
        setSpecies(data.species || '');
        setWateringFrequency(data.wateringFrequencyDays.toString());
        setFertilizingFrequency(data.fertilizingFrequencyDays.toString());
        setLastWatered(data.lastWateredDate ? new Date(data.lastWateredDate).toISOString().slice(0, 10) : '');
        setLastFertilized(data.lastFertilizedDate ? new Date(data.lastFertilizedDate).toISOString().slice(0, 10) : '');
        setNotes(data.notes || '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading plant:', err);
        setError('Failed to load plant data');
        setLoading(false);
      });
  }, [id, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Prepare updated plant data
    const updatedData = {
      name,
      species,
      wateringFrequencyDays: Number(wateringFrequency),
      fertilizingFrequencyDays: Number(fertilizingFrequency),
      lastWateredDate: lastWatered || null,
      lastFertilizedDate: lastFertilized || null,
      notes,
      image: plant.image // keep existing image
    };

    try {
      // Send PUT request to update plant
      const response = await fetch(`http://localhost:5000/api/plants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Go back to plant details page
        navigate(`/product/${id}`);
      } else {
        setError(data.message || 'Failed to update plant');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading spinner while fetching plant data
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
        <div className="alert alert-error">Failed to load plant data</div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h2>✏️ Edit Plant</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <h3>Basic Information</h3>

        <div className="form-group">
          <label>Plant Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Species / Type</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
        </div>

        <h3>Schedule</h3>

        <div className="form-group">
          <label>Watering Frequency (days) *</label>
          <input
            type="number"
            value={wateringFrequency}
            onChange={(e) => setWateringFrequency(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Fertilizing Frequency (days) *</label>
          <input
            type="number"
            value={fertilizingFrequency}
            onChange={(e) => setFertilizingFrequency(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label>Last Watered Date</label>
          <input
            type="date"
            value={lastWatered}
            onChange={(e) => setLastWatered(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Last Fertilized Date</label>
          <input
            type="date"
            value={lastFertilized}
            onChange={(e) => setLastFertilized(e.target.value)}
          />
        </div>

        <h3>Notes</h3>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="button-group">
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Saving...' : '✓ Save Changes'}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate(`/product/${id}`)}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
