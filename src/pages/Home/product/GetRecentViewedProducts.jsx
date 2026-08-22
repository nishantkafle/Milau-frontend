// GetRecentViewedProducts.jsx - FIXED
// ============================================
import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../Apis/Api"; // ✅ Import getImageUrl
import MyRating from "../../component/Rating";
import { Link } from "react-router-dom";

const GetRecentViewedProducts = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const fetchRecentProducts = () => {
      try {
        const recentProducts =
          JSON.parse(localStorage.getItem("recentlyViewed")) || [];
        setRecentlyViewed(recentProducts);
      } catch (error) {
        console.error(
          "Error fetching recently viewed products from localStorage:",
          error
        );
      }
    };

    fetchRecentProducts();
  }, []);

  if (!recentlyViewed.length) {
    return (
      <div className="text-gray-500 text-center">
        No recently viewed products found.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recently Viewed Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentlyViewed.map((product) => (
          <Link
            to={`/viewProduct/${product._id}`}
            key={product._id}
            className="relative border rounded-lg p-4"
          >
            <img
              src={getImageUrl(product.images[0])} // ✅ FIXED: Using getImageUrl()
              alt={product.name}
              className="w-full rounded-lg lg:h-[400px] md:h-[300px] h-[200px] object-cover"
              onError={(e) => {
                console.error("Image failed to load:", product.images[0]);
                e.target.src =
                  "https://via.placeholder.com/400x500/9333EA/FFFFFF?text=Image+Not+Available";
              }}
            />
            <div className="text-[#767676] pt-5 font-bold whitespace-nowrap overflow-hidden text-ellipsis">
              {product.name}
            </div>
            <MyRating rating={product.rating} />
            <div className="mt-2">
              <span className="text-lg text-red-600 font-bold">
                Rs. {product.discountedPrice}
              </span>
              <br />
              <span className="text-sm text-gray-500 line-through mr-2">
                Rs. {product.fakePrice}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GetRecentViewedProducts;
