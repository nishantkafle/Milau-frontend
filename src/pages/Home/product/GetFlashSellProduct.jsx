import React, { useEffect, useState } from "react";
import { getAllProductApi, getImageUrl } from "../../../Apis/Api";
import TotalRating from "../../component/TotalRating";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import flashSell from "../../../assets/icons/flash.png";

const GetFlashSellProduct = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔄 Fetching products for flash sale...");
        const response = await getAllProductApi();

        if (response && response.data && response.data.products) {
          const allProducts = response.data.products || [];
          console.log("✅ Total products fetched:", allProducts.length);

          // Debug: Check flash sale products
          const flashProducts = allProducts.filter(
            (p) => p.isFlashSale === true
          );
          const visibleProducts = allProducts.filter(
            (p) => p.showProductinSite === true
          );
          const flashAndVisible = allProducts.filter(
            (p) => p.isFlashSale === true && p.showProductinSite === true
          );

          console.log("📊 Product Stats:");
          console.log("  - Total products:", allProducts.length);
          console.log("  - Flash sale products:", flashProducts.length);
          console.log("  - Visible products:", visibleProducts.length);
          console.log("  - Flash + Visible:", flashAndVisible.length);

          // Show first few products for debugging
          if (allProducts.length > 0) {
            console.log("🔍 Sample products:");
            allProducts.slice(0, 3).forEach((p, i) => {
              console.log(`  ${i + 1}. ${p.name}`);
              console.log(`     - isFlashSale: ${p.isFlashSale}`);
              console.log(`     - showProductinSite: ${p.showProductinSite}`);
              console.log(`     - images: ${p.images?.length || 0} images`);
              console.log(`     - First image: ${p.images?.[0]}`);
              console.log(`     - Image URL: ${getImageUrl(p.images?.[0])}`);
            });
          }

          setProducts(allProducts);
        } else {
          console.warn("⚠️ No products in response");
          setProducts([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
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
      <div className="flex items-center justify-center py-8">
        <div className="text-amber-600 flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading flash sale pieces...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-700 underline hover:text-red-900"
        >
          Try again
        </button>
      </div>
    );
  }

  // Filter for flash sale products that are visible
  const flashSaleProducts = products.filter((product) => {
    return product.isFlashSale === true && product.showProductinSite === true;
  });

  // Fallback to bestsellers if no flash sale products
  const bestSellerProducts =
    flashSaleProducts.length > 0
      ? flashSaleProducts.slice(0, 8)
      : products
          .filter((product) => product.showProductinSite === true)
          .sort((a, b) => {
            // Sort by rating first
            const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
            if (ratingDiff !== 0) return ratingDiff;

            // Then by date (newest first)
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
          })
          .slice(0, 8);

  console.log("🎯 Displaying products:", bestSellerProducts.length);
  console.log(
    "🏷️ Type:",
    flashSaleProducts.length > 0 ? "Flash Sale" : "Bestsellers"
  );

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1500 },
      items: 5,
    },
    LargeDesktops: {
      breakpoint: { max: 1500, min: 1024 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-amber-950">
            {flashSaleProducts.length > 0
              ? "⚡ Flash Sale Products"
              : "🌟 Bestsellers"}
          </h2>
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
            {bestSellerProducts.length} items
          </span>
        </div>
        <button
          onClick={() => navigate("/category")}
          className="text-sm text-amber-700 hover:text-amber-900 transition font-medium"
        >
          View All →
        </button>
      </div>

      {bestSellerProducts.length > 0 ? (
        <Carousel
          responsive={responsive}
          infinite={bestSellerProducts.length > 4}
          autoPlay={bestSellerProducts.length > 1}
          autoPlaySpeed={3000}
          removeArrowOnDeviceType={["mobile"]}
        >
          {bestSellerProducts.map((product) => (
            <Link
              to={`/viewProduct/${product._id}`}
              key={product._id}
              className="block"
            >
              <div className="m-2 p-4 relative bg-white rounded-xl border-2 border-amber-200/60 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group">
                <div className="overflow-hidden rounded-lg relative">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={getImageUrl(product.images[0])}
                      alt={product.name}
                      className="w-full rounded-lg lg:h-[350px] md:h-[300px] h-[200px] object-cover transition duration-300 ease-in-out group-hover:scale-105"
                      onError={(e) => {
                        console.error("❌ Image failed to load:");
                        console.error("  Product:", product.name);
                        console.error("  Path:", product.images[0]);
                        console.error("  Full URL:", e.target.src);

                        const placeholderUrl =
                          "https://via.placeholder.com/400x500/F59E0B/FFFFFF?text=Image+Not+Available";
                        if (
                          e.target.src !== placeholderUrl &&
                          !e.target.src.includes("placeholder")
                        ) {
                          e.target.onerror = null;
                          e.target.src = placeholderUrl;
                        }
                      }}
                      onLoad={() => {
                        console.log("✅ Image loaded:", product.name);
                      }}
                    />
                  ) : (
                    <div className="w-full rounded-lg lg:h-[350px] md:h-[300px] h-[200px] bg-amber-50 flex items-center justify-center">
                      <span className="text-amber-400 text-sm">No image</span>
                    </div>
                  )}

                  {/* Flash sale badge */}
                  {product.isFlashSale && (
                    <div className="absolute top-2 right-2 z-10">
                      <img
                        src={flashSell}
                        alt="flash sell"
                        className="h-12 drop-shadow-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="text-amber-950 pt-5 font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  {product.name}
                </div>

                <div className="hidden lg:block md:block">
                  <TotalRating
                    productId={product._id}
                    averageRating={product.averageRating}
                  />
                </div>

                <div className="lg:mt-2">
                  <span className="text-lg text-amber-700 font-bold">
                    Rs. {product.discountedPrice || product.price}
                  </span>
                  {product.fakePrice && (
                    <>
                      <br />
                      <span className="text-sm text-amber-600/60 line-through mr-2">
                        Rs. {product.fakePrice}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      ) : (
        <div className="text-center py-12 bg-amber-50 rounded-xl">
          <p className="text-amber-600 text-lg">
            No products available at the moment.
          </p>
          <p className="text-amber-500 text-sm mt-2">
            Check back soon for new arrivals!
          </p>
        </div>
      )}
    </div>
  );
};

export default GetFlashSellProduct;
