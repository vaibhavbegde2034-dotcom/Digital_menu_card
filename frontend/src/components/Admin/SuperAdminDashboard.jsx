import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { UserCog, Search, CheckCircle, XCircle } from 'lucide-react';

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const [newDates, setNewDates] = useState({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/superadmin/admins');
      setAdmins(res.data);
      const initialDates = {};
      res.data.forEach(a => {
        initialDates[a._id] = a.subscriptionEndDate ? new Date(a.subscriptionEndDate).toISOString().split('T')[0] : '';
      });
      setNewDates(initialDates);
    } catch (err) {
      alert('Failed to fetch admins');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/superadmin/admins', newAdmin);
      setNewAdmin({ username: '', password: '' });
      fetchAdmins();
      alert('Client created successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create client');
    }
  };

  const updateSubscription = async (adminId) => {
    try {
      await api.put(`/superadmin/admins/${adminId}/subscription`, { endDate: newDates[adminId] });
      fetchAdmins();
      alert('Subscription updated');
    } catch (err) {
      alert('Failed to update subscription');
    }
  };

  const isExpired = (endDate) => {
    if (!endDate) return true;
    return new Date() > new Date(endDate);
  };

  const filteredAdmins = admins.filter(admin => 
    admin.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <UserCog size={32} color="var(--primary-color)" />
        <h2>Super Admin: Client Management</h2>
      </div>

      <div className="food-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3>Create New Client</h3>
        <form onSubmit={handleCreateAdmin} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <input type="text" className="form-control" placeholder="Username" value={newAdmin.username} onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})} required style={{ flex: 1 }} />
          <input type="password" className="form-control" placeholder="Password" value={newAdmin.password} onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} required style={{ flex: 1 }} />
          <button type="submit" className="btn">Create Client</button>
        </form>
      </div>

      <div className="search-container" style={{ margin: '0 0 2rem 0' }}>
        <Search className="search-icon" size={18} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search clients..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Client Username</th>
              <th>Food Items</th>
              <th>Status</th>
              <th>Set Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map(admin => {
              const expired = isExpired(admin.subscriptionEndDate);
              return (
                <tr key={admin._id}>
                  <td style={{ fontWeight: '600' }}>{admin.username}</td>
                  <td>{admin.foodCount} items</td>
                  <td>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      fontSize: '0.75rem', fontWeight: '700',
                      padding: '4px 8px', borderRadius: '20px',
                      background: expired ? '#fef2f2' : '#f0fdf4',
                      color: expired ? '#991b1b' : '#166534'
                    }}>
                      {expired ? <XCircle size={14} /> : <CheckCircle size={14} />}
                      {expired ? 'Expired' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <input 
                      type="date" 
                      className="form-control"
                      style={{ padding: '0.3rem', fontSize: '0.8rem', width: 'auto' }}
                      value={newDates[admin._id] || ''}
                      onChange={(e) => setNewDates({...newDates, [admin._id]: e.target.value})}
                    />
                  </td>
                  <td>
                    <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => updateSubscription(admin._id)}>Save Date</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
