import { getApiBaseUrl } from '../../api/axios';

const FoodCard = ({ food }) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(food.price);
  
  let imageUrl = food.image || '';
  if (imageUrl && imageUrl.startsWith('/uploads')) {
    imageUrl = `${getApiBaseUrl().replace('/api', '')}${imageUrl}`;
  }

  return (
    <div className="food-card">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={food.name}
          className="food-image"
          loading="lazy"
          onError={(e) => { e.target.onerror = null; e.target.src = '/path-to-placeholder.jpg'; }}
        />
      ) : (
        <div className="food-image food-image-placeholder">
          <span>No Image</span>
        </div>
      )}
      <div className="food-info">
        <h3 className="food-title">{food.name}</h3>
        <p className="food-desc">{food.description}</p>
        <div className="food-footer">
          <span className="food-price">{formattedPrice}</span>
          {!food.availability && <span className="unavailable-badge">Unavailable</span>}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
