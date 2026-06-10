import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import FoodCard from './FoodCard';

const Menu = ({ title = 'Our Menu', subtitle = 'Discover our delicious offerings', adminName }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publicAdminName, setPublicAdminName] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { adminId } = useParams();

  useEffect(() => {
    fetchData();
  }, [adminId]);

  const fetchData = async () => {
    try {
      const requestConfig = adminId ? { params: { admin: adminId } } : undefined;
      const requests = [
        api.get('/foods', requestConfig),
        api.get('/categories', requestConfig)
      ];

      if (adminId) {
        requests.push(api.get(`/auth/public/${adminId}`));
      }

      const [foodsRes, categoriesRes, adminRes] = await Promise.all(requests);
      setFoods(foodsRes.data);
      setCategories(categoriesRes.data);
      setPublicAdminName(adminRes?.data?.username || '');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const displayAdminName = adminName || publicAdminName;
  const displayTitle = displayAdminName && title === 'Our Menu' ? `${displayAdminName}'s Menu` : title;
  const filteredFoods = activeCategory === 'All' 
    ? foods 
    : foods.filter(food => food.category?.name === activeCategory);

  return (
    <div>
      <div className="menu-header">
        {displayAdminName && <p className="menu-admin-name">Admin: {displayAdminName}</p>}
        <h1>{displayTitle}</h1>
        <p>{subtitle}</p>
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

      <div className="food-grid">
        {filteredFoods.map(food => (
          <FoodCard key={food._id} food={food} />
        ))}
      </div>
      {filteredFoods.length === 0 && (
        <p className="empty-menu">No menu items are available yet.</p>
      )}
    </div>
  );
};

export default Menu;
