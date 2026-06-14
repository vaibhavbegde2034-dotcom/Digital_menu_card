import { getApiBaseUrl } from '../../api/axios';

const FoodCard = ({ food }) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(food.price);
  
  let imageUrl = food.image || '';
  if (imageUrl && imageUrl.startsWith('/uploads')) {
    imageUrl = `${getApiBaseUrl().replace('/api', '')}${imageUrl}`;
  }

  return (
    <div className="food-card">
      <div style={{ position: 'relative' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={food.name}
            className="food-image"
            loading="lazy"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80'; }}
          />
        ) : (
          <div className="food-image food-image-placeholder">
            <span>{food.name[0]}</span>
          </div>
        )}
        {!food.availability && (
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
            <span className="unavailable-badge">Sold Out</span>
          </div>
        )}
      </div>
      <div className="food-info">
        <h3 className="food-title">{food.name}</h3>
        {food.description && <p className="food-desc">{food.description}</p>}
        <div className="food-footer">
          <span className="food-price">{formattedPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
