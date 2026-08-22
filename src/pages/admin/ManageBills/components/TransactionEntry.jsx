import React, { useEffect, useState } from "react";
import {
  FiDollarSign,
  FiBriefcase,
  FiType,
  FiCreditCard,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const TransactionEntry = () => {
  const [formData, setFormData] = useState({
    party: "",
    type: "credit",
    amount: "",
    description: "",
    paymentMethod: "cash",
    chequeNumber: "",
  });
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    try {
      setLoading(true);
      const isDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const baseUrl = isDev
        ? "http://localhost:5000"
        : "https://api.pranucollection.com";

      const response = await fetch(`${baseUrl}/api/parties`);
      if (!response.ok) throw new Error("Failed to load businesses");

      const data = await response.json();
      setParties(data);
      setError(null);
    } catch (err) {
      console.error("Error loading parties:", err);
      setError("Failed to load businesses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.party) {
      setError("Please select a business");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const isDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const baseUrl = isDev
        ? "http://localhost:5000"
        : "https://api.pranucollection.com";

      const response = await fetch(`${baseUrl}/api/ledger/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save transaction");

      setSuccess("Transaction recorded successfully!");
      setFormData({
        party: "",
        type: "credit",
        amount: "",
        description: "",
        paymentMethod: "cash",
        chequeNumber: "",
      });

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving transaction:", err);
      setError("Failed to save transaction. Please try again.");
    }
  };

  const getTransactionTypeColor = () => {
    return formData.type === "credit"
      ? "from-green-500 to-emerald-600"
      : "from-red-500 to-rose-600";
  };

  const formatAmount = (value) => {
    if (!value) return "";
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <FiCheckCircle className="text-indigo-600 mr-3" size={36} />
            <h1 className="text-4xl font-bold text-gray-900">
              Transaction Entry
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Record financial transactions with your business partners
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

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="space-y-6">
            {/* Business Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiBriefcase className="text-blue-500" />
                Select Business Partner <span className="text-red-500">*</span>
              </label>
              {loading ? (
                <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                  Loading businesses...
                </div>
              ) : (
                <select
                  name="party"
                  value={formData.party}
                  onChange={(e) =>
                    setFormData({ ...formData, party: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white text-gray-900 font-medium"
                  required
                >
                  <option value="" className="text-gray-500">
                    Choose a business partner...
                  </option>
                  {parties.map((p) => (
                    <option key={p._id} value={p._id} className="text-gray-900">
                      {p.name} (
                      {p.type === "customer" ? "Customer" : "Supplier"})
                    </option>
                  ))}
                </select>
              )}
              {!loading && parties.length === 0 && (
                <p className="text-sm text-amber-600 flex items-center gap-1">
                  <FiAlertCircle size={14} />
                  No businesses found. Please add a business first.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Type */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiType className="text-purple-500" />
                  Transaction Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-white text-gray-900 font-medium"
                >
                  <option
                    value="credit"
                    className="text-green-700 font-semibold"
                  >
                    💰 Money to Receive (Credit)
                  </option>
                  <option value="debit" className="text-red-700 font-semibold">
                    💸 Money to Pay (Debit)
                  </option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === "credit"
                    ? "📥 Money you will receive from them"
                    : "📤 Money you will pay to them"}
                </p>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiDollarSign className="text-green-500" />
                  Amount (NPR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    Rs.
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 font-semibold"
                    required
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                  />
                </div>
                {formData.amount && (
                  <p className="text-xs text-gray-600 font-medium">
                    Amount: NPR {formatAmount(formData.amount)}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FiCreditCard className="text-orange-500" />
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none bg-white text-gray-900 font-medium"
                >
                  <option value="cash">💵 Cash</option>
                  <option value="cheque">📝 Cheque</option>
                  <option value="bank">🏦 Bank Transfer</option>
                  <option value="other">📋 Other</option>
                </select>
              </div>

              {/* Cheque Details */}
              {formData.paymentMethod === "cheque" && (
                <div className="space-y-2 animate-fadeIn">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FiFileText className="text-blue-400" />
                    Cheque Details
                  </label>
                  <input
                    name="chequeNumber"
                    value={formData.chequeNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, chequeNumber: e.target.value })
                    }
                    onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 font-medium"
                    placeholder="Cheque number and bank details"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiFileText className="text-gray-500" />
                Description / Notes
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none text-gray-900 font-medium resize-none"
                placeholder="Add transaction notes, purpose, invoice reference, or any additional details..."
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || parties.length === 0}
              className={`w-full bg-gradient-to-r ${getTransactionTypeColor()} text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              <FiCheckCircle className="text-xl" />
              {formData.type === "credit"
                ? "Record Money to Receive"
                : "Record Money to Pay"}
            </button>

            {/* Transaction Summary */}
            {formData.party && formData.amount && (
              <div
                className={`mt-4 p-4 bg-gradient-to-r ${
                  formData.type === "credit"
                    ? "from-green-50 to-emerald-50 border-green-200"
                    : "from-red-50 to-rose-50 border-red-200"
                } border-2 rounded-xl`}
              >
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FiCheckCircle
                    className={
                      formData.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  />
                  Transaction Summary
                </h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Business:</span>{" "}
                    {parties.find((p) => p._id === formData.party)?.name}
                  </p>
                  <p>
                    <span className="font-semibold">Type:</span>{" "}
                    {formData.type === "credit"
                      ? "📥 Money to Receive"
                      : "📤 Money to Pay"}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span>{" "}
                    <span className="text-lg font-bold">
                      NPR {formatAmount(formData.amount)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Method:</span>{" "}
                    {formData.paymentMethod.charAt(0).toUpperCase() +
                      formData.paymentMethod.slice(1)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionEntry;
