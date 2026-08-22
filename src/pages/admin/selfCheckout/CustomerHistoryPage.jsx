import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerHistory } from "../../../Apis/Api";
import { toast } from "react-hot-toast";
import {
  FiUser,
  FiShoppingBag,
  FiClock,
  FiDollarSign,
  FiSearch,
  FiArrowLeft,
} from "react-icons/fi";

const CustomerHistoryPage = () => {
  const [phone, setPhone] = useState("");
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  const fetchCustomerHistory = async (phoneNumber) => {
    try {
      setLoading(true);
      const { data } = await getCustomerHistory(phoneNumber);
      setHistory(data);
    } catch (error) {
      toast.error("Customer not found or no purchases");
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(input);

    if (searchTimeout) clearTimeout(searchTimeout);

    if (input.length === 10) {
      setSearchTimeout(setTimeout(() => fetchCustomerHistory(input), 500));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
        <FiUser className="text-blue-600" />
        <span>Customer Purchase History</span>
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Enter customer phone number (10 digits)"
            className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            maxLength="10"
          />
        </div>
        {phone && phone.length < 10 && (
          <p className="mt-2 text-xs text-gray-600">
            {10 - phone.length} more digit{10 - phone.length !== 1 ? "s" : ""}{" "}
            needed
          </p>
        )}
      </div>

      {loading && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Searching for customer...</p>
        </div>
      )}

      {history && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <span>
                {history.checkouts[0]?.customer?.name || "Guest Customer"}
              </span>
              <span className="text-base font-normal text-gray-600">
                ({phone})
              </span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Total Transactions
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {history.summary.totalTransactions}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Total Spent
                </div>
                <div className="text-2xl font-bold text-green-700">
                  NPR {history.summary.totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  First Purchase
                </div>
                <div className="text-base font-semibold text-purple-700 mt-1">
                  {new Date(history.summary.firstPurchase).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Total Items
                </div>
                <div className="text-2xl font-bold text-orange-700">
                  {history.summary.totalItems}
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {history.checkouts.map((checkout, index) => (
              <div
                key={checkout._id}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold flex items-center gap-2 text-gray-900">
                      <FiClock className="text-gray-600" />
                      <span>
                        {new Date(checkout.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 capitalize font-medium">
                        {checkout.paymentMethod}
                      </span>
                    </div>
                    {checkout.remarks && (
                      <div className="text-sm text-gray-600 mt-1.5 italic">
                        "{checkout.remarks}"
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-700">
                      NPR {checkout.totalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {checkout.cart.length} item
                      {checkout.cart.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid gap-2">
                  {checkout.cart.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mr-2">
                            {item.quantity}
                          </span>
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 ml-8">
                          <span className="font-medium">Size:</span> {item.size}
                          <span className="mx-2">•</span>
                          <span className="font-medium">Color:</span>{" "}
                          {item.color}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-gray-900">
                          NPR {(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          NPR {item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {checkout.discount && checkout.discount > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Discount Applied
                      </span>
                      <span className="font-bold text-green-700">
                        - NPR {checkout.discount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {history.checkouts.length === 0 && (
            <div className="p-8 text-center text-gray-600">
              <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-2" />
              <p>No purchase history found</p>
            </div>
          )}
        </div>
      )}

      {!history && !loading && phone.length === 10 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FiUser className="mx-auto text-4xl text-gray-400 mb-2" />
          <p className="text-gray-600">
            No customer found with this phone number
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerHistoryPage;
