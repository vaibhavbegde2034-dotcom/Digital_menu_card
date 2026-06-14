import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Menu from '../Customer/Menu';
import MenuQrCode from './MenuQrCode';
import { useAdmin } from '../../context/AdminContext';
import { LayoutDashboard, UtensilsCrossed, ListTree, Settings, Camera } from 'lucide-react';

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutDashboard size={28} color="var(--primary-color)" />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Dashboard</h2>
        </div>
        {admin?.logo && (
          <img src={admin.logo} alt="Restaurant Logo" style={{ height: '50px', borderRadius: '12px', objectFit: 'contain', border: '1px solid var(--border-color)', padding: '4px', background: '#fff' }} />
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ background: 'var(--primary-soft)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <UtensilsCrossed size={24} color="var(--primary-color)" />
          </div>
          <h3>Total Foods</h3>
          <p className="stat-value">{stats.foods}</p>
          <Link to="/admin/foods" className="btn" style={{ marginTop: '1.25rem', width: '100%', padding: '0.6rem' }}>Manage Foods</Link>
        </div>
        
        <div className="stat-card">
          <div style={{ background: 'var(--primary-soft)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <ListTree size={24} color="var(--primary-color)" />
          </div>
          <h3>Categories</h3>
          <p className="stat-value">{stats.categories}</p>
          <Link to="/admin/categories" className="btn" style={{ marginTop: '1.25rem', width: '100%', padding: '0.6rem' }}>Manage Categories</Link>
        </div>

        <div className="stat-card">
          <div style={{ background: 'var(--primary-soft)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Settings size={24} color="var(--primary-color)" />
          </div>
          <h3>Restaurant Logo</h3>
          <p className="qr-description" style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>Update your brand logo for the menu.</p>
          <form onSubmit={handleLogoUpload}>
            <label className="btn btn-secondary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', cursor: 'pointer', gap: '0.5rem' }}>
              <Camera size={16} />
              {logoFile ? 'Photo Selected' : 'Choose Logo'}
              <input 
                type="file" 
                style={{ display: 'none' }}
                onChange={(e) => setLogoFile(e.target.files[0])} 
                accept="image/*"
              />
            </label>
            {logoFile && (
              <button type="submit" className="btn" style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem' }} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Confirm Upload'}
              </button>
            )}
          </form>
        </div>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <MenuQrCode adminId={admin?._id} />
      </div>

      <div style={{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
        <Menu
          title="Live Preview"
          subtitle="This is how your customers see your menu card"
          adminName={admin?.username}
        />
      </div>
    </div>
  );
};

export default Dashboard;
