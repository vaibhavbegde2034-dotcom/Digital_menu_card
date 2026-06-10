import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
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
            <a href="#" onClick={handleLogout}>Logout</a>
          </>
        ) : (
          <Link to="/admin">Admin Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
