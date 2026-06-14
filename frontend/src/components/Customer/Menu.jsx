import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import FoodCard from './FoodCard';

const Menu = ({ 
  title = 'Our Menu', 
  subtitle = 'Discover our delicious offerings',
  foods: initialFoods = null,
  categories: initialCategories = null,
  adminName: initialAdminName = '',
  adminLogo: initialAdminLogo = ''
}) => {
  const [foods, setFoods] = useState(initialFoods || []);
  const [categories, setCategories] = useState(initialCategories || []);
  const [adminName, setAdminName] = useState(initialAdminName);
  const [adminLogo, setAdminLogo] = useState(initialAdminLogo);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // 'all', 'veg', 'non-veg'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(!initialFoods);
  const { adminId } = useParams();

  useEffect(() => {
    // Only fetch if data wasn't provided via props
    if (!initialFoods) {
      fetchData();
    } else {
      // Sync state if props change (important for the preview)
      setFoods(initialFoods);
      setCategories(initialCategories);
      setAdminName(initialAdminName);
      setAdminLogo(initialAdminLogo);
      setLoading(false);
    }
  }, [adminId, initialFoods, initialCategories, initialAdminName, initialAdminLogo]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const requestConfig = adminId ? { params: { admin: adminId } } : undefined;
      const requests = [
        api.get('/foods', requestConfig),
        api.get('/categories', requestConfig)
      ];

      // If we have an adminId, fetch the admin's name for the header
      if (adminId) {
        requests.push(api.get(`/auth/public/${adminId}`));
      }

      const results = await Promise.all(requests);
      setFoods(results[0].data);
      setCategories(results[1].data);

      if (adminId && results[2]) {
        setAdminName(results[2].data.username);
        setAdminLogo(results[2].data.logo);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayTitle = adminName || title;

  const filteredFoods = foods.filter(food => {
    const matchesCategory = activeCategory === 'All' || food.category?.name === activeCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDietary = dietaryFilter === 'all' || food.dietaryType === dietaryFilter;
    return matchesCategory && matchesSearch && matchesDietary;
  });

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div className="menu-header">
        {adminLogo && (
          <div style={{ marginBottom: '1.25rem' }}>
            <img 
              src={adminLogo} 
              alt="Logo" 
              style={{ height: '70px', objectFit: 'contain', borderRadius: '16px', padding: '6px', background: '#fff', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }} 
            />
          </div>
        )}
        <h1>{displayTitle}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="search-container">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search your favorites..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setDietaryFilter('all')}
          style={{ 
            padding: '0.4rem 1rem', 
            borderRadius: '100px', 
            border: '1px solid var(--border-color)', 
            background: dietaryFilter === 'all' ? 'var(--text-main)' : '#fff',
            color: dietaryFilter === 'all' ? '#fff' : 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          All
        </button>
        <button 
          onClick={() => setDietaryFilter('veg')}
          style={{ 
            padding: '0.4rem 1rem', 
            borderRadius: '100px', 
            border: `1px solid ${dietaryFilter === 'veg' ? '#22c55e' : 'var(--border-color)'}`, 
            background: dietaryFilter === 'veg' ? '#f0fdf4' : '#fff',
            color: dietaryFilter === 'veg' ? '#166534' : 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }}></div>
          Pure Veg
        </button>
        <button 
          onClick={() => setDietaryFilter('non-veg')}
          style={{ 
            padding: '0.4rem 1rem', 
            borderRadius: '100px', 
            border: `1px solid ${dietaryFilter === 'non-veg' ? '#ef4444' : 'var(--border-color)'}`, 
            background: dietaryFilter === 'non-veg' ? '#fef2f2' : '#fff',
            color: dietaryFilter === 'non-veg' ? '#991b1b' : 'var(--text-muted)',
            fontSize: '0.8rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
          Non-Veg
        </button>
      </div>

      <div className="category-filter" style={{ marginBottom: '3rem' }}>
        <button 
          className={`category-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat._id}
            className={`category-btn ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p style={{ marginTop: '1.25rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Preparing your menu...</p>
        </div>
      ) : (
        <>
          <div className="food-grid">
            {filteredFoods.map(food => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p className="empty-menu" style={{ fontSize: '1.1rem', fontWeight: 600 }}>No dishes found matching "{searchTerm}"</p>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try a different keyword or category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;
