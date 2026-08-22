import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  addCategoryApi,
  getAllCategoryApi,
  deleteCategoryApi,
  updateCategoryApi,
} from "../../../Apis/Api";
import TablePagination from "@mui/material/TablePagination";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaExclamationCircle,
} from "react-icons/fa";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editPopup, setEditPopup] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState("");

  // Form validation errors
  const [errors, setErrors] = useState({
    categoryName: "",
  });

  // Edit form validation errors
  const [editErrors, setEditErrors] = useState({
    editName: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getAllCategoryApi();
        setCategories(response.data.categories || []);
        setLoading(false);
      } catch (error) {
        toast.error("Error loading categories. Please refresh the page.");
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateCategoryName = (name) => {
    if (!name.trim()) {
      return "Category name is required";
    } else if (name.trim().length < 2) {
      return "Category name must be at least 2 characters";
    } else if (name.trim().length > 50) {
      return "Category name must not exceed 50 characters";
    }
    return "";
  };

  const handleAddCategory = async () => {
    // Clear previous errors
    setErrors({ categoryName: "" });

    // Validate
    const error = validateCategoryName(categoryName);
    if (error) {
      setErrors({ categoryName: error });
      toast.error("Please fill in the category name correctly");
      return;
    }

    try {
      const response = await addCategoryApi({ name: categoryName.trim() });
      toast.success(response.data.message || "Category added successfully");
      setCategoryName("");
      setErrors({ categoryName: "" });

      const updatedCategories = await getAllCategoryApi();
      setCategories(updatedCategories.data.categories || []);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error adding category. Please try again.";
      toast.error(errorMessage);
      console.error("Add category error:", error);
    }
  };

  const handleDeleteCategory = async (id, categoryName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${categoryName}"?\n\nThis action cannot be undone and may affect related subcategories.`
    );

    if (!confirmDelete) return;

    try {
      const response = await deleteCategoryApi(id);
      toast.success(response.data.message || "Category deleted successfully");

      const updatedCategories = await getAllCategoryApi();
      setCategories(updatedCategories.data.categories || []);

      // Reset to first page if current page is now empty
      const newTotalPages = Math.ceil(
        (updatedCategories.data.categories?.length || 0) / rowsPerPage
      );
      if (page >= newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages - 1);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error deleting category. Please try again.";
      toast.error(errorMessage);
      console.error("Delete category error:", error);
    }
  };

  const handleEditPopup = (category) => {
    setEditCategory(category);
    setEditName(category.name);
    setEditErrors({ editName: "" });
    setEditPopup(true);
  };

  const handleUpdateCategory = async () => {
    // Clear previous errors
    setEditErrors({ editName: "" });

    // Validate
    const error = validateCategoryName(editName);
    if (error) {
      setEditErrors({ editName: error });
      toast.error("Please fill in the category name correctly");
      return;
    }

    try {
      const response = await updateCategoryApi(editCategory._id, {
        name: editName.trim(),
      });
      toast.success(response.data.message || "Category updated successfully");

      const updatedCategories = await getAllCategoryApi();
      setCategories(updatedCategories.data.categories || []);

      setEditPopup(false);
      setEditCategory(null);
      setEditErrors({ editName: "" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error updating category. Please try again.";
      toast.error(errorMessage);
      console.error("Update category error:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };

  const handleCategoryNameChange = (value) => {
    setCategoryName(value);
    if (errors.categoryName) {
      setErrors({ categoryName: "" });
    }
  };

  const handleEditNameChange = (value) => {
    setEditName(value);
    if (editErrors.editName) {
      setEditErrors({ editName: "" });
    }
  };

  const closeEditModal = () => {
    setEditPopup(false);
    setEditCategory(null);
    setEditName("");
    setEditErrors({ editName: "" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#AB3430] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading categories...</p>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-white"
              >
                <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Category Management
              </h1>
              <p className="text-gray-600 mt-1">
                Add and manage your product categories
              </p>
            </div>
          </div>

          {/* Add Category Form */}
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 shadow-sm">
            <label
              className="block text-gray-800 text-sm font-bold mb-3"
              htmlFor="categoryName"
            >
              New Category Name <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  name="categoryName"
                  placeholder="Enter category name..."
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => handleCategoryNameChange(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleAddCategory)}
                  className={`w-full bg-white border-2 ${
                    errors.categoryName ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    errors.categoryName
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all placeholder:text-gray-400`}
                />
                {errors.categoryName && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{errors.categoryName}</p>
                  </div>
                )}
              </div>
              <button
                onClick={handleAddCategory}
                className="bg-gradient-to-r from-[#AB3430] to-[#8b2a27] hover:from-[#c94542] hover:to-[#AB3430] text-white font-bold py-3.5 px-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AB3430] focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span className="flex items-center gap-2 text-base whitespace-nowrap">
                  <FaPlus className="w-4 h-4" />
                  Add Category
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                All Categories
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {filteredCategories.length} total categories
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      Category Name
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
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-12 text-center text-gray-600"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-16 h-16 text-gray-400"
                          >
                            <path
                              fillRule="evenodd"
                              d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                              clipRule="evenodd"
                            />
                            <path
                              fillRule="evenodd"
                              d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p className="text-base font-semibold text-gray-700">
                            {searchQuery
                              ? "No categories found matching your search."
                              : "No categories available yet"}
                          </p>
                          {!searchQuery && (
                            <p className="text-sm text-gray-500">
                              Add your first category using the form above
                            </p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCategories
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((category, index) => (
                        <tr
                          key={category._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-gray-700">
                            {index + 1 + page * rowsPerPage}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 text-base">
                            {category.name}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-105"
                                onClick={() => handleEditPopup(category)}
                                title="Edit category"
                              >
                                <FaEdit size={18} />
                              </button>
                              <button
                                className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all transform hover:scale-105"
                                onClick={() =>
                                  handleDeleteCategory(
                                    category._id,
                                    category.name
                                  )
                                }
                                title="Delete category"
                              >
                                <FaTrashAlt size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredCategories.length > 0 && (
              <div className="border-t-2 border-gray-200 bg-gray-50">
                <TablePagination
                  component="div"
                  count={filteredCategories.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Rows per page"
                  sx={{
                    ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
                      {
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: "#374151",
                      },
                    ".MuiTablePagination-select": {
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#111827",
                    },
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Popup */}
      {editPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-[#AB3430] to-[#c94542] p-2 rounded-lg">
                  <FaEdit className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Category
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
              <div className="mb-6">
                <label className="block text-gray-800 text-sm font-bold mb-3">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => handleEditNameChange(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, handleUpdateCategory)}
                  className={`w-full bg-white border-2 ${
                    editErrors.editName ? "border-red-500" : "border-gray-300"
                  } rounded-xl py-3.5 px-5 text-gray-900 text-base leading-tight focus:outline-none focus:ring-2 ${
                    editErrors.editName
                      ? "focus:ring-red-500 focus:border-red-500"
                      : "focus:ring-[#AB3430] focus:border-[#AB3430]"
                  } transition-all`}
                  autoFocus
                />
                {editErrors.editName && (
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    <FaExclamationCircle className="w-4 h-4" />
                    <p className="text-sm font-medium">{editErrors.editName}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateCategory}
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

export default AddCategory;
