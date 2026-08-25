import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  getAllVendorsApi,
  getStaffByVendorApi,
  createManagedUserApi,
  updateVendorApi,
  deleteVendorApi,
  deleteStaffByAdminApi,
  addStaffApi,
} from "../../Apis/Api";

const SystemAdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Vendor staff modal states
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorStaff, setVendorStaff] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Add Vendor Modal state
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    password: "",
    street: "",
    city: "",
    country: "Nepal",
  });
  const [submittingVendor, setSubmittingVendor] = useState(false);

  // Edit Vendor Modal state
  const [editingVendor, setEditingVendor] = useState(null);
  const [editVendorData, setEditVendorData] = useState({
    name: "",
    email: "",
    password: "",
    street: "",
    city: "",
    country: "",
  });
  const [updatingVendor, setUpdatingVendor] = useState(false);

  // Delete Vendor Modal state
  const [deletingVendor, setDeletingVendor] = useState(null);
  const [isDeletingVendor, setIsDeletingVendor] = useState(false);

  // Staff Modal sub-states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
    salary: "",
  });
  const [submittingStaff, setSubmittingStaff] = useState(false);

  const [editingStaff, setEditingStaff] = useState(null);
  const [editStaffData, setEditStaffData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });
  const [updatingStaff, setUpdatingStaff] = useState(false);

  const [deletingStaff, setDeletingStaff] = useState(null);
  const [isDeletingStaff, setIsDeletingStaff] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await getAllVendorsApi();
      if (response.data.success) {
        setVendors(response.data.vendors);
      } else {
        toast.error("Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Error fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleViewStaff = async (vendor) => {
    try {
      setLoadingStaff(true);
      setSelectedVendor(vendor);
      const response = await getStaffByVendorApi(vendor._id);
      if (response.data.success) {
        setVendorStaff(response.data.staff);
      } else {
        toast.error("Failed to fetch staff");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Error fetching staff");
    } finally {
      setLoadingStaff(false);
    }
  };

  const refreshSelectedVendorStaff = async () => {
    if (!selectedVendor) return;
    try {
      const response = await getStaffByVendorApi(selectedVendor._id);
      if (response.data.success) {
        setVendorStaff(response.data.staff);
      }
    } catch (err) {
      console.error("Error refreshing staff:", err);
    }
  };

  const handleCloseStaffView = () => {
    setSelectedVendor(null);
    setVendorStaff([]);
  };

  // Add Vendor Handler
  const handleCreateVendor = async (e) => {
    e.preventDefault();
    if (!newVendor.name || !newVendor.email || !newVendor.password) {
      toast.error("Name, email, and password are required");
      return;
    }

    setSubmittingVendor(true);
    try {
      const payload = {
        name: newVendor.name,
        email: newVendor.email,
        password: newVendor.password,
        role: "vendor",
        street: newVendor.street,
        city: newVendor.city,
        country: newVendor.country,
      };

      const res = await createManagedUserApi(payload);
      if (res.data.success) {
        toast.success("Vendor created successfully!");
        setShowAddVendorModal(false);
        setNewVendor({
          name: "",
          email: "",
          password: "",
          street: "",
          city: "",
          country: "Nepal",
        });
        fetchVendors();
      } else {
        toast.error(res.data.message || "Failed to create vendor");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating vendor");
    } finally {
      setSubmittingVendor(false);
    }
  };

  // Open Edit Vendor Modal
  const openEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setEditVendorData({
      name: vendor.name || "",
      email: vendor.email || "",
      password: "",
      street: vendor.address?.street || "",
      city: vendor.address?.city || "",
      country: vendor.address?.country || "Nepal",
    });
  };

  // Submit Edit Vendor
  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    if (!editVendorData.name || !editVendorData.email) {
      toast.error("Name and email are required");
      return;
    }

    setUpdatingVendor(true);
    try {
      const payload = {
        name: editVendorData.name,
        email: editVendorData.email,
        address: {
          street: editVendorData.street,
          city: editVendorData.city,
          country: editVendorData.country,
        },
      };

      if (editVendorData.password && editVendorData.password.trim() !== "") {
        payload.password = editVendorData.password;
      }

      const res = await updateVendorApi(editingVendor._id, payload);
      if (res.data.success) {
        toast.success("Vendor updated successfully");
        setEditingVendor(null);
        fetchVendors();
      } else {
        toast.error(res.data.message || "Failed to update vendor");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating vendor");
    } finally {
      setUpdatingVendor(false);
    }
  };

  // Delete Vendor Handler
  const handleDeleteVendor = async () => {
    if (!deletingVendor) return;
    setIsDeletingVendor(true);
    try {
      const res = await deleteVendorApi(deletingVendor._id);
      if (res.data.success) {
        toast.success("Vendor and associated accounts deleted");
        setDeletingVendor(null);
        fetchVendors();
      } else {
        toast.error(res.data.message || "Failed to delete vendor");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error deleting vendor");
    } finally {
      setIsDeletingVendor(false);
    }
  };

  // Add Staff under Vendor
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      toast.error("Name, email, and password are required");
      return;
    }

    setSubmittingStaff(true);
    try {
      // 1. Create user account
      const userPayload = {
        name: newStaff.name,
        email: newStaff.email,
        password: newStaff.password,
        role: "staff",
        vendorId: selectedVendor._id,
      };

      const res = await createManagedUserApi(userPayload);
      if (res.data.success) {
        // 2. Also register in Staff collection if salary provided
        if (newStaff.salary) {
          try {
            await addStaffApi({
              name: newStaff.name,
              role: newStaff.role || "staff",
              salary: newStaff.salary,
              email: newStaff.email,
              vendorId: selectedVendor._id,
            });
          } catch (staffErr) {
            console.log("Staff doc creation optional warning:", staffErr);
          }
        }

        toast.success("Staff created under vendor");
        setShowAddStaffModal(false);
        setNewStaff({
          name: "",
          email: "",
          password: "",
          role: "staff",
          salary: "",
        });
        refreshSelectedVendorStaff();
        fetchVendors();
      } else {
        toast.error(res.data.message || "Failed to create staff");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating staff");
    } finally {
      setSubmittingStaff(false);
    }
  };

  // Open Edit Staff
  const openEditStaff = (staff) => {
    setEditingStaff(staff);
    setEditStaffData({
      name: staff.name || "",
      email: staff.email || "",
      password: "",
      role: staff.role || "staff",
    });
  };

  // Submit Edit Staff
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (!editStaffData.name) {
      toast.error("Name is required");
      return;
    }

    setUpdatingStaff(true);
    try {
      const payload = {
        name: editStaffData.name,
        email: editStaffData.email,
        role: editStaffData.role,
      };
      if (editStaffData.password && editStaffData.password.trim() !== "") {
        payload.password = editStaffData.password;
      }

      const res = await updateVendorApi(editingStaff._id, payload);
      if (res.data.success) {
        toast.success("Staff updated successfully");
        setEditingStaff(null);
        refreshSelectedVendorStaff();
      } else {
        toast.error(res.data.message || "Failed to update staff");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error updating staff");
    } finally {
      setUpdatingStaff(false);
    }
  };

  // Delete Staff
  const handleDeleteStaff = async () => {
    if (!deletingStaff) return;
    setIsDeletingStaff(true);
    try {
      const res = await deleteStaffByAdminApi(deletingStaff._id);
      if (res.data.success) {
        toast.success("Staff member deleted");
        setDeletingStaff(null);
        refreshSelectedVendorStaff();
        fetchVendors();
      } else {
        toast.error(res.data.message || "Failed to delete staff");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error deleting staff");
    } finally {
      setIsDeletingStaff(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter vendors by search
  const filteredVendors = vendors.filter((v) => {
    const q = searchQuery.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.address?.city?.toLowerCase().includes(q)
    );
  });

  const totalStaffCount = vendors.reduce(
    (acc, vendor) => acc + (vendor.staffCount || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AB3430]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            System Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Control center for registered vendors & staff access management
          </p>
        </div>
        <button
          onClick={() => setShowAddVendorModal(true)}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white text-sm font-semibold rounded-lg shadow hover:opacity-95 transition-all"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add New Vendor
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Registered Vendors
            </p>
            <p className="text-3xl font-extrabold text-gray-900">
              {vendors.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total Vendor Staff
            </p>
            <p className="text-3xl font-extrabold text-gray-900">
              {totalStaffCount}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Vendor Accounts
            </p>
            <p className="text-3xl font-extrabold text-gray-900">
              {vendors.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Vendor Management Table Box */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Search & Filter header */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <h2 className="text-base font-semibold text-gray-800">
            Registered Vendor Directory ({filteredVendors.length})
          </h2>
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search vendor name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB3430]/30 focus:border-[#AB3430]"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3 top-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Vendors Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vendor Name
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Location / Address
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Registered Date
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Staff Count
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No matching vendors found.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-tr from-[#AB3430] to-[#c94542] text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-sm">
                          {vendor.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3.5">
                          <div className="text-sm font-semibold text-gray-900">
                            {vendor.name}
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                            Vendor Account
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {vendor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {[vendor.address?.street, vendor.address?.city, vendor.address?.country]
                        .filter(Boolean)
                        .join(", ") || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(vendor.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewStaff(vendor)}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                      >
                        👥 {vendor.staffCount || 0} Staff
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewStaff(vendor)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md font-semibold text-xs transition-colors"
                      >
                        View Staff
                      </button>
                      <button
                        onClick={() => openEditVendor(vendor)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-semibold text-xs transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeletingVendor(vendor)}
                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md font-semibold text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL 1: ADD NEW VENDOR ── */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Register New Vendor
              </h3>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateVendor} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Vendor / Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430]/30 outline-none"
                  placeholder="e.g. Kathmandu Fashion House"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newVendor.email}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430]/30 outline-none"
                  placeholder="vendor@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={newVendor.password}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430]/30 outline-none"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street / Area
                  </label>
                  <input
                    type="text"
                    value={newVendor.street}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, street: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                    placeholder="New Road"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={newVendor.city}
                    onChange={(e) =>
                      setNewVendor({ ...newVendor, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                    placeholder="Kathmandu"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingVendor}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#AB3430] hover:bg-[#8a2a26] rounded-lg shadow disabled:opacity-50"
                >
                  {submittingVendor ? "Creating..." : "Save Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: EDIT VENDOR ── */}
      {editingVendor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Vendor Details
              </h3>
              <button
                onClick={() => setEditingVendor(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateVendor} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={editVendorData.name}
                  onChange={(e) =>
                    setEditVendorData({ ...editVendorData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430]/30 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editVendorData.email}
                  onChange={(e) =>
                    setEditVendorData({
                      ...editVendorData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430]/30 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reset Password (leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  value={editVendorData.password}
                  onChange={(e) =>
                    setEditVendorData({
                      ...editVendorData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                  placeholder="New password..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Street
                  </label>
                  <input
                    type="text"
                    value={editVendorData.street}
                    onChange={(e) =>
                      setEditVendorData({
                        ...editVendorData,
                        street: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editVendorData.city}
                    onChange={(e) =>
                      setEditVendorData({
                        ...editVendorData,
                        city: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingVendor(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingVendor}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#AB3430] hover:bg-[#8a2a26] rounded-lg shadow disabled:opacity-50"
                >
                  {updatingVendor ? "Saving..." : "Update Vendor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: DELETE VENDOR CONFIRM ── */}
      {deletingVendor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Vendor Account?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete vendor{" "}
              <strong className="text-gray-800">{deletingVendor.name}</strong>?
              This will permanently delete the vendor and all staff accounts linked under them.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingVendor(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVendor}
                disabled={isDeletingVendor}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow disabled:opacity-50"
              >
                {isDeletingVendor ? "Deleting..." : "Delete Vendor"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 4: VIEW VENDOR STAFF ── */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    Staff Directory: {selectedVendor.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {vendorStaff.length} Staff
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Vendor Email: {selectedVendor.email}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-3.5 py-2 bg-[#AB3430] hover:bg-[#8a2a26] text-white font-semibold text-xs rounded-lg shadow transition-colors"
                >
                  + Add Staff to Vendor
                </button>
                <button
                  onClick={handleCloseStaffView}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loadingStaff ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB3430]"></div>
                </div>
              ) : vendorStaff.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No staff members registered under this vendor yet.
                </div>
              ) : (
                <div className="grid gap-3">
                  {vendorStaff.map((staff) => (
                    <div
                      key={staff._id}
                      className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition-colors shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className="h-11 w-11 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-base shadow-sm">
                          {staff.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3.5">
                          <div className="text-sm font-bold text-gray-900">
                            {staff.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {staff.email || "No email login assigned"}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-blue-50 text-blue-700">
                              {staff.role || "Staff"}
                            </span>
                            {staff.salary !== undefined && (
                              <span className="text-xs font-semibold text-gray-700">
                                Rs. {staff.salary}/mo
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditStaff(staff)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingStaff(staff)}
                          className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: ADD STAFF UNDER VENDOR ── */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Add Staff Member to {selectedVendor?.name}
              </h3>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#AB3430]/30"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address (for login) *
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#AB3430]/30"
                  placeholder="staff@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Login Password *
                </label>
                <input
                  type="password"
                  required
                  value={newStaff.password}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#AB3430]/30"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Monthly Salary (NPR)
                </label>
                <input
                  type="number"
                  value={newStaff.salary}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, salary: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                  placeholder="e.g. 25000"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingStaff}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#AB3430] hover:bg-[#8a2a26] rounded-lg shadow disabled:opacity-50"
                >
                  {submittingStaff ? "Adding..." : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 6: EDIT STAFF ── */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Edit Staff Member
              </h3>
              <button
                onClick={() => setEditingStaff(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdateStaff} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editStaffData.name}
                  onChange={(e) =>
                    setEditStaffData({ ...editStaffData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editStaffData.email}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reset Password (leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  value={editStaffData.password}
                  onChange={(e) =>
                    setEditStaffData({
                      ...editStaffData,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
                  placeholder="New password..."
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStaff}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#AB3430] hover:bg-[#8a2a26] rounded-lg shadow disabled:opacity-50"
                >
                  {updatingStaff ? "Saving..." : "Update Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 7: DELETE STAFF CONFIRM ── */}
      {deletingStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Staff Member?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete staff member{" "}
              <strong className="text-gray-800">{deletingStaff.name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingStaff(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStaff}
                disabled={isDeletingStaff}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow disabled:opacity-50"
              >
                {isDeletingStaff ? "Deleting..." : "Delete Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemAdminDashboard;
