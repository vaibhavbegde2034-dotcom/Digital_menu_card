import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Menu from '../Customer/Menu';
import MenuQrCode from './MenuQrCode';
import { useAdmin } from '../../context/AdminContext';

const Dashboard = () => {
  const { admin, foods, categories, initialLoadDone, fetchAllData, refreshAdmin } = useAdmin();
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }

    if (!initialLoadDone) {
      fetchAllData();
    }
  }, [navigate, initialLoadDone]);

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('logo', logoFile);

    try {
      await api.put('/auth/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      refreshAdmin();
      setLogoFile(null);
      alert('Logo updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error uploading logo');
    } finally {
      setUploading(false);
    }
  };

  const stats = {
    foods: foods.length,
    categories: categories.length
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        {admin?.logo && (
          <img src={admin.logo} alt="Restaurant Logo" style={{ height: '60px', borderRadius: '8px', objectFit: 'contain' }} />
        )}
      </div>

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
        <div className="food-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <h3>Restaurant Settings</h3>
          <p className="qr-description">Upload your restaurant logo for the menu card.</p>
          <form onSubmit={handleLogoUpload} style={{ marginTop: '1rem' }}>
            <input 
              type="file" 
              className="form-control" 
              onChange={(e) => setLogoFile(e.target.files[0])} 
              accept="image/*"
              style={{ marginBottom: '1rem' }}
            />
            <button type="submit" className="btn btn-block" disabled={!logoFile || uploading}>
              {uploading ? 'Uploading...' : 'Upload Logo'}
            </button>
          </form>
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
