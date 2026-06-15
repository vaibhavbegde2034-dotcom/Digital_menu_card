import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/superadmin/admins');
      setAdmins(res.data);
    } catch (err) {
      alert('Failed to fetch admins');
    }
  };

  const extendSubscription = async (adminId, months) => {
    try {
      await api.put(`/superadmin/admins/${adminId}/subscription`, { months });
      fetchAdmins();
      alert('Subscription extended successfully');
    } catch (err) {
      alert('Failed to extend subscription');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Super Admin Panel</h2>
      <table className="table" style={{ marginTop: '2rem' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Food Items</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin._id}>
              <td>{admin.username}</td>
              <td>{admin.foodCount}</td>
              <td>{admin.subscriptionEndDate ? new Date(admin.subscriptionEndDate).toLocaleDateString() : 'N/A'}</td>
              <td>
                <button className="btn" style={{ padding: '0.4rem', fontSize: '0.8rem', marginRight: '5px' }} onClick={() => extendSubscription(admin._id, 1)}>+1 Mo</button>
                <button className="btn btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem' }} onClick={() => extendSubscription(admin._id, 12)}>+1 Yr</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuperAdminDashboard;
