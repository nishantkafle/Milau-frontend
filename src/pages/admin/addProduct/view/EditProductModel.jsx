import React, { useState, useEffect } from "react";
import { baseURL } from "../../../../Apis/Api";
import { FaPlusCircle, FaTrashAlt, FaImage } from "react-icons/fa"; // Import icons

const EditProductModal = ({
  product,
  isEditing,
  isOpen,
  onClose,
  categories,
  subCategories,
  onSave,

}) => {
  const [formData, setFormData] = useState({
    name: "",
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
    images: [],
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      // Normalize category & subcategory to always be IDs (string)
      const normalizedCategory =
        product.category && typeof product.category === 'object'
          ? product.category._id
          : product.category || '';
      const normalizedSubcategory =
        product.subcategory && typeof product.subcategory === 'object'
          ? product.subcategory._id
          : product.subcategory || '';

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        fakePrice: product.fakePrice || "",
        discountedPrice: product.discountedPrice || "",
        wholesaleCode: product.wholesaleCode || "",
        category: normalizedCategory,
        subcategory: normalizedSubcategory,
        sizes: product.sizes || [{ size: "", colors: [{ color: "", quantity: 0 }] }],
        showProductinSite: product.showProductinSite || false,
        isFlashSale: product.isFlashSale || false,
        images: product.images || [],
      });
    }
  }, [product, isOpen]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeColorChange = (sizeIndex, colorIndex, value, field) => {
    const updatedSizes = [...formData.sizes];

    if (field === "size" && updatedSizes[sizeIndex]) {
      updatedSizes[sizeIndex].size = value;
    } else if (
      field !== "size" &&
      updatedSizes[sizeIndex]?.colors[colorIndex]
    ) {
      updatedSizes[sizeIndex].colors[colorIndex][field] = value;
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      sizes: updatedSizes,
    }));
  };




  const handleAddSize = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      sizes: [
        ...prevFormData.sizes,
        { size: "", colors: [{ color: "", quantity: 0 }] },
      ],
    }));
  };

  const handleAddColorToSize = (sizeIndex) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[sizeIndex].colors.push({ color: "", quantity: 0 });
    setFormData((prevFormData) => ({
      ...prevFormData,
      sizes: updatedSizes,
    }));
  };


  const handleRemoveColorFromSize = (sizeIndex, colorIndex) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[sizeIndex].colors = updatedSizes[sizeIndex].colors.filter(
      (_, idx) => idx !== colorIndex
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      sizes: updatedSizes,
    }));
  };

  const handleRemoveSize = (sizeIndex) => {
    const updatedSizes = formData.sizes.filter((_, idx) => idx !== sizeIndex);
    setFormData((prevFormData) => ({
      ...prevFormData,
      sizes: updatedSizes,
    }));
  };


  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log('files: ', files);

    const imgs =[]

    files.forEach((file) => {

      imgs.push(file)

    });
    console.log('imgs: ', imgs);

    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, ...imgs],
    }));
  };

  
  const handleSave = async () => {
    try {
      setIsLoading(true);

      const newImageFiles = formData.images.filter(
        (el) => typeof el !== 'string'
      );
      const existingImageURLs = formData.images.filter(
        (el) => typeof el === 'string'
      );

      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('description', formData.description);
      fd.append('sku', formData.sku);
      fd.append('price', formData.price);
      fd.append('fakePrice', formData.fakePrice);
      fd.append('discountedPrice', formData.discountedPrice);
      fd.append('wholesaleCode', formData.wholesaleCode);
      fd.append('category', formData.category);
      fd.append('subcategory', formData.subcategory);
      fd.append('sizes', JSON.stringify(formData.sizes));
      fd.append('showProductinSite', String(formData.showProductinSite));
      fd.append('isFlashSale', String(formData.isFlashSale));
      fd.append('images', JSON.stringify(existingImageURLs));

      newImageFiles.forEach((image) => {
        fd.append('images', image);
      });

      await onSave(fd);
      onClose();
    } catch (err) {
      console.error('Error in handleSave (EditProductModal):', err);
    } finally {
      setIsLoading(false);
    }
  };




    const handleDeleteImage = (indexToDelete) => {
      console.log('indexToDelete: ', indexToDelete);
      setFormData((prevFormData) => {
        const updatedImages = prevFormData.images.filter((_, index) => index !== indexToDelete);
        console.log('updatedImages: ', updatedImages);
        return {
          ...prevFormData,
          images: updatedImages,
        };
      });
    

    };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:items-center pt-4 justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full md:w-3/4 lg:w-2/3 xl:w-3/5 p-6 md:p-8 overflow-y-auto max-h-[92vh] border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'View Product'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update details, pricing, variants and images for this product.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300 shadow-sm"
          >
            <span className="sr-only">Close</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main form grid */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left column: basic info + pricing */}
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Basic Information
              </span>
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
              disabled={!isEditing}
              placeholder="Enter product name"
            />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent min-h-[80px]"
              disabled={!isEditing}
              placeholder="Enter product description"
            />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Price
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                  disabled={!isEditing}
                  placeholder="Enter actual price"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Fake Price
                </span>
                <input
                  type="number"
                  name="fakePrice"
                  value={formData.fakePrice}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                  disabled={!isEditing}
                  placeholder="Enter fake price"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Discounted Price
                </span>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                  disabled={!isEditing}
                  placeholder="Enter discounted price"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Wholesale Code
                </span>
                <input
                  type="text"
                  name="wholesaleCode"
                  value={formData.wholesaleCode}
                  onChange={handleInputChange}
                  className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                  disabled={!isEditing}
                  placeholder="Enter wholesale code"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                  disabled={!isEditing}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </span>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                  disabled={!isEditing}
                >
                  <option value="">Select Subcategory</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isFlashSale"
                  checked={formData.isFlashSale}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#AB3430] focus:ring-[#AB3430]"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">Flash Sale</span>
                  <span className="block text-xs text-gray-500">
                    Highlight this product in flash sale sections.
                  </span>
                </span>
              </label>

              <label className="inline-flex items-center gap-3">
                <input
                  type="checkbox"
                  name="showProductinSite"
                  checked={formData.showProductinSite}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="h-4 w-4 rounded border-gray-300 text-[#AB3430] focus:ring-[#AB3430]"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-semibold">Show on Website</span>
                  <span className="block text-xs text-gray-500">
                    Control whether this product is visible to customers.
                  </span>
                </span>
              </label>
            </div>
          </div>

          {/* Right column: sizes/colors + images */}
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Sizes &amp; Colors
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#AB3430] hover:text-[#c94542]"
                  >
                    <FaPlusCircle />
                    Add Size
                  </button>
                )}
              </div>

              {formData.sizes.map((size, sizeIndex) => (
                <div
                  key={sizeIndex}
                  className="mb-3 rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Size
                      </label>
                      <input
                        type="text"
                        value={size.size}
                        onChange={(e) =>
                          handleSizeColorChange(
                            sizeIndex,
                            null,
                            e.target.value,
                            'size'
                          )
                        }
                        className="block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                        disabled={!isEditing}
                      />
                    </div>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(sizeIndex)}
                        className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600"
                      >
                        <FaTrashAlt />
                        Remove
                      </button>
                    )}
                  </div>

                  {size.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="mt-3 flex flex-col sm:flex-row gap-3 items-start"
                    >
                      <div className="w-full sm:w-1/2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          value={color.color}
                          onChange={(e) =>
                            handleSizeColorChange(
                              sizeIndex,
                              colorIndex,
                              e.target.value,
                              'color'
                            )
                          }
                          className="block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                          disabled={!isEditing}
                          placeholder="e.g. Red"
                        />
                      </div>
                      <div className="w-full sm:w-1/2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={color.quantity}
                          onChange={(e) =>
                            handleSizeColorChange(
                              sizeIndex,
                              colorIndex,
                              e.target.value,
                              'quantity'
                            )
                          }
                          className="block w-full rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
                          disabled={!isEditing}
                          placeholder="0"
                        />
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveColorFromSize(sizeIndex, colorIndex)
                            }
                            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600"
                          >
                            <FaTrashAlt />
                            Remove Color
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleAddColorToSize(sizeIndex)}
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <FaPlusCircle />
                      Add Color
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Image Upload */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Images
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.images.map((image, index) => {
                  const isOldImage = typeof image === 'string';
                  return (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={
                          isOldImage
                            ? `${baseURL}/${image}`
                            : URL.createObjectURL(image)
                        }
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-28 object-cover"
                      />
                      <span
                        className={`absolute top-2 left-2 px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                          isOldImage
                            ? 'bg-gray-900/80 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {isOldImage ? 'Existing' : 'New'}
                      </span>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          aria-label={`Delete image ${index + 1}`}
                          className="absolute top-1.5 right-1.5 h-6 w-6 flex items-center justify-center rounded-full bg-red-600 text-white text-xs shadow-sm"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              {isEditing && (
                <div className="space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="mt-2 block w-full text-sm text-gray-600 bg-gray-50 border border-dashed border-gray-300 rounded-lg file:cursor-pointer file:border-0 file:py-2 file:px-4 file:mr-4 file:bg-gray-900 file:hover:bg-gray-800 file:text-white"
                  />
                  <p className="text-xs text-gray-500">
                    Upload one or more images. Existing images will be kept
                    unless removed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer buttons */}
        <div className="flex justify-end mt-6 gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={isLoading}
          >
            Close
          </button>
          {isEditing && (
            <button
              onClick={handleSave}
              className={`px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:ring-offset-1 ${
                isLoading ? 'opacity-60 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
