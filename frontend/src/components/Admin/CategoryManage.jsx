import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAdmin } from '../../context/AdminContext';

const CategoryManage = () => {
  const { categories, initialLoadDone, fetchAllData, refreshCategories, isSubscriptionActive } = useAdmin();
  const subscriptionActive = isSubscriptionActive();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialLoadDone) {
      fetchAllData();
    }
  }, [initialLoadDone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subscriptionActive) return alert('Subscription inactive');
    try {
      if (editId) {
        await api.put(`/categories/${editId}`, { name });
      } else {
        await api.post('/categories', { name });
      }
      setName('');
      setEditId(null);
      refreshCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleEdit = (cat) => {
    if (!subscriptionActive) return;
    setEditId(cat._id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
    if (!subscriptionActive) return;
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/categories/${id}`);
        refreshCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Manage Categories</h2>
      
      {!subscriptionActive && (
        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', fontWeight: '600' }}>
          ⚠️ Your subscription has expired or service is inactive. Please contact your administrator to renew.
        </div>
      )}

      {subscriptionActive && (
        <div className="food-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Category Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn" style={{ flex: 1 }}>{editId ? 'Update' : 'Add Category'}</button>
              {editId && (
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setEditId(null);
                  setName('');
                }}>Cancel</button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Food Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>
                  <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>
                    {cat.foodCount || 0} items
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(cat)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', marginRight: '0.5rem', backgroundColor: '#3b82f6', opacity: subscriptionActive ? 1 : 0.5, pointerEvents: subscriptionActive ? 'auto' : 'none' }}>Edit</button>
                  <button onClick={() => handleDelete(cat._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', opacity: subscriptionActive ? 1 : 0.5, pointerEvents: subscriptionActive ? 'auto' : 'none' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManage;
