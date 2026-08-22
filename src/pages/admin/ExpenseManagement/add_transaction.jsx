import React, { useState } from "react";
import {
  FiPlusCircle,
  FiDollarSign,
  FiCalendar,
  FiTag,
  FiCreditCard,
  FiFileText,
  FiCheckCircle,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";

const AddTransaction = () => {
  const categories = [
    // Expense Categories
    { value: "food", label: "🍽️ Food", type: "expense" },
    { value: "transportation", label: "🚗 Transportation", type: "expense" },
    { value: "utilities", label: "💡 Utilities", type: "expense" },
    { value: "supplies", label: "📦 Supplies", type: "expense" },
    { value: "rent", label: "🏠 Rent", type: "expense" },
    { value: "maintenance", label: "🔧 Maintenance", type: "expense" },
    { value: "salaries", label: "💼 Salaries", type: "expense" },
    { value: "marketing", label: "📢 Marketing", type: "expense" },
    { value: "taxes", label: "📋 Taxes", type: "expense" },
    { value: "insurance", label: "🛡️ Insurance", type: "expense" },
    {
      value: "professional_fees",
      label: "💵 Professional Fees",
      type: "expense",
    },
    { value: "other_expenses", label: "📝 Other Expenses", type: "expense" },
    // Income Categories
    { value: "sales", label: "💰 Sales", type: "income" },
    { value: "services", label: "⚙️ Services", type: "income" },
    { value: "interest", label: "📈 Interest", type: "income" },
    { value: "investments", label: "💎 Investments", type: "income" },
    { value: "other_income", label: "✨ Other Income", type: "income" },
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

  const [transaction, setTransaction] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    amount: "",
    category: "",
    paymentMethod: "cash",
    description: "",
    remarks: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({
      ...transaction,
      [name]: value,
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!transaction.date) {
      setError("Please select a date");
      return;
    }

    if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (!transaction.category) {
      setError("Please select a category");
      return;
    }

    if (!transaction.paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Determine base URL
      const isDev =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const baseUrl = isDev
        ? "http://localhost:5000"
        : "https://api.pranucollection.com";

      // Make actual API call to save transaction
      const response = await fetch(`${baseUrl}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Unable to save transaction. Please try again."
        );
      }

      const data = await response.json();

      // Show success animation
      setSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setTransaction({
          date: new Date().toISOString().split("T")[0],
          type: "expense",
          amount: "",
          category: "",
          paymentMethod: "cash",
          description: "",
          remarks: "",
        });
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError(
        error.message ||
          "Unable to save transaction. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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

  const filteredCategories = categories.filter(
    (cat) => cat.type === transaction.type
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Success Overlay */}
        {success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 shadow-2xl transform animate-scaleIn">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <FiCheckCircle className="text-green-600" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {transaction.type === "income"
                    ? "Income Added!"
                    : "Expense Added!"}
                </h3>
                <p className="text-gray-600 font-medium">
                  NPR {formatAmount(transaction.amount)} has been recorded
                  successfully
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <FiPlusCircle className="text-indigo-600 mr-3" size={36} />
            <h1 className="text-4xl font-bold text-gray-900">
              Add Transaction
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Record your income and expenses
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm animate-slideDown">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
          <div className="space-y-6">
            {/* Transaction Type Selector */}
            <div className="grid grid-cols-2 gap-4 p-2 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() =>
                  setTransaction({
                    ...transaction,
                    type: "expense",
                    category: "",
                  })
                }
                className={`py-4 px-6 rounded-xl font-bold transition-all transform ${
                  transaction.type === "expense"
                    ? "bg-red-500 text-white shadow-lg scale-105"
                    : "bg-transparent text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiTrendingDown className="inline mr-2" size={20} />
                Expense
              </button>
              <button
                type="button"
                onClick={() =>
                  setTransaction({
                    ...transaction,
                    type: "income",
                    category: "",
                  })
                }
                className={`py-4 px-6 rounded-xl font-bold transition-all transform ${
                  transaction.type === "income"
                    ? "bg-green-500 text-white shadow-lg scale-105"
                    : "bg-transparent text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FiTrendingUp className="inline mr-2" size={20} />
                Income
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Field */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FiCalendar className="text-blue-500" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={transaction.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 font-semibold"
                  required
                />
              </div>

              {/* Amount Field */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FiDollarSign className="text-green-500" />
                  Amount (NPR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-bold text-lg">
                    Rs.
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={transaction.amount}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none text-gray-900 font-bold text-lg"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {transaction.amount && (
                  <p className="text-xs text-gray-700 font-semibold">
                    Amount: NPR {formatAmount(transaction.amount)}
                  </p>
                )}
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FiTag className="text-purple-500" />
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={transaction.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none bg-white text-gray-900 font-semibold"
                  required
                >
                  <option value="" className="text-gray-500">
                    Select a category
                  </option>
                  {filteredCategories.map((cat) => (
                    <option
                      key={cat.value}
                      value={cat.value}
                      className="text-gray-900 font-medium"
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Payment Method Field */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                  <FiCreditCard className="text-orange-500" />
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <select
                  name="paymentMethod"
                  value={transaction.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none bg-white text-gray-900 font-semibold"
                  required
                >
                  {paymentMethods.map((method) => (
                    <option
                      key={method.value}
                      value={method.value}
                      className="text-gray-900 font-medium"
                    >
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-gray-600" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={transaction.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none text-gray-900 font-medium resize-none"
                placeholder="Enter transaction details..."
                rows="4"
                required
              />
            </div>

            {/* Remarks Field */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                <FiFileText className="text-gray-400" />
                Additional Remarks (Optional)
              </label>
              <input
                type="text"
                name="remarks"
                value={transaction.remarks}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all outline-none text-gray-900 font-medium"
                placeholder="Any additional notes..."
              />
            </div>

            {/* Transaction Summary */}
            {transaction.amount && transaction.category && (
              <div
                className={`p-5 rounded-2xl border-2 ${
                  transaction.type === "expense"
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiCheckCircle
                    className={
                      transaction.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  />
                  Transaction Summary
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Type:</p>
                    <p className="text-gray-900 font-bold">
                      {transaction.type === "expense"
                        ? "📤 Expense"
                        : "📥 Income"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Amount:</p>
                    <p
                      className={`font-bold text-lg ${
                        transaction.type === "expense"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      NPR {formatAmount(transaction.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Category:</p>
                    <p className="text-gray-900 font-bold">
                      {
                        filteredCategories.find(
                          (c) => c.value === transaction.category
                        )?.label
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Method:</p>
                    <p className="text-gray-900 font-bold">
                      {
                        paymentMethods.find(
                          (m) => m.value === transaction.paymentMethod
                        )?.label
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                transaction.type === "expense"
                  ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                  : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FiPlusCircle size={20} />
                  {transaction.type === "income" ? "Add Income" : "Add Expense"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddTransaction;
