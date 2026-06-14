import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAdmin } from '../../context/AdminContext';

const CategoryManage = () => {
  const { categories, initialLoadDone, fetchAllData, refreshCategories } = useAdmin();
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
    setEditId(cat._id);
    setName(cat.name);
  };

  const handleDelete = async (id) => {
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
      
      <div className="food-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Edit Category' : 'Add New Category'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Category Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn">{editId ? 'Update' : 'Add Category'}</button>
          {editId && (
            <button type="button" className="btn btn-secondary" onClick={() => {
              setEditId(null);
              setName('');
            }}>Cancel</button>
          )}
        </form>
      </div>

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
                  <button onClick={() => handleEdit(cat)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', marginRight: '0.5rem', backgroundColor: '#3b82f6' }}>Edit</button>
                  <button onClick={() => handleDelete(cat._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Delete</button>
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
