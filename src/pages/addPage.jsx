import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAllSubcategoriesApi,
  getAllCategoryApi,
  addProductApi,
  getSubCategoriesByCategoryApi,
  getAllProductApi,
} from "../Apis/Api";
import {
  faPalette,
  faBox,
  faHashtag,
  faCube,
  faEdit,
  faTrashAlt,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    fakePrice: "",
    discountedPrice: "",
    wholesaleCode: "",
    category: "",
    subcategory: "",
    sizes: [],
    showProductinSite: false,
    isFlashSale: false,
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [compressedImages, setCompressedImages] = useState([]);
  const [sizeInput, setSizeInput] = useState({
    size: "",
    colors: [{ color: "", quantity: 0 }],
  });
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoryApi();
        setCategories(res.data.categories);
      } catch (error) {
        toast.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await getAllSubcategoriesApi();
        setSubcategories(response.data?.subCategories || []);
      } catch (err) {
        toast.error("Error fetching subcategories");
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await getAllProductApi();
        if (response.data.success) {
          setTotalProducts(response.data.products.length);

          const totalCost = response.data.products.reduce(
            (acc, product) =>
              acc + (product.totalQuantity || 0) * (product.price || 0),
            0
          );
          setTotalCost(totalCost);
        }
      } catch (error) {
        toast.error("Error fetching products:", error);
      }
    };
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
  }, []);

  const fetchSubCategoriesByCategory = async (categoryId) => {
    try {
      const response = await getSubCategoriesByCategoryApi(categoryId);
      setSubcategories(response.data.subCategories || []);
    } catch (error) {
      toast.error("Error fetching subcategories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      setProduct({ ...product, category: value, subcategory: "" });
      fetchSubCategoriesByCategory(value);
    } else {
      setProduct({
        ...product,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagePreviews([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);

      compressImage(file, 1000, (compressedBlob) => {
        setCompressedImages((prev) => [...prev, compressedBlob]);
      });
    });
  };

  const compressImage = (file, maxSize, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const scaleFactor = maxSize / Math.max(img.width, img.height);
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            callback(blob);
          },
          "image/jpeg",
          0.7
        );
      };
    };
  };

  const handleSizeChange = (e) => {
    setSizeInput({ ...sizeInput, [e.target.name]: e.target.value });
  };

  const handleColorChange = (index, e) => {
    const updatedColors = [...sizeInput.colors];
    const value =
      e.target.name === "quantity" ? Number(e.target.value) : e.target.value;
    updatedColors[index][e.target.name] = value;
    setSizeInput({ ...sizeInput, colors: updatedColors });
  };

  const addColor = () => {
    setSizeInput({
      ...sizeInput,
      colors: [...sizeInput.colors, { color: "", quantity: 0 }],
    });
  };

  const addSize = () => {
    setProduct({
      ...product,
      sizes: [...product.sizes, sizeInput],
    });
    setSizeInput({ size: "", colors: [{ color: "", quantity: 0 }] });
  };

  const removeSize = (index) => {
    setProduct({
      ...product,
      sizes: product.sizes.filter((_, i) => i !== index),
    });
  };

  const removeColor = (sizeIndex, colorIndex) => {
    const updatedSizes = product.sizes.map((size, index) => {
      if (index === sizeIndex) {
        return {
          ...size,
          colors: size.colors.filter((_, i) => i !== colorIndex),
        };
      }
      return size;
    });
    setProduct({ ...product, sizes: updatedSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("sku", product.sku);
    formData.append("price", product.price);
    formData.append("fakePrice", product.fakePrice);
    formData.append("discountedPrice", product.discountedPrice);
    formData.append("wholesaleCode", product.wholesaleCode);
    formData.append("category", product.category);
    formData.append("subcategory", product.subcategory);
    formData.append("sizes", JSON.stringify(product.sizes));
    formData.append("showProductinSite", product.showProductinSite);
    formData.append("isFlashSale", product.isFlashSale);

    compressedImages.forEach((image) => {
      formData.append("images", image, `compressed-${Date.now()}.jpg`);
    });

    try {
      await addProductApi(formData);
      toast.success("Product added successfully!");

      // Store product name and show modal
      setAddedProductName(product.name);
      setShowSuccessModal(true);

      // Reset form fields after success
      setProduct({
        name: "",
        sku: "",
        description: "",
        price: "",
        fakePrice: "",
        discountedPrice: "",
        wholesaleCode: "",
        category: "",
        subcategory: "",
        sizes: [],
        showProductinSite: false,
        isFlashSale: false,
      });
      setImagePreviews([]);
      setCompressedImages([]);
      setSizeInput({ size: "", colors: [{ color: "", quantity: 0 }] });
    } catch (error) {
      toast.error("Error adding product");
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="mt-5">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Product Added Successfully!
              </h3>

              {/* Product Name */}
              <p className="text-gray-600 mb-6">
                <span className="font-semibold text-gray-800">
                  "{addedProductName}"
                </span>{" "}
                has been added to your inventory.
              </p>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-indigo-700 transition duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white">
        <div className="text-gray-600 font-bold text-3xl mt-5">
          Add New Product
        </div>
        <div className="flex gap-4 mt-5">
          <div className="total-category p-2 gap-4 bg-[#309bab33] rounded-md w-fit flex justify-between items-center">
            <div>
              <h2 className="flex gap-2 items-center text-sky-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                Total Products: {totalProducts}
              </h2>
            </div>
          </div>

          <div className="total-category p-2 gap-4 bg-[#309bab33] rounded-md w-fit flex justify-between items-center">
            <div>
              <h2 className="flex gap-2 items-center text-sky-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 2v1m0 16v1m-7.5 3h15a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 19.5 3h-15A2.25 2.25 0 0 0 2.25 5.25v15.5A2.25 2.25 0 0 0 4.5 21h15a2.25 2.25 0 0 0 2.25-2.25V5.25A2.25 2.25 0 0 0 19.5 3h-15A2.25 2.25 0 0 0 2.25 5.25v15.5A2.25 2.25 0 0 0 4.5 21h15z"
                  />
                </svg>
                Total Cost of All Products: Npr. {totalCost.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="mt-5">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter product description"
              rows="4"
              required
            />
          </div>

          {/* Price and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Actual Price that costed while purchasing
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product price"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Fake Price
              </label>
              <input
                type="number"
                name="fakePrice"
                value={product.fakePrice}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter product price"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Discounted Price
              </label>
              <input
                type="number"
                name="discountedPrice"
                value={product.discountedPrice}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter discounted price"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Wholesale Code
              </label>
              <input
                type="text"
                name="wholesaleCode"
                value={product.wholesaleCode}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter wholesale code"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Subcategory */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={product.subcategory}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
              required
              disabled={!product.category}
            >
              <option value="" className="text-black">
                Select a Subcategory
              </option>
              {subcategories.length > 0 ? (
                subcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))
              ) : (
                <option value="" className="text-black">
                  No Subcategories Available
                </option>
              )}
            </select>
          </div>

          {/* Checkbox for showProductinSite */}
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Show Product on Site
              </label>
              <input
                type="checkbox"
                name="showProductinSite"
                checked={product.showProductinSite}
                onChange={handleInputChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="ml-2 text-gray-600">
                Check if you want to display this product on the site
              </span>
            </div>

            {product.showProductinSite && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Show Product as Flash Sale
                </label>
                <input
                  type="checkbox"
                  name="isFlashSale"
                  checked={product.isFlashSale}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2 text-gray-600">
                  Check if you want to display this product on flash sale
                </span>
              </div>
            )}
          </div>

          {/* Sizes and Colors Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Sizes and Colors
            </h3>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Size
              </label>
              <input
                type="text"
                name="size"
                value={sizeInput.size}
                onChange={handleSizeChange}
                className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter size (e.g., XL, L, M)"
              />
            </div>

            {sizeInput.colors.map((color, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
              >
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={color.color}
                    onChange={(e) => handleColorChange(index, e)}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter color (e.g., Red, Blue)"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={color.quantity}
                    onChange={(e) => handleColorChange(index, e)}
                    className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addColor}
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              Add Another Color
            </button>
            <button
              type="button"
              onClick={addSize}
              className="mt-4 ml-4 inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              Add Size
            </button>

            {/* Show added sizes */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">
                    Added Sizes & Colors
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your product variations below
                  </p>
                </div>
                {product.sizes.length > 0 && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                    {product.sizes.reduce(
                      (acc, size) => acc + size.colors.length,
                      0
                    )}{" "}
                    variations
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {product.sizes.map((size, sizeIndex) => (
                  <div
                    key={sizeIndex}
                    className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg font-bold text-base shadow-md">
                            {size.size}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-base font-semibold text-gray-900">
                                Size {size.size}
                              </span>
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                {size.colors.length} color
                                {size.colors.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>
                                Total:{" "}
                                {size.colors.reduce(
                                  (sum, color) => sum + color.quantity,
                                  0
                                )}{" "}
                                units
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-13 space-y-2">
                          {size.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 group hover:bg-gray-100 transition-all duration-200"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                                  style={{
                                    backgroundColor: color.color.toLowerCase(),
                                  }}
                                  title={color.color}
                                />

                                <div className="space-y-1">
                                  <span className="text-sm font-semibold text-gray-900 block">
                                    {color.color}
                                  </span>
                                  <div className="flex items-center gap-3 text-xs">
                                    <span className="text-gray-600">
                                      Quantity:{" "}
                                      <span className="font-bold text-blue-600 ml-1">
                                        {color.quantity}
                                      </span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  removeColor(sizeIndex, colorIndex)
                                }
                                className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-2"
                                aria-label={`Remove ${color.color}`}
                              >
                                <FontAwesomeIcon
                                  icon={faMinusCircle}
                                  className="w-4 h-4"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeSize(sizeIndex)}
                        className="ml-4 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg p-2 transition-all duration-200"
                        aria-label={`Remove size ${size.size}`}
                      >
                        <FontAwesomeIcon
                          icon={faMinusCircle}
                          className="w-5 h-5"
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {product.sizes.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FontAwesomeIcon
                      icon={faMinusCircle}
                      className="w-8 h-8 text-gray-500"
                    />
                  </div>
                  <h5 className="text-lg font-medium text-gray-900 mb-2">
                    No sizes added yet
                  </h5>
                  <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    Add sizes and colors to see them here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Upload Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleImageChange}
              className="text-gray-500 w-full font-medium text-base bg-gray-100 file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:mr-4 file:bg-gray-800 file:hover:bg-gray-700 file:text-white rounded"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {imagePreviews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Preview ${index}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-3">
            <button
              type="submit"
              className="bg-indigo-600 text-white font-semibold w-fit px-5 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Submit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
