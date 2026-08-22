import React, { useState, useEffect } from 'react';
import { Rating, ThinStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css'; // Import the default styles

// Custom styles for the rating component
const myStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#000000',
  inactiveFillColor: '#E3DCD7',
};

function TotalRating({ productId, averageRating }) {
  // Initialize rating with the given averageRating prop
  const [rating, setRating] = useState(averageRating || 0);

  // Update rating if averageRating prop changes
  useEffect(() => {
    setRating(averageRating || 0);
  }, [averageRating]);

  return (
    <div className='flex flex-col items-start space-y-2'>
      <Rating
        style={{ width: '120px' }}
        value={rating}
        readOnly
        itemStyles={myStyles}
      />
      <p className='text-[#AB3430] text-sm font-semibold'>
        Overall rating: {rating.toFixed(1)}
      </p>
    </div>
  );
}

export default TotalRating;
