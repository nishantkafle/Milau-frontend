import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiDownload,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

const ViewTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    paymentMethod: "",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const categories = [
    { value: "food", label: "🍽️ Food" },
    { value: "transportation", label: "🚗 Transportation" },
    { value: "utilities", label: "💡 Utilities" },
    { value: "supplies", label: "📦 Supplies" },
    { value: "rent", label: "🏠 Rent" },
    { value: "maintenance", label: "🔧 Maintenance" },
    { value: "salaries", label: "💼 Salaries" },
    { value: "marketing", label: "📢 Marketing" },
    { value: "taxes", label: "📋 Taxes" },
    { value: "insurance", label: "🛡️ Insurance" },
    { value: "professional_fees", label: "💵 Professional Fees" },
    { value: "other_expenses", label: "📝 Other Expenses" },
    { value: "sales", label: "💰 Sales" },
    { value: "services", label: "⚙️ Services" },
    { value: "interest", label: "📈 Interest" },
    { value: "investments", label: "💎 Investments" },
    { value: "other_income", label: "✨ Other Income" },
  ];

  const paymentMethods = [
    { value: "cash", label: "💵 Cash" },
    { value: "bank_transfer", label: "🏦 Bank Transfer" },
    { value: "esewa", label: "📱 eSewa" },
    { value: "fonepay", label: "📲 FonePay" },
    { value: "khalti", label: "💳 Khalti" },
    { value: "credit_card", label: "💳 Credit Card" },
    { value: "debit_card", label: "💳 Debit Card" },
    { value: "other_digital", label: "📱 Other Digital" },
  ];

  useEffect(() => {
    fetchTransactions();
  }, [filters, currentPage]);

  const getBaseUrl = () => {
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    return isDev ? "http://localhost:5000" : "https://api.pranucollection.com";
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const queryParams = new URLSearchParams({
        ...filters,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });

      const response = await fetch(`${baseUrl}/api/expenses?${queryParams}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      setTransactions(data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/api/expenses/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete");

        setSuccess("Transaction deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
        fetchTransactions();
      } catch (error) {
        setError("Failed to delete transaction");
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setCurrentPage(1);
  };

  const formatDisplayName = (value) => {
    const item = [...categories, ...paymentMethods].find(
      (item) => item.value === value
    );
    return item
      ? item.label
      : value.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateSummary = () => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, net: income - expense };
  };

  const summary = calculateSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <FiFileText className="text-indigo-600" />
                Transaction Records
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                View and manage all your transactions
              </p>
            </div>
            <button
              onClick={() =>
                alert("Export feature - integrate with your export function")
              }
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <FiDownload size={20} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
            <p className="text-green-800 font-medium">{success}</p>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Income
                </p>
                <p className="text-3xl font-bold text-green-600">
                  NPR {formatAmount(summary.income)}
                </p>
              </div>
              <FiTrendingUp className="text-green-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Expense
                </p>
                <p className="text-3xl font-bold text-red-600">
                  NPR {formatAmount(summary.expense)}
                </p>
              </div>
              <FiTrendingDown className="text-red-500" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Net Balance
                </p>
                <p
                  className={`text-3xl font-bold ${
                    summary.net >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  NPR {formatAmount(Math.abs(summary.net))}
                </p>
              </div>
              <FiDollarSign
                className={summary.net >= 0 ? "text-green-500" : "text-red-500"}
                size={40}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-indigo-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Filter Transactions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-gray-900 font-semibold"
              >
                <option value="">All Types</option>
                <option value="income">💰 Income</option>
                <option value="expense">💸 Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-gray-900 font-semibold"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={filters.paymentMethod}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-gray-900 font-semibold"
              >
                <option value="">All Methods</option>
                {paymentMethods.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                <FiCalendar size={14} />
                From Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                <FiCalendar size={14} />
                To Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 font-semibold"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={fetchTransactions}
              className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
            >
              <FiSearch size={20} />
              Search Transactions
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <FiFileText className="mr-2" />
              All Transactions
              {!loading && (
                <span className="ml-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {transactions.length}{" "}
                  {transactions.length === 1 ? "Transaction" : "Transactions"}
                </span>
              )}
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading transactions...
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-12 text-center">
              <FiFileText className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg font-medium">
                No transactions found
              </p>
              <p className="text-gray-400 mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Remarks
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr
                        key={transaction._id}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-800 border-green-300"
                                : "bg-red-100 text-red-800 border-red-300"
                            }`}
                          >
                            {transaction.type === "income"
                              ? "📥 Income"
                              : "📤 Expense"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatDisplayName(transaction.category)}
                        </td>
                        <td
                          className={`px-6 py-4 text-right font-bold text-base ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"} NPR{" "}
                          {formatAmount(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatDisplayName(transaction.paymentMethod)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium max-w-xs truncate">
                          {transaction.description || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 font-medium max-w-xs truncate">
                          {transaction.remarks || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() =>
                                alert(
                                  "Edit feature - integrate with your modal"
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 p-2 rounded-lg transition-all"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(transaction._id)}
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

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-200">
                <div className="text-sm text-gray-700 font-semibold">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, transactions.length)} of{" "}
                  {transactions.length} entries
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-2 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={transactions.length < itemsPerPage}
                    className="px-6 py-2 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTransactions;
