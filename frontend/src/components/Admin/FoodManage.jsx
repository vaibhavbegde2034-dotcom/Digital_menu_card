import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getApiBaseUrl } from '../../api/axios';

const FoodManage = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    availability: true,
    image: null
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(price);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [foodsRes, catRes] = await Promise.all([
        api.get('/foods'),
        api.get('/categories')
      ]);
      setFoods(foodsRes.data);
      setCategories(catRes.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      if (editId) {
        await api.put(`/foods/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/foods', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setFormData({ name: '', description: '', price: '', category: '', availability: true, image: null });
      setEditId(null);
      document.getElementById('imageInput').value = '';
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving food item');
    }
  };

  const handleEdit = (food) => {
    setEditId(food._id);
    setFormData({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category?._id || '',
      availability: food.availability,
      image: null
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await api.delete(`/foods/${id}`);
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting food item');
      }
    }
  };

  const filteredFoods = foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    food.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 style={{ marginBottom: '2rem' }}>Manage Foods</h2>
      
      <div className="food-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{editId ? 'Edit Food' : 'Add New Food'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" step="0.01" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleInputChange} required rows="3"></textarea>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-control" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Image</label>
              <input type="file" id="imageInput" className="form-control" name="image" onChange={handleInputChange} accept="image/*" />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="availability" checked={formData.availability} onChange={handleInputChange} id="availability" />
              <label htmlFor="availability" style={{ marginBottom: 0 }}>Available</label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn">{editId ? 'Update Food' : 'Add Food'}</button>
            {editId && (
              <button type="button" className="btn btn-danger" onClick={() => {
                setEditId(null);
                setFormData({ name: '', description: '', price: '', category: '', availability: true, image: null });
              }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="search-container" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search by name or category..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map(food => (
              <tr key={food._id}>
                <td>
                  {food.image && <img src={food.image} alt={food.name} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', background: '#fff', padding: '2px' }} />}
                </td>
                <td>{food.name}</td>
                <td>{food.category?.name}</td>
                <td>{formatPrice(food.price)}</td>
                <td>{food.availability ? 'Available' : 'Unavailable'}</td>
                <td>
                  <button onClick={() => handleEdit(food)} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', marginRight: '0.5rem', backgroundColor: '#3b82f6' }}>Edit</button>
                  <button onClick={() => handleDelete(food._id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFoods.length === 0 && (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No matching food items found.</p>
        )}
      </div>
    </div>
  );
};

export default FoodManage;
