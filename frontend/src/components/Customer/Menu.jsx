import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import FoodCard from './FoodCard';

const Menu = ({ title = 'Our Menu', subtitle = 'Discover our delicious offerings' }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { adminId } = useParams();

  useEffect(() => {
    fetchData();
  }, [adminId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const requestConfig = adminId ? { params: { admin: adminId } } : undefined;
      const requests = [
        api.get('/foods', requestConfig),
        api.get('/categories', requestConfig)
      ];

      const [foodsRes, categoriesRes] = await Promise.all(requests);
      setFoods(foodsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayTitle = title;
  
  const filteredFoods = foods.filter(food => {
    const matchesCategory = activeCategory === 'All' || food.category?.name === activeCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="menu-header">
        <h1>{displayTitle}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="search-container">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search for dishes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-filter">
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
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading menu...</p>
        </div>
      ) : (
        <>
          <div className="food-grid">
            {filteredFoods.map(food => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
          {filteredFoods.length === 0 && (
            <p className="empty-menu">No matching menu items found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;
