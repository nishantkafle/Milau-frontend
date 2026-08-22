import React, { useEffect, useState } from "react";
import { getAllProductApi, baseURL, getImageUrl } from "../../../Apis/Api";
import TotalRating from "../../component/TotalRating";
import { Link, useNavigate } from "react-router-dom";

const GetNewProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductApi();
        if (response && response.data && response.data.products) {
          setProducts(response.data.products || []);
        } else {
          setProducts([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch products. Please make sure the backend server is running."
        );
        setProducts([]);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="text-sm text-amber-600">Loading new arrivals...</div>
    );
  }
  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  const displayedProducts = products
    .filter((product) => {
      return product.showProductinSite === true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.updatedAt || 0);
      const dateB = new Date(b.createdAt || b.updatedAt || 0);
      return dateB - dateA;
    })
    .slice(0, 12);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-amber-950">New Arrivals</h2>
        <button
          onClick={() => navigate("/category")}
          className="text-sm text-amber-700 hover:text-amber-900 font-medium"
        >
          View All
        </button>
      </div>

      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayedProducts.map((product) => (
            <Link to={`/viewProduct/${product._id}`} key={product._id}>
              <div className="p-4 bg-white rounded-xl border-2 border-amber-200/60 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group">
                <div className="overflow-hidden rounded-lg">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-full rounded-lg lg:h-[350px] md:h-[300px] h-[200px] object-cover group-hover:scale-105 transition duration-300 ease-in-out"
                      onError={(e) => {
                        const placeholderUrl =
                          "https://via.placeholder.com/400x500/8B5CF6/FFFFFF?text=Image+Not+Available";
                        if (
                          e.target.src !== placeholderUrl &&
                          !e.target.src.includes("placeholder")
                        ) {
                          e.target.onerror = null;
                          e.target.src = placeholderUrl;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full rounded-lg lg:h-[350px] md:h-[300px] h-[200px] bg-amber-50 flex items-center justify-center">
                      <span className="text-amber-400 text-sm">No image</span>
                    </div>
                  )}
                </div>
                <div className="text-amber-950 pt-3 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  {product.name}
                </div>
                <div className="hidden lg:block">
                  <TotalRating
                    productId={product._id}
                    averageRating={product.averageRating}
                  />
                </div>
                <div className="lg:mt-2">
                  <span className="lg:text-lg text-amber-700 font-bold">
                    Rs. {product.discountedPrice || product.price}
                  </span>
                  {product.fakePrice && (
                    <>
                      <br />
                      <span className="text-sm text-amber-600/60 line-through">
                        Rs. {product.fakePrice}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-amber-600">
            No new arrivals at the moment. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default GetNewProduct;
