import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function AddPlant() {
  const { setPlants, token } = useOutletContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    // function to send the data to backend
    const send = (imageData) => {
      const data = {
        name: form.name.value,
        species: form.species.value,
        wateringFrequencyDays: Number(form.wateringFrequencyDays.value),
        fertilizingFrequencyDays: Number(form.fertilizingFrequencyDays.value),
        lastWateredDate: form.lastWateredDate.value || null,
        lastFertilizedDate: form.lastFertilizedDate.value || null,
        image: imageData || form.imageUrl.value || '',
        notes: form.notes.value
      };

      fetch('http://localhost:5000/api/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(newPlant => {
          // simple fetch again to update the list
          fetch('http://localhost:5000/api/plants', { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(list => {
              setPlants(list);
              window.location = '/';
            });
        }).catch(err => console.error('Error adding plant', err));
    };

    // handle file input if present
    const file = form.imageFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        send(reader.result); // base64
      };
      reader.readAsDataURL(file);
    } else {
      send(null);
    }
  };

  return (
    <div>
      <h2>Add Plant</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Name <input name="name" required /></label>
        <label>Species <input name="species" /></label>
        <label>Watering frequency (days) <input name="wateringFrequencyDays" type="number" defaultValue="7" /></label>
        <label>Fertilizing frequency (days) <input name="fertilizingFrequencyDays" type="number" defaultValue="30" /></label>
        <label>Last watered date <input name="lastWateredDate" type="date" /></label>
        <label>Last fertilized date <input name="lastFertilizedDate" type="date" /></label>
        <label>Image file (optional) <input name="imageFile" type="file" accept="image/*" /></label>
        <label>Or Image URL (optional) <input name="imageUrl" /></label>
        <label>Notes <input name="notes" /></label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
