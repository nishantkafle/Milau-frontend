import React, { useState, useEffect } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlusCircle,
  FiXCircle,
  FiUsers,
  FiPhone,
  FiMapPin,
  FiTag,
} from "react-icons/fi";

const PartyManager = () => {
  const [parties, setParties] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "customer",
    phone: "",
    address: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      setLoading(true);
      // Use local backend for development
      const isDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const baseUrl = isDev
        ? "http://localhost:5000"
        : "https://api.pranucollection.com";
      const apiUrl = `${baseUrl}/api/parties`;

      console.log("Fetching from:", apiUrl);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch parties");
      const data = await response.json();
      setParties(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching parties:", error);
      setError("Failed to load businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Business name is required");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      // Use local backend for development
      const isDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const baseUrl = isDev
        ? "http://localhost:5000"
        : "https://api.pranucollection.com";

      const url = editId
        ? `${baseUrl}/api/parties/${editId}`
        : `${baseUrl}/api/parties/add`;

      const method = editId ? "PUT" : "POST";

      console.log("Submitting to:", url);
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save business");

      setSuccess(
        editId
          ? "Business updated successfully!"
          : "Business added successfully!"
      );
      resetForm();
      await fetchParties();

      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error saving party:", error);
      setError("Failed to save business. Please try again.");
    }
  };

  const handleEdit = (party) => {
    setFormData({
      name: party.name,
      type: party.type,
      phone: party.phone || "",
      address: party.address || "",
    });
    setEditId(party._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      try {
        // Use local backend for development
        const isDev =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const baseUrl = isDev
          ? "http://localhost:5000"
          : "https://api.pranucollection.com";

        console.log("Deleting from:", `${baseUrl}/api/parties/${id}`);
        const response = await fetch(`${baseUrl}/api/parties/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete business");

        setSuccess("Business deleted successfully!");
        await fetchParties();
        setTimeout(() => setSuccess(null), 3000);
      } catch (error) {
        console.error("Error deleting party:", error);
        setError("Failed to delete business. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", type: "customer", phone: "", address: "" });
    setEditId(null);
  };

  const getTypeColor = (type) => {
    return type === "customer"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <FiUsers className="text-indigo-600 mr-3" size={36} />
            <h1 className="text-4xl font-bold text-gray-900">
              Business Manager
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Manage your customers and suppliers efficiently
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiXCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiPlusCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              {editId ? (
                <>
                  <FiEdit className="mr-2 text-blue-600" />
                  Edit Business
                </>
              ) : (
                <>
                  <FiPlusCircle className="mr-2 text-indigo-600" />
                  Add New Business
                </>
              )}
            </h2>
            {editId && (
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                title="Cancel editing"
              >
                <FiXCircle size={24} />
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Enter business name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <FiTag className="mr-1" />
                  Business Type <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none bg-white"
                >
                  <option value="customer">Customer</option>
                  <option value="supplier">Supplier</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <FiPhone className="mr-1" />
                  Contact Number
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  type="tel"
                  placeholder="Enter contact number"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <FiMapPin className="mr-1" />
                  Address
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  className="w-full px-4 py-3 border-2 text-black border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              {editId && (
                <button
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSubmit}
                className={`${
                  editId
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center transform hover:scale-105`}
              >
                {editId ? (
                  <>
                    <FiEdit className="mr-2" size={18} />
                    Update Business
                  </>
                ) : (
                  <>
                    <FiPlusCircle className="mr-2" size={18} />
                    Add Business
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Parties List Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <FiUsers className="mr-2" />
              Business Directory
              {!loading && (
                <span className="ml-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {parties.length}{" "}
                  {parties.length === 1 ? "Business" : "Businesses"}
                </span>
              )}
            </h3>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Loading businesses...
              </p>
            </div>
          ) : parties.length === 0 ? (
            <div className="p-12 text-center">
              <FiUsers className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg font-medium">
                No businesses found
              </p>
              <p className="text-gray-400 mt-2">
                Add your first business to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Business Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parties.map((party) => (
                    <tr
                      key={party._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {party.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(
                            party.type
                          )}`}
                        >
                          {party.type.charAt(0).toUpperCase() +
                            party.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {party.phone ? (
                            <span className="flex items-center">
                              <FiPhone
                                className="mr-1 text-gray-400"
                                size={14}
                              />
                              {party.phone}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">
                              No contact
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">
                          {party.address ? (
                            <span className="flex items-center">
                              <FiMapPin
                                className="mr-1 text-gray-400"
                                size={14}
                              />
                              {party.address}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">
                              No address
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEdit(party)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-all"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(party._id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-100 p-2 rounded-lg transition-all"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartyManager;
