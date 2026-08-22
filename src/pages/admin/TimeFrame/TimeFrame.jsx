import React, { useEffect, useState } from "react";
import {
  getAllProductApi,
  getAllCategoryApi,
  getAllSubcategoriesApi,
} from "../../../Apis/Api";

const TimeFrame = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [subCategories, setSubCategories] = useState({});
  const [categorizedProducts, setCategorizedProducts] = useState({
    red: [],
    yellow: [],
    safe: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, categoryResponse, subCategoryResponse] =
          await Promise.all([
            getAllProductApi(),
            getAllCategoryApi(),
            getAllSubcategoriesApi(),
          ]);

        const categoryMap = categoryResponse.data.categories.reduce(
          (map, category) => {
            map[category._id] = category.name;
            return map;
          },
          {}
        );

        const subCategoryMap = subCategoryResponse.data.subCategories.reduce(
          (map, subCategory) => {
            map[subCategory._id] = subCategory.name;
            return map;
          },
          {}
        );

        setCategories(categoryMap);
        setSubCategories(subCategoryMap);
        setProducts(productResponse.data.products);
        categorizeProducts(productResponse.data.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMonthsInInventory = (product) => {
    const now = new Date();
    // FIXED: Always use createdAt as the reference date
    // This ensures the timer doesn't reset when product is edited
    const referenceDate = new Date(product.createdAt);

    const monthsDiff =
      (now.getFullYear() - referenceDate.getFullYear()) * 12 +
      (now.getMonth() - referenceDate.getMonth());

    return monthsDiff;
  };

  const categorizeProducts = (products) => {
    const red = [],
      yellow = [],
      safe = [];

    products.forEach((product) => {
      const monthsInInventory = calculateMonthsInInventory(product);

      if (monthsInInventory >= 6) {
        red.push(product);
      } else if (monthsInInventory >= 3) {
        yellow.push(product);
      } else {
        safe.push(product);
      }
    });

    setCategorizedProducts({ red, yellow, safe });
  };

  const getTimeStatusMessage = (product, zone) => {
    const monthsInInventory = calculateMonthsInInventory(product);

    switch (zone) {
      case "safe":
        const monthsLeftToYellow = 3 - monthsInInventory;
        return monthsLeftToYellow > 0
          ? `Safe for ${monthsLeftToYellow} more month(s)`
          : "Moving to Yellow Zone";

      case "yellow":
        const monthsLeftToRed = 6 - monthsInInventory;
        return monthsLeftToRed > 0
          ? `${monthsLeftToRed} month(s) until Red Zone`
          : "Moving to Red Zone";

      case "red":
        const monthsInRed = monthsInInventory - 6;
        return `In Red Zone for ${monthsInRed} month(s) - Action needed!`;

      default:
        return "";
    }
  };

  const sortProductsByTime = (products, zone) => {
    return [...products].sort((a, b) => {
      const aMonths = calculateMonthsInInventory(a);
      const bMonths = calculateMonthsInInventory(b);

      // For all zones, show oldest first (most urgent at top)
      return bMonths - aMonths;
    });
  };

  const getZoneStats = () => {
    return {
      red: {
        count: categorizedProducts.red.length,
        totalValue: categorizedProducts.red.reduce(
          (sum, p) => sum + (p.totalQuantity || 0) * (p.price || 0),
          0
        ),
      },
      yellow: {
        count: categorizedProducts.yellow.length,
        totalValue: categorizedProducts.yellow.reduce(
          (sum, p) => sum + (p.totalQuantity || 0) * (p.price || 0),
          0
        ),
      },
      safe: {
        count: categorizedProducts.safe.length,
        totalValue: categorizedProducts.safe.reduce(
          (sum, p) => sum + (p.totalQuantity || 0) * (p.price || 0),
          0
        ),
      },
    };
  };

  const SkeletonLoader = () => (
    <div className="p-4 bg-white rounded-lg shadow-md mb-3 animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="grid grid-cols-2 gap-2">
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  );

  const stats = getZoneStats();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Product Inventory Status
        </h2>
        <p className="text-gray-600">
          Track inventory aging: Green (0-2 months) → Yellow (3-5 months) → Red
          (6+ months)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Safe Zone
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.safe.count}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Value: NPR {stats.safe.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Yellow Zone
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.yellow.count}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Value: NPR {stats.yellow.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Red Zone</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.red.count}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Value: NPR {stats.red.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg
                className="w-8 h-8 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {["safe", "yellow", "red"].map((zone) => (
          <div
            key={zone}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Zone Header */}
            <div
              className={`py-4 px-6 text-white font-bold text-lg
              ${
                zone === "red"
                  ? "bg-gradient-to-r from-red-600 to-red-700"
                  : zone === "yellow"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                  : "bg-gradient-to-r from-green-600 to-green-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{zone.toUpperCase()} ZONE</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {categorizedProducts[zone].length}
                </span>
              </div>
            </div>

            {/* Zone Content */}
            <div
              className={`p-4 min-h-[400px] max-h-[600px] overflow-y-auto
              ${
                zone === "red"
                  ? "bg-red-50"
                  : zone === "yellow"
                  ? "bg-yellow-50"
                  : "bg-green-50"
              }`}
            >
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, index) => <SkeletonLoader key={index} />)
              ) : categorizedProducts[zone].length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <svg
                    className="w-16 h-16 mx-auto mb-3 text-gray-400"
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
                  <p className="font-medium">No products in this zone</p>
                  <p className="text-sm mt-1">All clear!</p>
                </div>
              ) : (
                sortProductsByTime(categorizedProducts[zone], zone).map(
                  (product) => {
                    const monthsInInventory =
                      calculateMonthsInInventory(product);
                    return (
                      <div
                        key={product._id}
                        className="p-4 bg-white rounded-lg shadow-md mb-3 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-800 flex-1">
                            {product.name}
                          </h4>
                          <span className="text-xs font-semibold bg-gray-200 px-2 py-1 rounded">
                            {monthsInInventory}M
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-3">
                          <div>
                            <p className="font-medium text-gray-600">
                              Quantity
                            </p>
                            <p className="font-semibold text-lg">
                              {product.totalQuantity}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Value</p>
                            <p className="font-semibold text-lg">
                              NPR{" "}
                              {(
                                (product.totalQuantity || 0) *
                                (product.price || 0)
                              ).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">
                              Category
                            </p>
                            <p className="text-sm">
                              {categories[product.category] || "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-600">Added</p>
                            <p className="text-sm">
                              {new Date(product.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {product.sizes && product.sizes.length > 0 && (
                          <div className="mb-3 pb-3 border-b border-gray-200">
                            <p className="text-xs font-semibold text-gray-600 mb-2">
                              Size Breakdown:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {product.sizes.map((size) => (
                                <span
                                  key={size._id}
                                  className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full font-medium"
                                >
                                  {size.size}: {size.totalSizeQuantity}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div
                          className={`text-sm font-bold px-3 py-2 rounded-md text-center
                          ${
                            zone === "red"
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : zone === "yellow"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          {getTimeStatusMessage(product, zone)}
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeFrame;
