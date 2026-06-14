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

  // Spicy text helper
  const renderSpicyLevel = (level) => {
    if (!level || level === 0) return null;
    
    let text = '';
    let color = '';
    
    if (level === 2) {
      text = 'Medium Spicy';
      color = '#f97316'; // Orange
    } else if (level === 3) {
      text = 'Extra Spicy';
      color = '#ef4444'; // Red
    }

    return (
      <span style={{ 
        fontSize: '0.65rem', 
        fontWeight: '700', 
        color: color, 
        backgroundColor: `${color}15`, // Transparent version of the color
        padding: '2px 6px', 
        borderRadius: '4px', 
        textTransform: 'uppercase',
        marginLeft: '8px'
      }}>
        {text}
      </span>
    );
  };

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
        {/* Dietary Indicator (Green/Red Dot) */}
        <div style={{ 
          position: 'absolute', 
          top: '10px', 
          left: '10px', 
          background: 'rgba(255,255,255,0.9)', 
          padding: '4px', 
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `1px solid ${food.dietaryType === 'non-veg' ? '#ef4444' : '#22c55e'}`
        }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            background: food.dietaryType === 'non-veg' ? '#ef4444' : '#22c55e' 
          }}></div>
        </div>
      </div>
      <div className="food-info">
        <h3 className="food-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>
            {food.name}
            {renderSpicyLevel(food.spicyLevel)}
          </span>
        </h3>
        {food.description && <p className="food-desc">{food.description}</p>}
        <div className="food-footer">
          <span className="food-price">{formattedPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
