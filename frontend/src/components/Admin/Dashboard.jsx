import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Menu from '../Customer/Menu';
import MenuQrCode from './MenuQrCode';

const Dashboard = () => {
  const [stats, setStats] = useState({ foods: 0, categories: 0 });
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchStats = async () => {
      try {
        const [foodsRes, catRes] = await Promise.all([
          api.get('/foods'),
          api.get('/categories')
        ]);
        const adminRes = await api.get('/auth/me');
        setStats({
          foods: foodsRes.data.length,
          categories: catRes.data.length
        });
        setAdmin(adminRes.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/admin');
        }
      }
    };
    fetchStats();
  }, [navigate]);

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="food-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Total Foods</h3>
          <p style={{ fontSize: '3rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{stats.foods}</p>
          <Link to="/admin/foods" className="btn" style={{ marginTop: '1rem' }}>Manage Foods</Link>
        </div>
        <div className="food-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Categories</h3>
          <p style={{ fontSize: '3rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>{stats.categories}</p>
          <Link to="/admin/categories" className="btn" style={{ marginTop: '1rem' }}>Manage Categories</Link>
        </div>
        <MenuQrCode adminId={admin?._id} />
      </div>

      <Menu
        title="Menu Card Preview"
        subtitle="Review the live customer menu from the admin dashboard"
        adminName={admin?.username}
      />
    </div>
  );
};

export default Dashboard;
