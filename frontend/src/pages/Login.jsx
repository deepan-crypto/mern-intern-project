import React from 'react';

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = { email: form.email.value, password: form.password.value };

    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
      .then(d => {
        if (d.token) {
          localStorage.setItem('token', d.token);
          window.location = '/';
        } else {
          alert(d.message || 'Login failed');
        }
      }).catch(err => console.error('Login error', err));
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Email <input name="email" type="email" required /></label>
        <label>Password <input name="password" type="password" required /></label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
