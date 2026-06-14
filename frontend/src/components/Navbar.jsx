import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

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
      <Link to="/" className="navbar-brand">Digital Menu</Link>
      <div className="nav-links">
        {token ? (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/foods">Foods</Link>
            <button 
              className="nav-logout-btn" 
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit', color: 'inherit', fontWeight: '500', marginLeft: '1.5rem' }}
            >
              Logout
            </button>

          </>
        ) : (
          <Link to="/admin">Admin Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
