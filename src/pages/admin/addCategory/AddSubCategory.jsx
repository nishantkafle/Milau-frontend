import React, { useState, useEffect } from "react";
import {
  getAllCategoryApi,
  getAllSubcategoriesApi,
  addSubCategoryApi,
  deleteSubCategoryApi,
  updateSubCategoryApi,
} from "../../../Apis/Api";
import toast from "react-hot-toast";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaLayerGroup,
  FaExclamationCircle,
} from "react-icons/fa";

const AddSubCategory = () => {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSubCategory, setEditSubCategory] = useState({});

  // Form validation errors
  const [errors, setErrors] = useState({
    name: "",
    categoryId: "",
  });

  // Edit form validation errors
  const [editErrors, setEditErrors] = useState({
    name: "",
    categoryId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesResponse, subcategoriesResponse] = await Promise.all([
          getAllCategoryApi(),
          getAllSubcategoriesApi(),
        ]);

        setCategories(categoriesResponse.data?.categories || []);
        const fetchedSubcategories =
          subcategoriesResponse.data?.subCategories || [];
        setSubcategories(fetchedSubcategories);
        setFilteredSubcategories(fetchedSubcategories);
      } catch (err) {
        toast.error("Error loading data. Please refresh the page.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryInfo = (subcategory) => {
    // Handle null or undefined category
    if (!subcategory.category) {
      return {
        id: null,
        name: "⚠️ Category Deleted",
      };
    }

    // Handle object category (populated)
    if (typeof subcategory.category === "object") {
      return {
        id: subcategory.category._id,
        name: subcategory.category.name || "Unknown",
      };
    }

    // Handle string category (just ID)
    const category = categories.find((cat) => cat._id === subcategory.category);
    return {
      id: subcategory.category,
      name: category?.name || "⚠️ Category Not Found",
    };
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      categoryId: "",
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Subcategory name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Subcategory name must be at least 2 characters";
      isValid = false;
    } else if (name.trim().length > 50) {
      newErrors.name = "Subcategory name must not exceed 50 characters";
      isValid = false;
    }

    if (!categoryId) {
      newErrors.categoryId = "Please select a parent category";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateEditForm = () => {
    const newErrors = {
      name: "",
      categoryId: "",
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Subcategory name is required";
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = "Subcategory name must be at least 2 characters";
      isValid = false;
    } else if (name.trim().length > 50) {
      newErrors.name = "Subcategory name must not exceed 50 characters";
      isValid = false;
    }

    if (!categoryId) {
      newErrors.categoryId = "Please select a parent category";
      isValid = false;
    }

    setEditErrors(newErrors);
    return isValid;
  };

  const handleDelete = async (subcategoryId, subcategoryName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${subcategoryName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteSubCategoryApi(subcategoryId);
      if (response.data.success) {
        toast.success(
          response.data.message || "Subcategory deleted successfully"
        );
        const updatedSubcategories = await getAllSubcategoriesApi();
        const subcategoriesList =
          updatedSubcategories.data?.subCategories || [];
        setSubcategories(subcategoriesList);
        setFilteredSubcategories(subcategoriesList);
      } else {
        toast.error("Failed to delete subcategory");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Error deleting subcategory. Please try again.";
      toast.error(errorMessage);
      console.error("Delete error:", err);
    }
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({ name: "", categoryId: "" });

    // Validate form
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const response = await addSubCategoryApi({
        name: name.trim(),
        categoryId,
      });
      if (response.data.success) {
        toast.success(
          response.data.message || "Subcategory added successfully"
        );
        setName("");
        setCategoryId("");
        setErrors({ name: "", categoryId: "" });

        const updatedSubcategories = await getAllSubcategoriesApi();
        const subcategoriesList =
          updatedSubcategories.data?.subCategories || [];
        setSubcategories(subcategoriesList);
        setFilteredSubcategories(subcategoriesList);
      } else {
        toast.error("Failed to add subcategory");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Error adding subcategory. Please try again.";
      toast.error(errorMessage);
      console.error("Add error:", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = subcategories.filter((subcategory) =>
      subcategory.name.toLowerCase().includes(query)
    );
    setFilteredSubcategories(filtered);
  };

  const openEditModal = (subcategory) => {
    setEditSubCategory(subcategory);
    setName(subcategory.name);

    // Safely get category ID using getCategoryInfo helper
    const categoryInfo = getCategoryInfo(subcategory);
    setCategoryId(categoryInfo.id || "");

    setEditErrors({ name: "", categoryId: "" });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setName("");
    setCategoryId("");
    setEditErrors({ name: "", categoryId: "" });
    setEditSubCategory({});
  };

  const handleEditSubmit = async () => {
    // Clear previous errors
    setEditErrors({ name: "", categoryId: "" });

    // Validate form
    if (!validateEditForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const response = await updateSubCategoryApi(editSubCategory._id, {
        name: name.trim(),
        categoryId,
      });
      if (response.data.success) {
        toast.success(
          response.data.message || "Subcategory updated successfully"
        );
        closeEditModal();

        const updatedSubcategories = await getAllSubcategoriesApi();
        const subcategoriesList =
          updatedSubcategories.data?.subCategories || [];
        setSubcategories(subcategoriesList);
        setFilteredSubcategories(subcategoriesList);
      } else {
        toast.error("Failed to update subcategory");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Error updating subcategory. Please try again.";
      toast.error(errorMessage);
      console.error("Update error:", err);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  // Clear error when user starts typing
  const handleNameChange = (value, isEditMode = false) => {
    if (isEditMode) {
      setName(value);
      if (editErrors.name) {
        setEditErrors((prev) => ({ ...prev, name: "" }));
      }
    } else {
      setName(value);
      if (errors.name) {
        setErrors((prev) => ({ ...prev, name: "" }));
      }
    }
  };

  const handleCategoryChange = (value, isEditMode = false) => {
    if (isEditMode) {
      setCategoryId(value);
      if (editErrors.categoryId) {
        setEditErrors((prev) => ({ ...prev, categoryId: "" }));
      }
    } else {
      setCategoryId(value);
      if (errors.categoryId) {
        setErrors((prev) => ({ ...prev, categoryId: "" }));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#AB3430] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">
            Loading subcategories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-br from-[#AB3430] to-[#c94542] p-3 rounded-xl shadow-md">
              <FaLayerGroup className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Subcategory Management
              </h1>
              <p className="text-gray-600 mt-1">
                Add and manage product subcategories
              </p>
            </div>
          </div>

          {/* Add Subcategory Form */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
            <h3 className="text-gray-800 text-sm font-bold mb-4">
              Create New Subcategory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value, false)}
                  onKeyPress={(e) => handleKeyPress(e, handleSubmit)}
                  placeholder="Enter subcategory name..."
                  className={`w-full bg-white border-2 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all placeholder:text-gray-400`}
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.name}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value, false)}
                  className={`w-full bg-white border-2 ${
                    errors.categoryId ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    errors.categoryId
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all cursor-pointer`}
                >
                  <option value="" className="text-gray-500">
                    Select a Category
                  </option>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                        className="text-gray-900"
                      >
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled className="text-gray-500">
                      No categories available
                    </option>
                  )}
                </select>
                {errors.categoryId && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.categoryId}</p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={categories.length === 0}
              className={`${
                categories.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#AB3430] to-[#8b2a27] hover:from-[#c94542] hover:to-[#AB3430] transform hover:-translate-y-0.5"
              } text-white font-bold py-3.5 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl`}
            >
              <span className="flex items-center gap-2 text-base">
                <FaPlus className="w-4 h-4" />
                Add Subcategory
              </span>
            </button>
            {categories.length === 0 && (
              <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
                <FaExclamationCircle className="w-4 h-4" />
                Please add at least one category first before creating
                subcategories.
              </p>
            )}
          </div>
        </div>

        {/* Subcategories Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                All Subcategories
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {filteredSubcategories.length} total subcategories
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search subcategories..."
                className="pl-11 pr-4 py-3 w-72 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:border-[#AB3430] focus:bg-white transition-all text-gray-900 placeholder:text-gray-500"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-bold text-gray-800"
                    >
                      SN
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-bold text-gray-800"
                    >
                      Subcategory Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-bold text-gray-800"
                    >
                      Parent Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-bold text-gray-800 text-center"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredSubcategories?.length > 0 ? (
                    filteredSubcategories.map((subcategory, index) => {
                      const categoryInfo = getCategoryInfo(subcategory);

                      return (
                        <tr
                          key={subcategory._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-700">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 text-base">
                            {subcategory.name}
                          </td>
                          <td className="px-6 py-4 text-gray-700 text-base">
                            <span className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 text-gray-600"
                              >
                                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                              </svg>
                              <span className="font-medium text-gray-800">
                                {categoryInfo.name}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-105"
                                onClick={() => openEditModal(subcategory)}
                                title="Edit subcategory"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all transform hover:scale-105"
                                onClick={() =>
                                  handleDelete(
                                    subcategory._id,
                                    subcategory.name
                                  )
                                }
                                title="Delete subcategory"
                              >
                                <FaTrashAlt size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-12 text-center text-gray-600"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <FaLayerGroup className="w-16 h-16 text-gray-400" />
                          <p className="text-base font-semibold text-gray-700">
                            {searchQuery
                              ? "No subcategories found matching your search."
                              : "No subcategories available yet"}
                          </p>
                          {!searchQuery && (
                            <p className="text-sm text-gray-500">
                              Add your first subcategory using the form above
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#AB3430] to-[#c94542] p-2 rounded-lg">
                  <FaEdit className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Subcategory
                </h2>
              </div>
              <button
                onClick={closeEditModal}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div>
              <div className="mb-4">
                <label className="block text-gray-800 text-sm font-bold mb-3">
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value, true)}
                  onKeyPress={(e) => handleKeyPress(e, handleEditSubmit)}
                  className={`w-full bg-white border-2 ${
                    editErrors.name ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    editErrors.name
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all`}
                  autoFocus
                />
                {editErrors.name && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{editErrors.name}</p>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-bold mb-3">
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value, true)}
                  className={`w-full bg-white border-2 ${
                    editErrors.categoryId ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    editErrors.categoryId
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all cursor-pointer`}
                >
                  <option value="" className="text-gray-500">
                    Select a Category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                      className="text-gray-900"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                {editErrors.categoryId && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">
                      {editErrors.categoryId}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleEditSubmit}
                  className="flex-1 bg-gradient-to-r from-[#AB3430] to-[#8b2a27] hover:from-[#c94542] hover:to-[#AB3430] text-white font-bold py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={closeEditModal}
                  className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSubCategory;
