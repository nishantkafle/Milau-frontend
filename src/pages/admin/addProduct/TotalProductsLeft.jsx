import React, { useState, useEffect } from "react";
import {
  getAllProductApi,
  getAllCategoryApi,
  getAllSubcategoriesApi,
} from "../../../Apis/Api";

const TotalProductsLeft = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const productResponse = await getAllProductApi();
        const categoryResponse = await getAllCategoryApi();
        const subCategoryResponse = await getAllSubcategoriesApi();

        if (productResponse.status === 200) {
          setProducts(productResponse.data.products || []);
        } else {
          setError("Failed to fetch products");
        }

        if (categoryResponse.status === 200) {
          setCategories(categoryResponse.data.categories || []);
        } else {
          setError("Failed to fetch categories");
        }

        if (subCategoryResponse.status === 200) {
          setSubCategories(subCategoryResponse.data.subCategories || []);
        } else {
          setError("Failed to fetch subcategories");
        }
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#AB3430]"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading inventory data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "Unknown Category";
    if (typeof categoryId === "object" && categoryId !== null) {
      return categoryId.name || "Unknown Category";
    }
    const category = categories.find(
      (cat) => cat._id.toString() === categoryId.toString()
    );
    return category ? category.name : "Unknown Category";
  };

  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return "Unknown Subcategory";
    if (typeof subcategoryId === "object" && subcategoryId !== null) {
      return subcategoryId.name || "Unknown Subcategory";
    }
    const subcategory = subCategories.find(
      (sub) => sub._id.toString() === subcategoryId.toString()
    );
    return subcategory ? subcategory.name : "Unknown Subcategory";
  };

  // Group products by category and subcategory with full product details
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = getCategoryName(product.category);
    const subCategoryName = getSubcategoryName(product.subcategory);

    if (!acc[categoryName]) {
      acc[categoryName] = { count: 0, subCategories: {} };
    }

    if (!acc[categoryName].subCategories[subCategoryName]) {
      acc[categoryName].subCategories[subCategoryName] = {
        count: 0,
        products: [],
      };
    }

    const quantity = Number(product.totalQuantity) || 0;
    acc[categoryName].count += quantity;
    acc[categoryName].subCategories[subCategoryName].count += quantity;
    acc[categoryName].subCategories[subCategoryName].products.push(product);

    return acc;
  }, {});

  const grandTotal = Object.values(groupedProducts).reduce(
    (total, category) => total + category.count,
    0
  );

  let serialNumber = 1;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Total Products Left
              </h1>
              <p className="text-sm text-gray-600">
                Complete inventory breakdown by category and subcategory
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#AB3430] to-[#8a2a27] text-white rounded-xl px-6 py-4 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                Grand Total
              </p>
              <p className="text-3xl font-bold mt-1">
                {grandTotal.toLocaleString()}
              </p>
              <p className="text-xs opacity-75 mt-1">items in stock</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Categories
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Object.keys(groupedProducts).length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Subcategories
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {Object.values(groupedProducts).reduce(
                    (sum, cat) => sum + Object.keys(cat.subCategories).length,
                    0
                  )}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Unique Products
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {products.length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                    SN
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Subcategories & Product Details
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-48">
                    Total Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Object.keys(groupedProducts)
                  .sort(
                    (a, b) =>
                      groupedProducts[b].count - groupedProducts[a].count
                  )
                  .map((category) => (
                    <tr
                      key={category}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                          {serialNumber++}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#AB3430] to-[#8a2a27] flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {category.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-base font-semibold text-gray-900 block">
                              {category}
                            </span>
                            <button
                              onClick={() => toggleCategory(category)}
                              className="text-xs text-[#AB3430] hover:text-[#8a2a27] font-medium mt-1 flex items-center gap-1"
                            >
                              {expandedCategories[category] ? "Hide" : "Show"}{" "}
                              Details
                              <svg
                                className={`w-3 h-3 transition-transform ${
                                  expandedCategories[category]
                                    ? "rotate-180"
                                    : ""
                                }`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-3">
                          {Object.entries(
                            groupedProducts[category].subCategories
                          )
                            .sort(([, a], [, b]) => b.count - a.count)
                            .map(([subCategory, subCatData]) => (
                              <div key={subCategory} className="space-y-2">
                                {/* Subcategory Header */}
                                <div className="flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg px-4 py-2.5 border border-gray-200">
                                  <span className="text-sm font-semibold text-gray-800">
                                    {subCategory}
                                  </span>
                                  <span className="text-xs font-bold text-[#AB3430] bg-white px-2 py-1 rounded border border-gray-200">
                                    {subCatData.count} items
                                  </span>
                                </div>

                                {/* Product Details - Show when expanded */}
                                {expandedCategories[category] && (
                                  <div className="ml-4 space-y-2">
                                    {subCatData.products.map((product) => (
                                      <div
                                        key={product._id}
                                        className="bg-white border border-gray-200 rounded-lg p-3 hover:border-[#AB3430] hover:shadow-sm transition-all"
                                      >
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex-1">
                                            <h4 className="text-sm font-semibold text-gray-900">
                                              {product.name}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                              SKU: {product.sku}
                                            </p>
                                          </div>
                                          <span className="text-sm font-bold text-[#AB3430] ml-2">
                                            {product.totalQuantity} pcs
                                          </span>
                                        </div>

                                        {/* Size and Color Details */}
                                        {product.sizes &&
                                          product.sizes.length > 0 && (
                                            <div className="space-y-1.5 mt-2 pt-2 border-t border-gray-100">
                                              {product.sizes.map(
                                                (size, sizeIdx) => (
                                                  <div
                                                    key={sizeIdx}
                                                    className="text-xs"
                                                  >
                                                    <span className="font-semibold text-gray-700 bg-blue-50 px-2 py-0.5 rounded">
                                                      Size {size.size}:
                                                    </span>
                                                    <div className="ml-2 mt-1 space-y-0.5">
                                                      {size.colors.map(
                                                        (color, colorIdx) => (
                                                          <div
                                                            key={colorIdx}
                                                            className="flex items-center gap-2 text-gray-600"
                                                          >
                                                            <div
                                                              className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                                                              style={{
                                                                backgroundColor:
                                                                  color.color.toLowerCase(),
                                                              }}
                                                              title={
                                                                color.color
                                                              }
                                                            />
                                                            <span className="capitalize">
                                                              {color.color}
                                                            </span>
                                                            <span className="text-gray-400">
                                                              •
                                                            </span>
                                                            <span className="font-semibold text-gray-700">
                                                              {color.quantity}{" "}
                                                              pcs
                                                            </span>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-2xl font-bold text-[#AB3430]">
                            {groupedProducts[category].count.toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300">
                  <td colSpan="3" className="px-6 py-5 text-right">
                    <span className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                      Grand Total
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-3xl font-bold text-[#AB3430]">
                        {grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {Object.keys(groupedProducts).length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600">
              Start adding products to see your inventory overview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TotalProductsLeft;
