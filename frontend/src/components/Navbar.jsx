import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { LogOut, Home, LayoutDashboard, Utensils, List } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdmin();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ background: 'var(--primary-color)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Utensils size={18} />
        </div>
        Digital Menu
      </Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <Link to="/admin/categories" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <List size={16} />
              <span>Categories</span>
            </Link>
            <Link to="/admin/foods" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Utensils size={16} />
              <span>Foods</span>
            </Link>
            <button 
              className="nav-logout-btn" 
              onClick={handleLogout}
              style={{ 
                background: 'var(--primary-soft)', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '0.85rem', 
                color: 'var(--primary-color)', 
                fontWeight: '700', 
                marginLeft: '1.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <LogOut size={16} style={{ transform: 'rotate(180deg)' }} />
            Admin Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
