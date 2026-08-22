import React, { useState } from "react";
import { processReturn, getTransactionDetails } from "../../../Apis/Api";
import { toast } from "react-hot-toast";
import {
  FiPackage,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";

const NewReturnExchange = () => {
  const [transactionId, setTransactionId] = useState("");
  const [transaction, setTransaction] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTransaction = async () => {
    if (!transactionId.trim()) {
      toast.error("Please enter a transaction ID");
      return;
    }

    try {
      setLoading(true);
      const { data } = await getTransactionDetails(transactionId);

      if (!data.success) {
        toast.error("Transaction not found");
        setTransaction(null);
        return;
      }

      // Check if there are any items available for return
      const hasReturnableItems = data.data.items.some(
        (item) => item.remainingQuantity > 0
      );

      if (!hasReturnableItems) {
        toast.error(
          "All items from this transaction have already been returned"
        );
        setTransaction(null);
        return;
      }

      setTransaction(data.data);
      setSelectedItems([]);
      toast.success("Transaction loaded successfully");
    } catch (error) {
      console.error("Load transaction error:", error);
      toast.error(error.response?.data?.error || "Transaction not found");
      setTransaction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleItemSelect = (item) => {
    // Don't allow selection if no quantity remaining
    if (item.remainingQuantity <= 0) {
      toast.error("This item has already been fully returned");
      return;
    }

    setSelectedItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === item.productId &&
          i.size === item.size &&
          i.color === item.color
      );

      if (existing) {
        // Deselect the item
        return prev.filter((i) => i !== existing);
      }

      // Add new item
      return [
        ...prev,
        {
          productId: item.productId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: 1,
          originalPrice: item.price,
          maxQuantity: item.remainingQuantity,
          reason: "",
        },
      ];
    });
  };

  const updateReturnItem = (index, field, value) => {
    setSelectedItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "quantity"
                  ? Math.min(Math.max(Number(value) || 1, 1), item.maxQuantity)
                  : value,
            }
          : item
      )
    );
  };

  // IMPROVED: Better handling of missing discount data
  const getDiscountRate = () => {
    if (!transaction) return 0;

    // If subtotal and discount exist, calculate rate
    if (transaction.subtotal && transaction.discount) {
      return transaction.discount / transaction.subtotal;
    }

    // Fallback: calculate from totalAmount if available
    if (transaction.totalAmount && transaction.subtotal) {
      const discountAmount = transaction.subtotal - transaction.totalAmount;
      if (discountAmount > 0) {
        return discountAmount / transaction.subtotal;
      }
    }

    return 0;
  };

  const calculateTotalRefund = () => {
    const discountRate = getDiscountRate();

    return selectedItems.reduce((sum, item) => {
      const itemTotal = item.originalPrice * item.quantity;
      const itemAfterDiscount = itemTotal * (1 - discountRate);
      return sum + itemAfterDiscount;
    }, 0);
  };

  const handleReturnSubmit = async () => {
    // Validate all items have required fields
    if (!selectedItems.every((item) => item.quantity > 0 && item.reason)) {
      toast.error("Please fill quantity and reason for all selected items");
      return;
    }

    // Confirm before processing
    const totalRefund = calculateTotalRefund();

    // IMPROVED: Better confirmation dialog
    const confirmed = window.confirm(
      `Process return for NPR ${totalRefund.toFixed(2)}?\n\n` +
        `Items: ${selectedItems.length}\n` +
        `Customer: ${transaction.customer.name}`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      const { data } = await processReturn({
        transactionId: transaction._id,
        returnedItems: selectedItems,
      });

      if (data.success) {
        toast.success(
          `Return processed successfully! Refund: NPR ${data.data.refundAmount.toFixed(
            2
          )}`
        );

        // Reset form
        setTransaction(null);
        setSelectedItems([]);
        setTransactionId("");
      } else {
        toast.error(data.error || "Return processing failed");
      }
    } catch (error) {
      console.error("Return submit error:", error);
      // IMPROVED: Better error message
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Return processing failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // IMPROVED: Remove selected item handler
  const removeSelectedItem = (index) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
        <FiPackage className="text-blue-600" />
        <span>Process Returns</span>
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Transaction Search */}
          <div className="space-y-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Invoice / Receipt Number
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && loadTransaction()}
                  placeholder="Enter Transaction ID, Receipt Number, or Invoice Number"
                  className="w-full text-gray-900 pl-10 pr-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={loadTransaction}
                disabled={!transactionId.trim() || loading}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? "Searching..." : "Find Transaction"}
              </button>
            </div>

            {transaction && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-3 text-lg text-gray-900">
                  Original Purchase
                </h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Receipt #:</span>
                    <span className="font-medium text-gray-900">
                      {transaction.receiptNumber || transaction.invoiceNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer:</span>
                    <span className="font-medium text-gray-900">
                      {transaction.customer.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">
                      {transaction.customer.phone}
                    </span>
                  </div>
                  {transaction.subtotal && transaction.discount > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium text-gray-900">
                          NPR {transaction.subtotal?.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount:</span>
                        <span className="font-medium text-red-600">
                          - NPR {transaction.discount?.toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between border-t border-gray-300 pt-2">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-bold text-gray-900">
                      NPR {transaction.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold mb-2 text-gray-900">
                  Available Items for Return
                </h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {transaction.items.map((item, index) => {
                    const discountRate = getDiscountRate();
                    const discountedPrice = item.price * (1 - discountRate);
                    const isSelected = selectedItems.some(
                      (si) =>
                        si.productId === item.productId &&
                        si.size === item.size &&
                        si.color === item.color
                    );
                    const isReturnable = item.remainingQuantity > 0;

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded border transition-all ${
                          !isReturnable
                            ? "bg-gray-100 cursor-not-allowed opacity-60 border-gray-300"
                            : isSelected
                            ? "bg-blue-50 border-blue-400 shadow-sm"
                            : "hover:bg-gray-50 border-gray-300 cursor-pointer hover:border-gray-400"
                        }`}
                        onClick={() => isReturnable && handleItemSelect(item)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              Size: {item.size} | Color: {item.color}
                            </div>
                            <div className="text-sm mt-1">
                              <span className="text-gray-600">Price: </span>
                              {discountRate > 0 ? (
                                <>
                                  <span className="line-through text-gray-500 mr-2">
                                    NPR {item.price.toFixed(2)}
                                  </span>
                                  <span className="font-medium text-green-700">
                                    NPR {discountedPrice.toFixed(2)}
                                  </span>
                                </>
                              ) : (
                                <span className="font-medium text-gray-900">
                                  NPR {item.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {isReturnable ? (
                              <>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                                  Available: {item.remainingQuantity}
                                </span>
                                {isSelected ? (
                                  <FiCheckCircle className="text-green-600 text-xl" />
                                ) : (
                                  <FiXCircle className="text-gray-400 text-xl" />
                                )}
                              </>
                            ) : (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center gap-1 font-medium">
                                <FiAlertCircle /> Fully Returned
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Selected Items */}
          <div className="space-y-4">
            {selectedItems.length > 0 ? (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h3 className="font-semibold mb-4 text-lg text-gray-900">
                  Selected Items for Return ({selectedItems.length})
                </h3>

                {transaction?.discount > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-300 rounded">
                    <div className="text-sm text-blue-900">
                      <strong>Note:</strong> A{" "}
                      {(getDiscountRate() * 100).toFixed(1)}% discount was
                      applied to this transaction. The refund amount will
                      reflect the discounted price paid.
                    </div>
                  </div>
                )}

                <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                  {selectedItems.map((item, index) => {
                    const discountRate = getDiscountRate();
                    const itemTotal = item.originalPrice * item.quantity;
                    const itemAfterDiscount = itemTotal * (1 - discountRate);

                    return (
                      <div
                        key={index}
                        className="p-3 bg-white rounded border border-gray-300 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.size} / {item.color}
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="text-right">
                              {discountRate > 0 ? (
                                <>
                                  <div className="text-xs line-through text-gray-500">
                                    NPR {item.originalPrice.toFixed(2)}
                                  </div>
                                  <div className="font-medium text-green-700">
                                    NPR{" "}
                                    {(
                                      item.originalPrice *
                                      (1 - discountRate)
                                    ).toFixed(2)}
                                  </div>
                                </>
                              ) : (
                                <div className="font-medium text-gray-900">
                                  NPR {item.originalPrice.toFixed(2)}
                                </div>
                              )}
                              <div className="text-xs text-gray-600">
                                Max: {item.maxQuantity}
                              </div>
                            </div>
                            {/* NEW: Remove button */}
                            <button
                              onClick={() => removeSelectedItem(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Remove item"
                            >
                              <FiXCircle className="text-xl" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              min="1"
                              max={item.maxQuantity}
                              value={item.quantity}
                              onChange={(e) =>
                                updateReturnItem(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Reason *
                            </label>
                            <select
                              value={item.reason}
                              onChange={(e) =>
                                updateReturnItem(
                                  index,
                                  "reason",
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                            >
                              <option value="">Select...</option>
                              <option value="Defective">Defective</option>
                              <option value="Wrong Size">Wrong Size</option>
                              <option value="Wrong Color">Wrong Color</option>
                              <option value="Customer Request">
                                Customer Request
                              </option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-right">
                          <div className="space-y-1">
                            {discountRate > 0 && (
                              <div className="text-gray-500 line-through">
                                Original: NPR {itemTotal.toFixed(2)}
                              </div>
                            )}
                            <div className="font-semibold text-green-700">
                              Subtotal: NPR {itemAfterDiscount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-300 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-900">Total Refund:</span>
                    <span className="text-red-600">
                      NPR {calculateTotalRefund().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleReturnSubmit}
                    disabled={
                      loading || !selectedItems.every((item) => item.reason)
                    }
                    className="w-full bg-red-600 text-white py-3 rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {loading ? "Processing..." : "Process Return"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-8 text-center bg-gray-50">
                <FiPackage className="mx-auto text-4xl mb-2 text-gray-400" />
                <p className="text-gray-600">
                  {transaction
                    ? "Select items from the transaction to process return"
                    : "Search for a transaction to begin"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReturnExchange;
