import React from 'react';

export default function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      age: Number(form.age.value),
      email: form.email.value,
      password: form.password.value,
      collegeName: form.collegeName.value
    };

    fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => {
      if (res.ok) {
        alert('Registered successfully');
        window.location = '/';
      } else {
        res.json().then(d => alert(d.message || 'Registration failed'));
      }
    }).catch(err => console.error('Register error', err));
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Name <input name="name" required /></label>
        <label>Age <input name="age" type="number" /></label>
        <label>Email <input name="email" type="email" required /></label>
        <label>Password <input name="password" type="password" required /></label>
        <label>College Name <input name="collegeName" /></label>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
