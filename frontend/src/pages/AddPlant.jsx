import React from 'react';
import { useOutletContext } from 'react-router-dom';

export default function AddPlant() {
  const { setPlants } = useOutletContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    // collect form values using event.target
    const form = e.target;
    const data = {
      name: form.name.value,
      scientificName: form.scientificName.value,
      category: form.category.value,
      water: form.water.value,
      light: form.light.value,
      temperature: form.temperature.value
    };

    // send to backend
    fetch('http://localhost:5000/api/plants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(newPlant => {
        // update local list simply by fetching again or setting state
        // here we fetch list again (simple)
        fetch('http://localhost:5000/api/plants')
          .then(r => r.json())
          .then(list => {
            setPlants(list);
            // go back to dashboard - simple redirect
            window.location = '/';
          });
      })
      .catch(err => console.error('Error adding plant', err));
  };

  return (
    <div>
      <h2>Add Plant</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Name <input name="name" required /></label>
        <label>Scientific Name <input name="scientificName" /></label>
        <label>Category <input name="category" /></label>
        <label>Water <input name="water" /></label>
        <label>Light <input name="light" /></label>
        <label>Temperature <input name="temperature" /></label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
