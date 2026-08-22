import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getAllGalleryApi, createGalleryApi } from "../../../Apis/Api";
import {
  FaImage,
  FaPlus,
  FaExclamationCircle,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

const AddGallery = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form validation errors
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    image: "",
  });

  // Fetch galleries when the component mounts
  useEffect(() => {
    const fetchGalleries = async () => {
      setLoading(true);
      try {
        const response = await getAllGalleryApi();
        if (response.data.success) {
          setGalleries(response.data.gallery || []);
        } else {
          toast.error("Failed to fetch galleries");
        }
      } catch (error) {
        toast.error("Error loading galleries. Please refresh the page.");
        console.error("Fetch galleries error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      image: "",
    };

    let isValid = true;

    // Title validation
    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    } else if (title.trim().length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
      isValid = false;
    }

    // Description validation
    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
      isValid = false;
    } else if (description.trim().length > 500) {
      newErrors.description = "Description must not exceed 500 characters";
      isValid = false;
    }

    // Image validation
    if (!image) {
      newErrors.image = "Please select an image";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    // Clear previous errors
    setErrors((prev) => ({ ...prev, image: "" }));

    if (!selectedFile) {
      setImage(null);
      setImagePreview(null);
      return;
    }

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
      }));
      setImage(null);
      setImagePreview(null);
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (selectedFile.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size must be less than 5MB",
      }));
      setImage(null);
      setImagePreview(null);
      return;
    }

    setImage(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({ title: "", description: "", image: "" });

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("image", image);

    try {
      const response = await createGalleryApi(formData);

      if (response.data.success) {
        toast.success("Gallery created successfully!");

        // Reset form
        setTitle("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        setErrors({ title: "", description: "", image: "" });

        // Reset file input
        const fileInput = document.getElementById("imageInput");
        if (fileInput) fileInput.value = "";

        // Fetch galleries again to update the list
        const galleriesResponse = await getAllGalleryApi();
        if (galleriesResponse.data.success) {
          setGalleries(galleriesResponse.data.gallery || []);
        }
      } else {
        toast.error(response.data.message || "Failed to create gallery");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error creating gallery. Please try again.";
      toast.error(errorMessage);
      console.error("Create gallery error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTitleChange = (value) => {
    setTitle(value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleDescriptionChange = (value) => {
    setDescription(value);
    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: "" }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setErrors((prev) => ({ ...prev, image: "" }));
    const fileInput = document.getElementById("imageInput");
    if (fileInput) fileInput.value = "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#AB3430] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading galleries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#AB3430] to-[#c94542] p-3 rounded-xl shadow-md">
                <FaImage className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gallery Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Create and manage your image gallery
                </p>
              </div>
            </div>

            {/* Gallery Counter */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <FaImage className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-700">
                    Total Gallery
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {galleries.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Gallery Form */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
            <h3 className="text-gray-800 text-lg font-bold mb-6 flex items-center gap-2">
              <FaPlus className="w-5 h-5 text-[#AB3430]" />
              Create New Gallery Item
            </h3>

            <div className="space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Gallery Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  className={`w-full bg-white border-2 ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    errors.title
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all placeholder:text-gray-400`}
                />
                {errors.title && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.title}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Enter a detailed description..."
                  rows="4"
                  className={`w-full bg-white border-2 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    errors.description
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all placeholder:text-gray-400 resize-none`}
                />
                {errors.description && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.description}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Upload Image <span className="text-red-500">*</span>
                </label>

                {!imagePreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="imageInput"
                      onChange={handleImageChange}
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      className="hidden"
                    />
                    <label
                      htmlFor="imageInput"
                      className={`flex flex-col items-center justify-center w-full h-48 border-3 ${
                        errors.image
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300 bg-gray-50"
                      } border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-all`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaImage
                          className={`w-12 h-12 mb-3 ${
                            errors.image ? "text-red-400" : "text-gray-400"
                          }`}
                        />
                        <p className="mb-2 text-sm font-semibold text-gray-700">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF or WebP (Max 5MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 bg-gray-50">
                    <div className="flex items-center justify-center bg-gray-100 min-h-64">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-96 object-contain"
                      />
                    </div>
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all"
                      title="Remove image"
                    >
                      <FaTimesCircle className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-sm font-medium flex items-center gap-2">
                        <FaCheckCircle className="w-4 h-4 text-green-400" />
                        Image selected: {image?.name}
                      </p>
                      <p className="text-gray-300 text-xs mt-1">
                        Size: {(image?.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                )}

                {errors.image && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.image}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`w-full ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#AB3430] to-[#8b2a27] hover:from-[#c94542] hover:to-[#AB3430] transform hover:-translate-y-0.5"
                  } text-white font-bold py-3.5 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl`}
                >
                  <span className="flex items-center justify-center gap-2 text-base">
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Creating Gallery...
                      </>
                    ) : (
                      <>
                        <FaPlus className="w-4 h-4" />
                        Create Gallery
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-blue-900 font-bold text-sm mb-1">
                Tips for Best Results
              </h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Use high-quality images for better visual appeal</li>
                <li>• Write descriptive titles and detailed descriptions</li>
                <li>• Keep file sizes under 5MB for faster loading</li>
                <li>• Supported formats: JPEG, PNG, GIF, and WebP</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGallery;
