// ADD PLANT PAGE
// This is where users can add a new plant to track
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function AddPlant() {
  const { token } = useOutletContext();
  const navigate = useNavigate(); // React Router hook for navigation

  // Store all form data in state
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('7');
  const [fertilizingFrequency, setFertilizingFrequency] = useState('30');
  const [lastWatered, setLastWatered] = useState('');
  const [lastFertilized, setLastFertilized] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Convert image to base64 if there is one
    let imageData = '';
    if (imageFile) {
      imageData = imagePreview; // we already have it in base64
    }

    // Prepare data to send to backend
    const plantData = {
      name,
      species,
      wateringFrequencyDays: Number(wateringFrequency),
      fertilizingFrequencyDays: Number(fertilizingFrequency),
      lastWateredDate: lastWatered || null,
      lastFertilizedDate: lastFertilized || null,
      image: imageData,
      notes
    };

    try {
      // Send POST request to create new plant
      const response = await fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // include token for authentication
        },
        body: JSON.stringify(plantData)
      });

      const data = await response.json();

      if (response.ok) {
        // Success! Go back to dashboard
        navigate('/');
      } else {
        setError(data.message || 'Failed to add plant');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fade-in">
      <h2>🌱 Add New Plant</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        {/* BASIC INFO SECTION */}
        <h3>Basic Information</h3>

        <div className="form-group">
          <label>Plant Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., My Snake Plant"
          />
        </div>

        <div className="form-group">
          <label>Species / Type</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="e.g., Sansevieria"
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
            placeholder="How many days between watering?"
          />
          <small style={{ color: 'var(--text-light)' }}>
            How often should this plant be watered? (e.g., 7 for once a week)
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
            placeholder="How many days between fertilizing?"
          />
          <small style={{ color: 'var(--text-light)' }}>
            How often should this plant be fertilized? (e.g., 30 for once a month)
          </small>
        </div>

        <div className="form-group">
          <label>Last Watered Date</label>
          <input
            type="date"
            value={lastWatered}
            onChange={(e) => setLastWatered(e.target.value)}
          />
          <small style={{ color: 'var(--text-light)' }}>
            When did you last water this plant? Leave empty if you just got it.
          </small>
        </div>

        <div className="form-group">
          <label>Last Fertilized Date</label>
          <input
            type="date"
            value={lastFertilized}
            onChange={(e) => setLastFertilized(e.target.value)}
          />
          <small style={{ color: 'var(--text-light)' }}>
            When did you last fertilize this plant?
          </small>
        </div>

        {/* IMAGE SECTION */}
        <h3>Plant Photo (Optional)</h3>

        <div className="form-group">
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Show image preview if user selected one */}
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        {/* NOTES SECTION */}
        <h3>Notes</h3>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special care instructions or notes..."
          />
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="button-group">
          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Adding Plant...' : '✓ Add Plant'}
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
