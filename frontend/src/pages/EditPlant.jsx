import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext, useNavigate, NavLink } from 'react-router-dom';

export default function EditPlant() {
  const { id } = useParams(); 
  const { token } = useOutletContext();
  const navigate = useNavigate();

  const [plant, setPlant] = useState(null);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('7');
  const [fertilizingFrequency, setFertilizingFrequency] = useState('30');
  const [lastWatered, setLastWatered] = useState('');
  const [lastFertilized, setLastFertilized] = useState('');
  const [notes, setNotes] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  // Load plant data when page loads
  useEffect(() => {
    if (!token) {
      setError('Please login to edit plants');
      setLoading(false);
      return;
    }

    if (!id) {
      setError('Invalid plant ID');
      setNotFound(true);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/plants/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 404) {
          setNotFound(true);
          setError('Plant not found');
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        
        setPlant(data);
        // Fill form with existing data
        setName(data.name || '');
        setSpecies(data.species || '');
        setWateringFrequency(data.wateringFrequencyDays?.toString() || '7');
        setFertilizingFrequency(data.fertilizingFrequencyDays?.toString() || '30');
        setLastWatered(data.lastWateredDate ? new Date(data.lastWateredDate).toISOString().slice(0, 10) : '');
        setLastFertilized(data.lastFertilizedDate ? new Date(data.lastFertilizedDate).toISOString().slice(0, 10) : '');
        setNotes(data.notes || '');
        if (data.image) {
          setImagePreview(data.image);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading plant:', err);
        setError('Failed to load plant data. Please try again.');
        setNotFound(true);
        setLoading(false);
      });
  }, [id, token]);

  // Handle image file selection and show preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
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

    let imageData = imagePreview;

    const updatedData = {
      name,
      species,
      wateringFrequencyDays: Number(wateringFrequency),
      fertilizingFrequencyDays: Number(fertilizingFrequency),
      lastWateredDate: lastWatered || null,
      lastFertilizedDate: lastFertilized || null,
      notes,
      image: imageData || '' 
    };

    try {
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
      console.error('Error updating plant:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading spinner while fetching plant data
  if (loading) {
    return (
      <div className="container fade-in">
        <div className="spinner"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!token) {
    return (
      <div className="container fade-in">
        <h2>✏️ Edit Plant</h2>
        <div className="alert alert-error">
          Please <NavLink to="/login">login</NavLink> to edit plants.
        </div>
      </div>
    );
  }

  // Show error if plant not found
  if (notFound || !plant) {
    return (
      <div className="container fade-in">
        <h2>✏️ Edit Plant</h2>
        <div className="alert alert-error">
          {error || 'Plant not found. It may have been deleted.'}
        </div>
        <div style={{ marginTop: '16px' }}>
          <NavLink to="/" className="button">
            ← Back to Dashboard
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <h2>✏️ Edit Plant</h2>

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
            placeholder="e.g., Monstera, Succulent"
          />
        </div>

        <div className="form-group">
          <label>Species / Type</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            placeholder="e.g., Monstera Deliciosa"
          />
        </div>

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
          <small>How often to water this plant (in days)</small>
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
          <small>How often to fertilize this plant (in days)</small>
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

        {/* IMAGE SECTION */}
        <h3>Plant Image</h3>

        <div className="form-group">
          <label>Update Plant Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>JPG, PNG or GIF. Max 5MB. Leave empty to keep existing image.</small>
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
            placeholder="e.g., Prefers indirect sunlight, keep soil moist"
          />
        </div>

        {/* SUBMIT BUTTONS */}
        <div className="button-group">
          <button type="submit" className="button" disabled={submitting}>
            {submitting ? 'Saving Changes...' : '✓ Save Changes'}
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
