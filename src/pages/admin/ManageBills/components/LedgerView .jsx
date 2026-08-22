import React, { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
  FiCalendar,
  FiFileText,
  FiBriefcase,
} from "react-icons/fi";

const LedgerView = () => {
  const [parties, setParties] = useState([]);
  const [selected, setSelected] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingTxn, setDeletingTxn] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const getBaseUrl = () => {
    const isDev =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    return isDev ? "http://localhost:5000" : "https://api.pranucollection.com";
  };

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();

      const [partiesRes, summaryRes] = await Promise.all([
        fetch(`${baseUrl}/api/parties`),
        fetch(`${baseUrl}/api/ledger/summary`),
      ]);

      if (!partiesRes.ok) throw new Error("Failed to load businesses");
      if (!summaryRes.ok) throw new Error("Failed to load summary");

      const partiesData = await partiesRes.json();
      const summaryData = await summaryRes.json();

      setParties(partiesData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadLedger = async (id) => {
    if (!id) return;

    try {
      setSelected(id);
      setLoading(true);
      const baseUrl = getBaseUrl();

      const [txnsRes, balRes] = await Promise.all([
        fetch(`${baseUrl}/api/ledger/take`),
        fetch(`${baseUrl}/api/ledger/balance/${id}`),
      ]);

      if (!txnsRes.ok || !balRes.ok) throw new Error("Failed to load ledger");

      const txnsData = await txnsRes.json();
      const balData = await balRes.json();

      const filtered = txnsData.filter(
        (t) => t.party === id || (t.party && t.party._id === id)
      );

      setTransactions(filtered);
      setBalance(balData.balance);
      setError(null);
    } catch (err) {
      console.error("Error loading ledger:", err);
      setError("Failed to load ledger. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (txn) => {
    setDeletingTxn(txn);
    setConfirmText("");
    setShowModal(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    if (confirmText !== "DELETE") {
      setError("Please type DELETE to confirm");
      return;
    }

    if (!deletingTxn) return;

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/ledger/${deletingTxn._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      setTransactions((prev) => prev.filter((t) => t._id !== deletingTxn._id));

      const balRes = await fetch(`${baseUrl}/api/ledger/balance/${selected}`);
      const balData = await balRes.json();
      setBalance(balData.balance);

      setShowModal(false);
      setDeletingTxn(null);
      setConfirmText("");
      setSuccess("Transaction deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction.");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <FiFileText className="text-indigo-600 mr-3" size={36} />
            <h1 className="text-4xl font-bold text-gray-900">Ledger View</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Track all financial transactions with your business partners
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <FiCheckCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex items-center mb-4">
                <FiAlertCircle className="text-red-500 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">
                  Confirm Deletion
                </h2>
              </div>

              <p className="mb-4 text-sm text-gray-700">
                Are you sure you want to delete this transaction?
                <br />
                <span className="font-semibold text-red-600">
                  This action cannot be undone.
                </span>
              </p>

              {deletingTxn && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">Amount:</span>{" "}
                    {formatCurrency(deletingTxn.amount)}
                  </p>
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">Type:</span>{" "}
                    {deletingTxn.type === "credit"
                      ? "Money to Take"
                      : "Money to Give"}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Type <span className="text-red-600 font-bold">DELETE</span> to
                  confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-gray-900 font-semibold"
                  placeholder="Type DELETE"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setDeletingTxn(null);
                    setConfirmText("");
                  }}
                  className="px-6 py-2.5 text-sm font-semibold bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== "DELETE"}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Delete Transaction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Customer Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <FiTrendingUp className="text-blue-600 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Summary
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Net Balance:
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      summary.customers.netBalance === 0
                        ? "text-gray-600"
                        : summary.customers.netBalance > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(summary.customers.netBalance))}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600">
                    Status:
                    <span className="ml-2 font-bold text-gray-900">
                      {summary.customers.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Supplier Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-orange-500">
              <div className="flex items-center mb-4">
                <FiTrendingDown className="text-orange-600 mr-3" size={28} />
                <h3 className="text-xl font-bold text-gray-900">
                  Supplier Summary
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Net Balance:
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      summary.suppliers.netBalance === 0
                        ? "text-gray-600"
                        : summary.suppliers.netBalance > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(summary.suppliers.netBalance))}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-600">
                    Status:
                    <span className="ml-2 font-bold text-gray-900">
                      {summary.suppliers.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiBriefcase className="text-indigo-500" />
            Select Business to View Ledger:
          </label>
          {loading && !selected ? (
            <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium">
              Loading businesses...
            </div>
          ) : (
            <select
              onChange={(e) => loadLedger(e.target.value)}
              value={selected}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white text-gray-900 font-semibold transition-all"
            >
              <option value="" className="text-gray-500">
                Choose a business...
              </option>
              {parties.map((p) => (
                <option
                  key={p._id}
                  value={p._id}
                  className="text-gray-900 font-medium"
                >
                  {p.name} ({p.type.toUpperCase()})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Balance Display */}
        {balance !== null && selected && (
          <div
            className={`mb-8 rounded-2xl shadow-xl p-8 border-2 ${
              balance > 0
                ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-300"
                : balance < 0
                ? "bg-gradient-to-br from-red-50 to-rose-50 border-red-300"
                : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300"
            }`}
          >
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                {balance > 0 ? (
                  <FiTrendingUp className="text-green-600 mr-3" size={32} />
                ) : balance < 0 ? (
                  <FiTrendingDown className="text-red-600 mr-3" size={32} />
                ) : (
                  <FiCheckCircle className="text-gray-600 mr-3" size={32} />
                )}
                <h3 className="text-2xl font-bold text-gray-900">
                  {balance > 0
                    ? "Money to Receive"
                    : balance < 0
                    ? "Money to Pay"
                    : "All Settled"}
                </h3>
              </div>
              <div
                className={`text-5xl font-bold mb-3 ${
                  balance > 0
                    ? "text-green-600"
                    : balance < 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {formatCurrency(Math.abs(balance))}
              </div>
              {balance !== 0 && (
                <p className="text-gray-700 font-medium">
                  {balance > 0
                    ? "📥 This business owes you money"
                    : "📤 You need to pay this business"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Transactions Table */}
        {selected && transactions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
              <h3 className="text-2xl font-bold text-white flex items-center">
                <FiFileText className="mr-2" />
                Transaction History
                <span className="ml-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {transactions.length}{" "}
                  {transactions.length === 1 ? "Transaction" : "Transactions"}
                </span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiCalendar size={14} />
                        Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <FiDollarSign size={14} />
                        Amount
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((t) => (
                    <tr
                      key={t._id}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatDate(t.transactionDate)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border-2 ${
                            t.type === "credit"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          }`}
                        >
                          {t.type === "credit" ? "📥 To Receive" : "📤 To Pay"}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 font-bold text-base ${
                          t.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 capitalize">
                        {t.paymentMethod}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {t.description || "No additional details"}
                        {t.chequeNumber && (
                          <div className="text-xs text-gray-500 mt-1">
                            Cheque #{t.chequeNumber}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => confirmDelete(t)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-100 px-3 py-2 rounded-lg transition-all flex items-center gap-1 text-sm font-semibold"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selected && transactions.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <FiFileText className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Transactions Found
            </h3>
            <p className="text-gray-600">
              There are no transactions recorded for this business yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LedgerView;
