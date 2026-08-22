import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import {
  getAllCategoryApi,
  getAllProductApi,
  getProductByCategoryApi,
  getAllSubcategoriesApi,
  getImageUrl, // Import the helper function
} from "../../Apis/Api";
import Card from "../component/Card";
import whatsapp from "../../assets/icons/whatsapp.png";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isCategoryVisible, setIsCategoryVisible] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [isPriceRangeVisible, setIsPriceRangeVisible] = useState(false);
  const [isSubcategoryVisible, setIsSubcategoryVisible] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [validSubCategories, setValidSubCategories] = useState([]);

  const handlePriceChange = (e, type) => {
    const newValue = parseInt(e.target.value);
    setPriceRange((prevRange) => ({
      ...prevRange,
      [type]: newValue,
    }));
  };

  const fetchData = async () => {
    try {
      const categoryResponse = await getAllCategoryApi();
      const productResponse = await getAllProductApi();

      const filteredProducts = productResponse.data.products.filter(
        (product) => product.showProductinSite
      );

      setCategories(categoryResponse.data.categories || []);
      setProducts(filteredProducts || []);
      setFilteredProducts(filteredProducts || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await getAllSubcategoriesApi();
        if (Array.isArray(response.data)) {
          setSubcategories([...response.data]);
        } else if (
          response.data &&
          Array.isArray(response.data.subCategories)
        ) {
          setSubcategories([...response.data.subCategories]);
        } else if (response.data && Array.isArray(response.data.data)) {
          setSubcategories([...response.data.data]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, []);

  // Update valid subcategories based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0 && subcategories.length > 0) {
      const results = subcategories.filter((subcat) => {
        // Handle both string IDs and object references
        const subcatCategoryId =
          typeof subcat.category === "object"
            ? subcat.category._id
            : subcat.category;
        return selectedCategories.includes(subcatCategoryId);
      });
      setValidSubCategories(results);

      // Clear selected subcategories that are no longer valid
      setSelectedSubcategories((prev) =>
        prev.filter((subId) => results.some((subcat) => subcat._id === subId))
      );
    } else {
      setValidSubCategories([]);
      setSelectedSubcategories([]);
    }
  }, [selectedCategories, subcategories]);

  // Apply all filters
  useEffect(() => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.discountedPrice >= priceRange.min &&
        product.discountedPrice <= priceRange.max
    );

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => {
        // Handle both string IDs and object references
        const productCategoryId =
          typeof product.category === "object"
            ? product.category._id
            : product.category;
        return selectedCategories.includes(productCategoryId);
      });
    }

    // Filter by subcategories
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) => {
        // Handle both string IDs and object references
        const productSubcategoryId =
          typeof product.subcategory === "object"
            ? product.subcategory._id
            : product.subcategory;
        return selectedSubcategories.includes(productSubcategoryId);
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setFilteredProducts(filtered);
  }, [
    priceRange,
    selectedCategories,
    selectedSubcategories,
    products,
    searchTerm,
  ]);

  const handleSearch = () => {
    // The search is now handled by the useEffect above
    // This function can trigger a re-render if needed
    setSearchTerm(searchTerm.trim());
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategories((prevSelected) =>
      prevSelected.includes(subcategoryId)
        ? prevSelected.filter((id) => id !== subcategoryId)
        : [...prevSelected, subcategoryId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setPriceRange({ min: 0, max: 20000 });
    setSearchTerm("");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50">
        <ReactLoading type="spokes" color="#D97706" height={100} width={100} />
      </div>
    );

  if (error) return <p className="text-center text-amber-900 p-8">{error}</p>;

  const activeFiltersCount =
    selectedCategories.length +
    selectedSubcategories.length +
    (priceRange.min !== 0 || priceRange.max !== 20000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 -m-5 p-4">
      <div className="container mx-auto lg:flex gap-4">
        {/* Filter Section */}
        <div
          className={`bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-amber-200/60 shadow-lg mb-5 relative transform transition-all duration-300 ${
            isFilterOpen ? "translate-x-0 lg:w-1/5" : "-translate-x-full lg:w-0"
          }`}
        >
          {/* Toggle Button */}
          <div
            className={`absolute top-1 flex gap-2 ${
              !isFilterOpen ? "right-[-48px]" : "lg:right-[-48px] right-[-10px]"
            }`}
          >
            {isFilterOpen ? (
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-r-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <div className="relative group">
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="p-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-r-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <span className="absolute top-[-10px] transform -translate-y-1/2 ml-2 px-3 py-1.5 text-sm text-white bg-amber-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                  Open Filters
                </span>
              </div>
            )}
          </div>

          <div className={isFilterOpen ? "block p-5" : "hidden"}>
            {/* Header with Clear Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-amber-700"
                >
                  <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                </svg>
                <h3 className="text-2xl font-bold text-amber-950">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-amber-700 hover:text-amber-900 font-semibold underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="border-2 border-amber-200/60 rounded-xl mb-4 overflow-hidden bg-white shadow-sm">
              <h3
                className="text-base font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white p-3 flex justify-between items-center cursor-pointer hover:from-amber-700 hover:to-amber-800 transition-all"
                onClick={() => setIsCategoryVisible(!isCategoryVisible)}
              >
                <div className="flex items-center gap-2">
                  <span>Category</span>
                  {selectedCategories.length > 0 && (
                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">
                      {selectedCategories.length}
                    </span>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isCategoryVisible ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </h3>

              {isCategoryVisible && (
                <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <label
                      key={category._id}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-amber-50 p-2 rounded-lg transition-colors group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryChange(category._id)}
                        className="w-5 h-5 text-amber-600 border-2 border-amber-300 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-amber-900 font-medium group-hover:text-amber-950">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Subcategory Filter */}
            {selectedCategories.length > 0 && (
              <div className="border-2 border-amber-200/60 rounded-xl mb-4 overflow-hidden bg-white shadow-sm animate-fadeIn">
                <h3
                  className="text-base font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white p-3 flex justify-between items-center cursor-pointer hover:from-amber-700 hover:to-amber-800 transition-all"
                  onClick={() => setIsSubcategoryVisible(!isSubcategoryVisible)}
                >
                  <div className="flex items-center gap-2">
                    <span>Subcategory</span>
                    {selectedSubcategories.length > 0 && (
                      <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">
                        {selectedSubcategories.length}
                      </span>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isSubcategoryVisible ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </h3>

                {isSubcategoryVisible && (
                  <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
                    {validSubCategories.length > 0 ? (
                      validSubCategories.map((subcategory) => (
                        <label
                          key={subcategory._id}
                          className="flex items-center space-x-3 cursor-pointer hover:bg-amber-50 p-2 rounded-lg transition-colors group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubcategories.includes(
                              subcategory._id
                            )}
                            onChange={() =>
                              handleSubcategoryChange(subcategory._id)
                            }
                            className="w-5 h-5 text-amber-600 border-2 border-amber-300 rounded focus:ring-2 focus:ring-amber-500 cursor-pointer"
                          />
                          <span className="text-amber-900 font-medium group-hover:text-amber-950">
                            {subcategory.name}
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-amber-600 text-center py-2">
                        No subcategories available
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Price Filter */}
            <div className="border-2 border-amber-200/60 rounded-xl overflow-hidden bg-white shadow-sm">
              <h3
                className="text-base font-semibold bg-gradient-to-r from-amber-600 to-amber-700 text-white p-3 flex justify-between items-center cursor-pointer hover:from-amber-700 hover:to-amber-800 transition-all"
                onClick={() => setIsPriceRangeVisible(!isPriceRangeVisible)}
              >
                <div className="flex items-center gap-2">
                  <span>Price Range</span>
                  {(priceRange.min !== 0 || priceRange.max !== 20000) && (
                    <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">
                      1
                    </span>
                  )}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isPriceRangeVisible ? "rotate-180" : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </h3>

              {isPriceRangeVisible && (
                <div className="p-4 space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-amber-950">
                        Minimum
                      </label>
                      <span className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
                        Rs {priceRange.min}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="100"
                      value={priceRange.min}
                      onChange={(e) => handlePriceChange(e, "min")}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-semibold text-amber-950">
                        Maximum
                      </label>
                      <span className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">
                        Rs {priceRange.max}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="100"
                      value={priceRange.max}
                      onChange={(e) => handlePriceChange(e, "max")}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 p-3 rounded-lg shadow-md">
                    <span>Rs {priceRange.min}</span>
                    <span>—</span>
                    <span>Rs {priceRange.max}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div
          className={`transition-all duration-300 ${
            isFilterOpen ? "lg:w-4/5" : "w-full"
          }`}
        >
          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-amber-200/60 shadow-lg p-4 mb-5">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full p-3 pl-11 border-2 border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white text-amber-950 placeholder-amber-400 transition-all"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-amber-600 absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <button
                onClick={handleSearch}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                Search
              </button>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-amber-200">
                <span className="text-sm font-semibold text-amber-900">
                  Active Filters:
                </span>
                {selectedCategories.length > 0 && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-sm rounded-full font-medium">
                    {selectedCategories.length}{" "}
                    {selectedCategories.length === 1
                      ? "Category"
                      : "Categories"}
                  </span>
                )}
                {selectedSubcategories.length > 0 && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-sm rounded-full font-medium">
                    {selectedSubcategories.length}{" "}
                    {selectedSubcategories.length === 1
                      ? "Subcategory"
                      : "Subcategories"}
                  </span>
                )}
                {(priceRange.min !== 0 || priceRange.max !== 20000) && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-sm rounded-full font-medium">
                    Rs {priceRange.min} - Rs {priceRange.max}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 flex justify-between items-center">
            <p className="text-amber-900 font-semibold">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          {filterLoading ? (
            <div className="flex justify-center items-center h-64 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-amber-200/60 shadow-lg">
              <ReactLoading
                type="cylon"
                color="#D97706"
                height={100}
                width={100}
              />
            </div>
          ) : (
            <div
              className={`grid gap-4 pb-10 ${
                isFilterOpen
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
              }`}
            >
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Card key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-16 bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-amber-200/60 shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-20 h-20 mx-auto text-amber-400 mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                  <p className="text-amber-900 text-xl font-bold mb-2">
                    No products found
                  </p>
                  <p className="text-amber-700 text-sm mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp Float */}
      <div className="fixed bottom-6 right-6 z-50">
        <a
          aria-label="Chat on WhatsApp"
          href="https://wa.me/9848556062"
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-70 group-hover:opacity-90"></div>
            <img
              src={whatsapp}
              alt="WhatsApp"
              className="relative h-16 w-16 drop-shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
            />
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Category;
