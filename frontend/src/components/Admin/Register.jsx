import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await api.post('/auth/setup', { username, password });
      setMessage('Admin registered successfully. Redirecting to login...');
      setTimeout(() => navigate('/admin'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="admin-login">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Register Admin</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
      {message && <p style={{ color: '#16a34a', marginBottom: '1rem', textAlign: 'center' }}>{message}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="btn btn-block">Register Admin</button>
      </form>
      <p className="auth-switch">
        Already have an admin account? <Link to="/admin">Login</Link>
      </p>
    </div>
  );
};

export default Register;
