import React, { useState, useEffect } from 'react';
import { Rating, ThinStar } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { updateRatingApi, getProductsByRatingApi } from '../../Apis/Api';
import { toast } from 'react-hot-toast';

// Declare the styles outside the component
const myStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#000000',
  inactiveFillColor: '#E3DCD7',
};

function MyRating({ productId, userId }) {
  const [rating, setRating] = useState(0); // Single source of truth for rating
  const [feedback, setFeedback] = useState(''); // To display success or error messages

  useEffect(() => {
    // Fetch the product ratings for the user when component mounts
    const fetchProductRating = async () => {
      try {
        const userId = '66f1960f7913c87c47dbfa13';
        const response = await getProductsByRatingApi(userId, productId);
        if (response.success) {
          const product = response.products[0]; // Assuming a single product is returned
          
          if (product && product.ratings) {
            const userRatings = product.ratings
              .filter((rating) => rating.userId === userId) // Filter for the specific user
              .sort((a, b) => new Date(b._id) - new Date(a._id)); // Sort to get the latest rating

            if (userRatings.length > 0) {
              setRating(userRatings[0].rating); // Set the most recent rating as default
            }
          }
        }
      } catch (error) {
        console.log('Error fetching product rating:', error);
      }
    };

    fetchProductRating();
  }, [productId, userId]);

  const handleRatingChange = async (newRating) => {
    setRating(newRating); // Update the state immediately
    try {
      const response = await updateRatingApi(productId, { rating: newRating });
      toast.success('Rating updated successfully!'); // Success message
      console.log('Updated Product:', response); // For debugging
    } catch (error) {
      toast.error('Error updating rating:', error);
      setFeedback('Failed to update rating.'); // Error message
    }
  };

  return (
    <div className="lg:flex lg:justify-between">
      <Rating
        style={{ width: '100px' }}
        value={rating} // Use the rating from state
        onChange={handleRatingChange}
        itemStyles={myStyles}
      />
      <p className="text-[#AB3430]">Your rating: {rating}</p>

      {feedback && <p className="text-sm text-gray-500 mt-2">{feedback}</p>}
    </div>
  );
}

export default MyRating;
