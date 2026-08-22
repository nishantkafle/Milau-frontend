import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import {
  getProductByIdApi,
  getAllCategoryApi,
  createOrderApi,
} from "../../Apis/Api";
import MyRating from "../component/Rating";
import ImageGallery from "./ImageGallery";
import GetAllProduct from "../Home/product/GetRecentViewedProducts";
import GetRecentViewedProducts from "../Home/product/GetRecentViewedProducts";
import GetNewProduct from "../Home/product/GetNewProduct";

const ViewProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [count, setCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [shippingAddress, setShippingAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchCategoriesAndProduct = async () => {
      try {
        const [categoryResponse, productResponse] = await Promise.all([
          getAllCategoryApi(),
          getProductByIdApi(id),
        ]);

        if (categoryResponse.status === 200) {
          setCategories(categoryResponse.data.categories || []);
        } else {
          toast.error("Failed to fetch categories.");
        }

        if (productResponse.status === 200) {
          setProduct(productResponse.data.product);
        } else {
          toast.error("Failed to fetch product.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCategoriesAndProduct();
  }, [id]);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count > 1 ? count - 1 : count);

  const handleBuyNowClick = () => {
    if (!selectedSize) {
      toast.error("Please select a size", { position: "top-right" });
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color", { position: "top-right" });
      return;
    }

    setIsModalOpen(true);
  };

  const handleCancelClick = () => {
    setIsModalOpen(false);
  };

  const handleBuyClick = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Please enter a valid shipping address.", {
        position: "top-right",
      });
      return;
    }

    if (!user?.id) {
      toast.error("User is not logged in. Please log in first.");
      return;
    }

    const orderData = {
      userId: user.id,
      items: [
        {
          productId: product._id,
          name: product.name,
          size: selectedSize,
          color: selectedColor,
          images: product.images,
          quantity: count,
          discountedPrice: product.discountedPrice,
        },
      ],
      shippingAddress,
      totalAmount: count * product.discountedPrice,
      shippingCharge: count * product.discountedPrice >= 1000 ? 200 : 500,
      totalPriceWithShipping:
        count * product.discountedPrice +
        (count * product.discountedPrice >= 1000 ? 200 : 500),
      status: "pending",
    };

    try {
      const response = await createOrderApi(orderData);
      toast.success(response.data.message || "Order placed successfully!");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  if (!product || !categories.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 flex items-center justify-center">
        <div className="text-amber-700 text-lg font-medium">
          Loading product details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Product Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10">
            {/* Left: Image Gallery */}
            <div className="relative">
              <div className="sticky top-8">
                <ImageGallery images={product.images} />
              </div>
            </div>

            {/* Right: Product Details */}
            <div className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-amber-950 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <MyRating rating={product.averageRating || 0} />
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 py-4 border-y border-amber-200/50">
                <span className="text-3xl lg:text-4xl font-bold text-amber-700">
                  Rs. {product.discountedPrice}
                </span>
                {product.fakePrice && (
                  <span className="text-xl text-amber-600/60 line-through">
                    Rs. {product.fakePrice}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-amber max-w-none">
                <p className="text-amber-900/80 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-amber-950 uppercase tracking-wider">
                  Select Size
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((sizeObj, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedSize(sizeObj.size);
                        setSelectedColor(""); // Reset color when size changes
                      }}
                      className={`px-4 py-3 rounded-lg border-2 font-semibold transition-all duration-200 ${
                        selectedSize === sizeObj.size
                          ? "border-amber-600 bg-amber-600 text-white shadow-md"
                          : "border-amber-200 bg-white text-amber-900 hover:border-amber-400 hover:bg-amber-50"
                      }`}
                    >
                      {sizeObj.size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              {selectedSize && (
                <div className="space-y-3 animate-fadeIn">
                  <label className="block text-sm font-semibold text-amber-950 uppercase tracking-wider">
                    Select Color
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {product.sizes
                      .find((size) => size.size === selectedSize)
                      ?.colors.map((color, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(color.color)}
                          className={`px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                            selectedColor === color.color
                              ? "border-amber-600 bg-amber-600 text-white shadow-md"
                              : "border-amber-200 bg-white text-amber-900 hover:border-amber-400 hover:bg-amber-50"
                          }`}
                        >
                          {color.color}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-amber-950 uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={decrement}
                    className="w-12 h-12 rounded-lg border-2 border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-400 text-amber-900 font-bold text-xl transition-all duration-200 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold text-amber-950 min-w-[3rem] text-center">
                    {count}
                  </span>
                  <button
                    onClick={increment}
                    className="w-12 h-12 rounded-lg border-2 border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-400 text-amber-900 font-bold text-xl transition-all duration-200 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Buy Now Button */}
              <button
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg mt-6"
                onClick={handleBuyNowClick}
              >
                Buy Now
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200/50">
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-amber-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-amber-900/80 font-medium">
                    Secure Payment
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-amber-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-amber-900/80 font-medium">
                    Cash on Delivery
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto mb-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-amber-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-amber-900/80 font-medium">
                    Easy Returns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-5">
                <h2 className="text-2xl font-bold text-white text-center">
                  Shipping Details
                </h2>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div className="bg-amber-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-900/70">Product</span>
                    <span className="font-semibold text-amber-950">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-900/70">Size</span>
                    <span className="font-semibold text-amber-950">
                      {selectedSize}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-900/70">Color</span>
                    <span className="font-semibold text-amber-950">
                      {selectedColor}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-900/70">Quantity</span>
                    <span className="font-semibold text-amber-950">
                      {count}
                    </span>
                  </div>
                  <div className="border-t border-amber-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-amber-950">Total</span>
                      <span className="font-bold text-amber-700 text-lg">
                        Rs. {count * product.discountedPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-amber-950 uppercase tracking-wider">
                    Delivery Address
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-amber-900 placeholder-amber-400"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your full delivery address..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancelClick}
                    className="flex-1 px-6 py-3 bg-white border-2 border-amber-300 text-amber-900 font-semibold rounded-lg hover:bg-amber-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBuyClick}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Confirm Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ViewProduct;
