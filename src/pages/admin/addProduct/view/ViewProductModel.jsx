import React, { useState, useEffect } from "react";
import { baseURL } from "../../../../Apis/Api";

const ProductModal = ({
  product,
  categories,
  subCategories,
  isOpen,
  onClose,
}) => {
  const [largeImage, setLargeImage] = useState(null);

  useEffect(() => {
    if (isOpen && product && product.images && product.images.length > 0) {
      setLargeImage(product.images[0]);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleImageClick = (image) => {
    setLargeImage(image);
  };

  // Helper functions to get category and subcategory names
  const getCategoryName = (categoryId) => {
    if (!categoryId) return "No category";
    if (typeof categoryId === "object" && categoryId !== null) {
      return categoryId.name || "No category";
    }
    const category = categories.find(
      (cat) => cat._id.toString() === categoryId.toString()
    );
    return category ? category.name : "No category";
  };

  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return "N/A";
    if (typeof subcategoryId === "object" && subcategoryId !== null) {
      return subcategoryId.name || "N/A";
    }
    const subcategory = subCategories.find(
      (sub) => sub._id.toString() === subcategoryId.toString()
    );
    return subcategory ? subcategory.name : "N/A";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl z-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Gallery Section */}
            <div className="flex-shrink-0 lg:w-[400px]">
              {/* Large Image */}
              <div className="flex justify-center mb-4 bg-gray-50 rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
                <img
                  src={`${baseURL}/${largeImage}`}
                  alt="Product display"
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex flex-row gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${baseURL}/${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      className={`h-20 w-20 object-cover cursor-pointer rounded-lg border-2 transition-all flex-shrink-0 ${
                        largeImage === image
                          ? "border-[#AB3430] shadow-md scale-105"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Information Section */}
            <div className="flex-grow space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Description
                </label>
                <p className="text-gray-900 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {product.description || "No description available"}
                </p>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cost Price */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Cost Price
                  </label>
                  <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                    <span className="text-2xl font-bold text-emerald-700">
                      Npr. {product.price}
                    </span>
                  </div>
                </div>

                {/* Retail Price */}
                {product.discountedPrice && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Retail Price
                    </label>
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                      <span className="text-2xl font-bold text-red-700">
                        Npr. {product.discountedPrice}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Category
                  </label>
                  <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                    <span className="text-lg font-semibold text-indigo-700">
                      {getCategoryName(product.category)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Subcategory
                  </label>
                  <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                    <span className="text-lg font-semibold text-purple-700">
                      {getSubcategoryName(product.subcategory)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Show on Site */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Show on Site
                </label>
                <div
                  className={`rounded-lg p-3 border inline-block ${
                    product.showProductinSite
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <span
                    className={`text-lg font-semibold ${
                      product.showProductinSite
                        ? "text-green-700"
                        : "text-gray-600"
                    }`}
                  >
                    {product.showProductinSite ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* Sizes & Colors Section */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900">
                      Available Sizes & Colors
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {product.sizes.map((size, sizeIndex) => (
                      <div
                        key={sizeIndex}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          {/* Size Badge */}
                          <div className="flex-shrink-0">
                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full font-bold text-sm shadow-md">
                              {size.size}
                            </div>
                          </div>

                          {/* Colors */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-sm font-semibold text-gray-700">
                                Available Colors:
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {size.colors.length} color
                                {size.colors.length !== 1 ? "s" : ""}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              {size.colors.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2.5 border border-gray-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm flex-shrink-0"
                                      style={{
                                        backgroundColor:
                                          color.color.toLowerCase(),
                                      }}
                                      title={color.color}
                                    />
                                    <span className="text-sm font-medium text-gray-700 capitalize">
                                      {color.color}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">
                                      Qty:
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                                      {color.quantity}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Quantity Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Total Stock:
                      </span>
                      <span className="text-2xl font-bold text-blue-700">
                        {product.totalQuantity} pieces
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* No sizes message */}
              {(!product.sizes || product.sizes.length === 0) && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    No size variations available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#AB3430] to-[#8a2a27] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#8a2a27] hover:to-[#6b1f1d] transition-all shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
