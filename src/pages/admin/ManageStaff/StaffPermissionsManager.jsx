import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getVendorStaffPermissionsApi, updateStaffPermissionsApi } from "../../../Apis/Api";

const AVAILABLE_FEATURES = [
  {
    key: "selfCheckout",
    name: "Self Checkout / POS",
    description: "Operate self-checkout POS register and place customer orders",
    icon: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    key: "attendance",
    name: "Attendance Marking",
    description: "Mark daily attendance, view attendance status & history",
    icon: (
      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: "products",
    name: "Product Catalog",
    description: "View store product items, inventory status & categories",
    icon: (
      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: "expenses",
    name: "Expense Management",
    description: "Record store expenses, cashbook transactions and view summaries",
    icon: (
      <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "business",
    name: "Business & Bills",
    description: "Manage business invoices, party ledgers & transaction bills",
    icon: (
      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: "orderHistory",
    name: "Analytics & Orders",
    description: "View completed store order history and sales analytics",
    icon: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const StaffPermissionsManager = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [staffPermissions, setStaffPermissions] = useState({}); // { [staffId]: ['selfCheckout', 'attendance'] }
  const [savingStaffId, setSavingStaffId] = useState(null);

  useEffect(() => {
    fetchStaffPermissions();
  }, []);

  const fetchStaffPermissions = async () => {
    try {
      setLoading(true);
      const res = await getVendorStaffPermissionsApi();
      if (res.data.success) {
        const staff = res.data.staff || [];
        setStaffList(staff);
        
        // Populate initial permissions map
        const permMap = {};
        staff.forEach((s) => {
          permMap[s._id] = s.permissions || ["selfCheckout", "attendance"];
        });
        setStaffPermissions(permMap);
      }
    } catch (error) {
      console.error("Error fetching staff permissions:", error);
      toast.error("Failed to load staff permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = (staffId, featureKey) => {
    setStaffPermissions((prev) => {
      const currentPerms = prev[staffId] || [];
      const updatedPerms = currentPerms.includes(featureKey)
        ? currentPerms.filter((key) => key !== featureKey)
        : [...currentPerms, featureKey];

      return {
        ...prev,
        [staffId]: updatedPerms,
      };
    });
  };

  const handleSavePermissions = async (staffId, staffName) => {
    try {
      setSavingStaffId(staffId);
      const permsToSave = staffPermissions[staffId] || [];
      const res = await updateStaffPermissionsApi(staffId, permsToSave);
      
      if (res.data.success) {
        toast.success(`Feature permissions updated for ${staffName}!`);
      } else {
        toast.error(res.data.message || "Failed to update permissions");
      }
    } catch (error) {
      console.error("Error saving permissions:", error);
      toast.error(error.response?.data?.message || "Error saving permissions");
    } finally {
      setSavingStaffId(null);
    }
  };

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-50 text-[#AB3430]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            Staff Feature Access Control
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select which modules and features each staff account is permitted to operate
          </p>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name or role..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <div className="w-8 h-8 border-4 border-[#AB3430] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading staff members and permissions...
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <p className="text-lg font-semibold text-gray-700 mb-1">No Staff Members Found</p>
          <p className="text-sm text-gray-400">
            {search ? "No staff members match your search filter." : "Create staff accounts in Staff Management first."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredStaff.map((staff) => {
            const currentPerms = staffPermissions[staff._id] || [];
            const isSaving = savingStaffId === staff._id;

            return (
              <div
                key={staff._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Staff Header */}
                <div className="bg-gray-50 p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white font-bold flex items-center justify-center text-lg shadow-sm">
                      {staff.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-800">{staff.name}</h3>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-[#AB3430]">
                          {staff.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {staff.email ? `Login Email: ${staff.email}` : "No login account created yet"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-medium text-gray-500">
                      {currentPerms.length} of {AVAILABLE_FEATURES.length} Enabled
                    </span>
                    <button
                      onClick={() => handleSavePermissions(staff._id, staff.name)}
                      disabled={isSaving}
                      className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#AB3430] to-[#c94542] rounded-lg hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSaving ? "Saving..." : "Save Permissions"}
                    </button>
                  </div>
                </div>

                {/* Feature Toggles Grid */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {AVAILABLE_FEATURES.map((feature) => {
                    const isEnabled = currentPerms.includes(feature.key);

                    return (
                      <div
                        key={feature.key}
                        onClick={() => handleToggleFeature(staff._id, feature.key)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isEnabled
                            ? "border-[#AB3430] bg-red-50/30 shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300 opacity-80"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 rounded-lg bg-white shadow-xs border border-gray-100">
                                {feature.icon}
                              </div>
                              <span className="font-bold text-sm text-gray-800">{feature.name}</span>
                            </div>

                            {/* Checkbox Switch */}
                            <div
                              className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all ${
                                isEnabled
                                  ? "bg-[#AB3430] border-[#AB3430] text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {isEnabled && (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold">
                          <span className={isEnabled ? "text-[#AB3430]" : "text-gray-400"}>
                            {isEnabled ? "✓ Feature Enabled" : "✕ Disabled"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffPermissionsManager;
