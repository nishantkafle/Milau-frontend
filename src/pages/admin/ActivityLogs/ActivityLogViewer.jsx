import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getActivityLogsApi } from "../../../Apis/Api";

const MODULE_OPTIONS = [
  "All",
  "Staff Access Control",
  "Staff",
  "Attendance",
  "Profile",
  "Sales",
  "Expenses",
  "Inventory",
];

const ActivityLogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [usersList, setUsersList] = useState([]);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedModule, setSelectedModule] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchActivityLogs();
  }, [currentPage, selectedUser, selectedModule, startDate, endDate]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 15,
      };

      if (search.trim()) params.search = search.trim();
      if (selectedUser) params.userId = selectedUser;
      if (selectedModule && selectedModule !== "All") params.moduleName = selectedModule;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await getActivityLogsApi(params);
      if (res.data.success) {
        setLogs(res.data.logs || []);
        setTotalLogs(res.data.totalLogs || 0);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.usersList) {
          setUsersList(res.data.usersList);
        }
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast.error("Failed to load store activity log history");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchActivityLogs();
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedUser("");
    setSelectedModule("All");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const getModuleBadgeColor = (moduleName) => {
    switch (moduleName) {
      case "Staff Access Control":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Staff":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Attendance":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Profile":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "Sales":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Expenses":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-50 text-[#AB3430]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Activity Log History
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time audit log of store user actions, changes, and module activity
          </p>
        </div>

        <button
          onClick={fetchActivityLogs}
          className="px-4 py-2 text-sm font-semibold text-[#AB3430] bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Logs
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Search Action / Keyword</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search description..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">User / Staff Member</label>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
            >
              <option value="">All Users</option>
              {usersList.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.userName} ({u.userRole})
                </option>
              ))}
            </select>
          </div>

          {/* Module Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Module</label>
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
            >
              {MODULE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
            />
          </div>
        </form>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-800">{logs.length}</span> of{" "}
            <span className="font-bold text-gray-800">{totalLogs}</span> total log entries
          </p>

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-gray-500 hover:text-[#AB3430] font-semibold underline transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Activity Logs Timeline Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-[#AB3430] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading activity log history...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg font-semibold text-gray-700 mb-1">No Activity Logs Found</p>
            <p className="text-sm text-gray-400">
              No store actions match your selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">Date & Time</th>
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Module</th>
                  <th className="py-3.5 px-6">Action & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 text-xs text-gray-500 whitespace-nowrap font-medium">
                      {formatDate(log.createdAt)}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                          {log.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{log.userName}</p>
                          <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            {log.userRole}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md border ${getModuleBadgeColor(
                          log.module
                        )}`}
                      >
                        {log.module}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-800 text-sm">{log.action}</p>
                        <p className="text-xs text-gray-600 leading-relaxed">{log.details}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              ← Previous Page
            </button>

            <span className="text-xs text-gray-600 font-semibold">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              Next Page →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogViewer;
