import React, { useEffect, useState } from "react";
import {
  getAllGalleryApi,
  baseURL,
  updateGalleryApi,
  deleteGalleryApi,
} from "../../../Apis/Api";
import toast from "react-hot-toast";
import TablePagination from "@mui/material/TablePagination";
import {
  FaImage,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSave,
  FaExclamationTriangle,
} from "react-icons/fa";

const ViewGallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGalleries, setFilteredGalleries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [loading, setLoading] = useState(true);

  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingGallery, setDeletingGallery] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch galleries
  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await getAllGalleryApi();
      if (response.data.success) {
        setGalleries(response.data.gallery || []);
        setFilteredGalleries(response.data.gallery || []);
      } else {
        toast.error("Failed to fetch galleries");
      }
    } catch (error) {
      toast.error("An error occurred while fetching galleries.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    const results = galleries.filter(
      (gallery) =>
        (gallery.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (gallery.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredGalleries(results);
    setPage(0);
  }, [searchTerm, galleries]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open edit modal
  const openEditModal = (gallery) => {
    setEditingGallery(gallery);
    setEditTitle(gallery.title);
    setEditDescription(gallery.description);
    setEditImagePreview(`${baseURL}/${gallery.image}`);
    setEditImage(null);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGallery(null);
    setEditTitle("");
    setEditDescription("");
    setEditImage(null);
    setEditImagePreview(null);
  };

  // Handle edit image change
  const handleEditImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setEditImage(selectedFile);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  // Handle update gallery
  const handleUpdateGallery = async () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setIsUpdating(true);

    const formData = new FormData();
    formData.append("title", editTitle.trim());
    formData.append("description", editDescription.trim());
    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      const response = await updateGalleryApi(editingGallery._id, formData);
      if (response.data.success) {
        toast.success("Gallery updated successfully!");
        closeEditModal();
        fetchGalleries();
      } else {
        toast.error(response.data.message || "Failed to update gallery");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating gallery");
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Open delete modal
  const openDeleteModal = (gallery) => {
    setDeletingGallery(gallery);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingGallery(null);
  };

  // Handle delete gallery
  const handleDeleteGallery = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteGalleryApi(deletingGallery._id);
      if (response.data.success) {
        toast.success("Gallery deleted successfully!");
        closeDeleteModal();
        fetchGalleries();
      } else {
        toast.error(response.data.message || "Failed to delete gallery");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting gallery");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
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
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#AB3430] to-[#c94542] p-3 rounded-xl shadow-md">
                <FaImage className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gallery Collection
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and view all gallery items
                </p>
              </div>
            </div>

            {/* Gallery Counter */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <FaImage className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-blue-700">
                    Total Items
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredGalleries.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FaSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-3.5 text-gray-900 border-2 border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-[#AB3430] focus:border-[#AB3430] transition-all placeholder:text-gray-400"
              placeholder="Search by title or description..."
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredGalleries.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaImage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Galleries Found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start by adding your first gallery item"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {filteredGalleries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((gallery, index) => (
                  <div
                    key={gallery._id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-56 bg-gray-100 overflow-hidden">
                      <img
                        src={`${baseURL}/${gallery.image}`}
                        alt={gallery.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-[#AB3430] text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                        #{index + 1 + page * rowsPerPage}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {gallery.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {gallery.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(gallery)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <FaEdit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(gallery)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <FaTrash className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <TablePagination
                component="div"
                count={filteredGalleries.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[6, 12, 18, 24]}
                labelRowsPerPage="Items per page"
                className="text-gray-700"
              />
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FaEdit className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Edit Gallery</h2>
              </div>
              <button
                onClick={closeEditModal}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Title Input */}
              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Gallery Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter title..."
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="4"
                  className="w-full bg-white border-2 border-gray-300 rounded-xl py-3 px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Enter description..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-gray-800 text-sm font-bold mb-2">
                  Update Image (Optional)
                </label>
                <div className="space-y-3">
                  {editImagePreview && (
                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 bg-gray-50">
                      <div className="flex items-center justify-center bg-gray-100 min-h-64">
                        <img
                          src={editImagePreview}
                          alt="Preview"
                          className="w-full max-h-96 object-contain"
                        />
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={handleEditImageChange}
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-xl cursor-pointer bg-gray-50 focus:outline-none hover:bg-gray-100 transition-all file:mr-4 file:py-2.5 file:px-4 file:rounded-l-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200">
              <button
                onClick={closeEditModal}
                disabled={isUpdating}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateGallery}
                disabled={isUpdating}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSave className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">
                  Confirm Delete
                </h2>
              </div>
              <button
                onClick={closeDeleteModal}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this gallery item?
              </p>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <p className="font-semibold text-gray-900 mb-1">
                  {deletingGallery?.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {deletingGallery?.description}
                </p>
              </div>
              <p className="text-sm text-red-600 font-semibold mt-4">
                ⚠️ This action cannot be undone!
              </p>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200 rounded-b-2xl">
              <button
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGallery}
                disabled={isDeleting}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGallery;
