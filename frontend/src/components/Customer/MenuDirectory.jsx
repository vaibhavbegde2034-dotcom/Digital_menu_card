import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const MenuDirectory = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await api.get('/auth/public');
        setAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div>
      <div className="menu-header">
        <h1>Select Menu</h1>
        <p>Choose an admin to view their menu card</p>
      </div>

      {loading ? (
        <p className="empty-menu">Loading menus...</p>
      ) : (
        <div className="admin-menu-grid">
          {admins.map((admin) => (
            <Link key={admin._id} to={`/menu/${admin._id}`} className="admin-menu-card">
              <span className="admin-menu-label">Admin</span>
              <strong>{admin.username}</strong>
              <span>View Menu</span>
            </Link>
          ))}
        </div>
      )}

      {!loading && admins.length === 0 && (
        <p className="empty-menu">No admin menus are available yet.</p>
      )}
    </div>
  );
};

export default MenuDirectory;
