import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name });
      setName('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Manage Categories</h2>
      
      <div className="food-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>New Category Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn">Add Category</button>
        </form>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>
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
