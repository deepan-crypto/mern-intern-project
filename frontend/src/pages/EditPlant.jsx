import React, { useEffect, useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';

export default function EditPlant() {
  const { id } = useParams();
  const { token } = useOutletContext();
  const [plant, setPlant] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:5000/api/plants/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setPlant(d))
      .catch(() => {});
  }, [id, token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      species: form.species.value,
      wateringFrequencyDays: Number(form.wateringFrequencyDays.value),
      fertilizingFrequencyDays: Number(form.fertilizingFrequencyDays.value),
      lastWateredDate: form.lastWateredDate.value || null,
      lastFertilizedDate: form.lastFertilizedDate.value || null,
      image: form.imageUrl.value || plant.image || '',
      notes: form.notes.value
    };

    fetch(`http://localhost:5000/api/plants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(data)
    }).then(r => r.json())
      .then(() => window.location = `/product/${id}`)
      .catch(err => console.error('Update error', err));
  };

  if (!plant) return <div>Loading...</div>;

  return (
    <div>
      <h2>Edit Plant</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Name <input name="name" defaultValue={plant.name} required /></label>
        <label>Species <input name="species" defaultValue={plant.species} /></label>
        <label>Watering frequency (days) <input name="wateringFrequencyDays" type="number" defaultValue={plant.wateringFrequencyDays} /></label>
        <label>Fertilizing frequency (days) <input name="fertilizingFrequencyDays" type="number" defaultValue={plant.fertilizingFrequencyDays} /></label>
        <label>Last watered date <input name="lastWateredDate" type="date" defaultValue={plant.lastWateredDate ? new Date(plant.lastWateredDate).toISOString().slice(0,10) : ''} /></label>
        <label>Last fertilized date <input name="lastFertilizedDate" type="date" defaultValue={plant.lastFertilizedDate ? new Date(plant.lastFertilizedDate).toISOString().slice(0,10) : ''} /></label>
        <label>Image URL <input name="imageUrl" defaultValue={plant.image} /></label>
        <label>Notes <input name="notes" defaultValue={plant.notes} /></label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
