// ADD PLANT PAGE
// This is where users can add a new plant to track
import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function AddPlant() {
  const navigate = useNavigate();
  const { setPlants, token } = useOutletContext();

  // Store form data in state
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('7');
  const [fertilizingFrequency, setFertilizingFrequency] = useState('30');
  const [lastWatered, setLastWatered] = useState('');
  const [lastFertilized, setLastFertilized] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle image file selection and show preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create a preview using FileReader
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // If image file exists, convert to base64 before sending
    let imageData = imagePreview;

    // Prepare plant data
    const data = {
      name,
      species,
      wateringFrequencyDays: Number(wateringFrequency),
      fertilizingFrequencyDays: Number(fertilizingFrequency),
      lastWateredDate: lastWatered || null,
      lastFertilizedDate: lastFertilized || null,
      image: imageData || '', // base64 or empty
      notes
    };

    try {
      // Send POST request to backend
      const response = await fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Success! Refresh plant list and go back to dashboard
        // Simple fetch to update the list
        fetch('http://localhost:5000/api/plants', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(list => {
            setPlants(Array.isArray(list) ? list : []);
            navigate('/');
          });
      } else {
        setError(result.message || 'Failed to add plant');
      }
    } catch (err) {
      console.error('Error adding plant:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>➕ Add New Plant</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* BASIC INFORMATION SECTION */}
        <h3>Basic Information</h3>

        <div className="form-group">
          <label>Plant Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Monstera, Succulent, Tomato Plant"
          />
        </div>

        <div className="form-group">
          <label>Species / Type</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="e.g., Monstera Deliciosa, Aloe Vera"
          />
        </div>

        {/* SCHEDULE SECTION */}
        <h3>Watering & Fertilizing Schedule</h3>

        <div className="form-group">
          <label>Watering Frequency (days) *</label>
          <input
            type="number"
            value={wateringFrequency}
            onChange={(e) => setWateringFrequency(e.target.value)}
            required
            min="1"
            placeholder="e.g., 7 days"
          />
          <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
            How often to water this plant (in days)
          </small>
        </div>

        <div className="form-group">
          <label>Fertilizing Frequency (days) *</label>
          <input
            type="number"
            value={fertilizingFrequency}
            onChange={(e) => setFertilizingFrequency(e.target.value)}
            required
            min="1"
            placeholder="e.g., 30 days"
          />
          <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
            How often to fertilize this plant (in days)
          </small>
        </div>

        <div className="form-group">
          <label>Last Watered Date</label>
          <input
            type="date"
            value={lastWatered}
            onChange={(e) => setLastWatered(e.target.value)}
          />
          <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
            Leave empty if you just got the plant
          </small>
        </div>

        <div className="form-group">
          <label>Last Fertilized Date</label>
          <input
            type="date"
            value={lastFertilized}
            onChange={(e) => setLastFertilized(e.target.value)}
          />
        </div>

        {/* IMAGE SECTION */}
        <h3>Plant Image</h3>

        <div className="form-group">
          <label>Upload Plant Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
            JPG, PNG or GIF. Max 5MB.
          </small>
        </div>

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Plant preview" />
            <p style={{ color: '#666', marginTop: '8px', fontSize: '0.9rem' }}>
              Image preview
            </p>
          </div>
        )}

        {/* NOTES SECTION */}
        <h3>Additional Notes</h3>

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., Prefers indirect sunlight, keep soil moist but not waterlogged"
          />
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="button-group">
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Adding Plant...' : '✓ Add Plant'}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate('/')}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
