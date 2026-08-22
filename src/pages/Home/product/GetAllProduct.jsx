// ============================================
// GetAllProduct.jsx - FIXED
// ============================================
import React, { useEffect, useState } from "react";
import { getAllProductApi, getImageUrl } from "../../../Apis/Api"; // ✅ Import getImageUrl
import TotalRating from "../../component/TotalRating";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import flashSell from "../../../assets/icons/flash.png";

const GetAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProductApi();
        setProducts(response.data.products);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return <div className="text-sm text-slate-400">Loading products...</div>;
  }
  if (error) {
    return <div className="text-sm text-red-400">{error}</div>;
  }

  const displayedProducts = products
    .filter((product) => product.showProductinSite)
    .slice(0, 8);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold valky text-white">
          Featured Products
        </h2>
        <button
          onClick={() => navigate("/category")}
          className="text-sm text-orange-300 hover:text-orange-200"
        >
          View All
        </button>
      </div>

      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
      >
        {displayedProducts.map((product) => (
          <Link
            to={`/viewProduct/${product._id}`}
            key={product._id}
            className=""
            productId={product._id}
            userId={localStorage.getItem("user")}
          >
            <div className="soft-card m-2 p-4 relative">
              <div>
                <img
                  src={getImageUrl(product.images[0])} // ✅ FIXED: Using getImageUrl()
                  alt={product.name}
                  className="w-full rounded-lg lg:h-[400px] md:h-[300px] h-[200px] hover:scale-105 transition duration-300 ease-in-out"
                  onError={(e) => {
                    console.error("Image failed to load:", product.images[0]);
                    e.target.src =
                      "https://via.placeholder.com/400x500/FF6B6B/FFFFFF?text=Image+Not+Available";
                  }}
                />
              </div>
              <div className="text-white pt-5 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {product.name}
              </div>
              <TotalRating
                productId={product._id}
                averageRating={product.averageRating}
              />
              <div className="mt-2">
                <span className="text-lg text-orange-300 font-bold">
                  Rs. {product.discountedPrice}
                </span>
                <br />
                <span className="text-sm text-slate-500 line-through mr-2">
                  Rs. {product.fakePrice}
                </span>
              </div>
              <div className="absolute top-[0px] lg:right-[-10px] right-[0px]">
                <img
                  src={flashSell}
                  alt="flash sell"
                  className="lg:h-[50px] h-[30px] drop-shadow-lg"
                />
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default GetAllProduct;
