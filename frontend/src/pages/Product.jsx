import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';

export default function Product() {
  const { id } = useParams();
  const { plants } = useOutletContext();

  const plant = plants.find(p => p._id === id);

  if (!plant) {
    return <div><h2>Product not found</h2><p>Try going back to Dashboard.</p></div>;
  }

  return (
    <div>
      <h2>{plant.name}</h2>
      <p><strong>Scientific Name:</strong> {plant.scientificName}</p>
      <p><strong>Category:</strong> {plant.category}</p>
      <p><strong>Water:</strong> {plant.water}</p>
      <p><strong>Light:</strong> {plant.light}</p>
      <p><strong>Temperature:</strong> {plant.temperature}</p>
    </div>
  );
}
