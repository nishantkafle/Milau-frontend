import React, { useState, useEffect } from "react";
import {
  getAllCheckouts,
  getDailySales,
  getProductAnalytics,
} from "../../../Apis/Api";
import * as XLSX from "xlsx";
import { Chart, registerables } from "chart.js";
import { toast } from "react-hot-toast";
import {
  FiDollarSign,
  FiShoppingBag,
  FiPieChart,
  FiFileText,
  FiCreditCard,
  FiTrendingUp,
  FiDownload,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";
Chart.register(...registerables);

const NewGetCheckoutAdmin = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [filteredCheckouts, setFilteredCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchCheckouts();
  }, []);

  useEffect(() => {
    let filtered = checkouts;

    // FILTER OUT CHECKOUTS WITH ZERO PROFIT (fully returned transactions)
    filtered = filtered.filter((checkout) => {
      return (checkout.totalProfit || 0) !== 0;
    });

    if (startDate || endDate) {
      filtered = filtered.filter((checkout) => {
        if (!checkout.createdAt) return false;

        const checkoutDate = new Date(checkout.createdAt);

        if (startDate && endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return checkoutDate >= start && checkoutDate <= end;
        }

        if (startDate && !endDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          return checkoutDate >= start;
        }

        if (!startDate && endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return checkoutDate <= end;
        }

        return true;
      });
    }

    setFilteredCheckouts(filtered);
  }, [checkouts, startDate, endDate]);

  const fetchCheckouts = async () => {
    try {
      const { data } = await getAllCheckouts();
      console.log("Checkouts Response:", data);

      if (data.success) {
        // Sort by date (newest first)
        const sortedData = data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setCheckouts(sortedData);
        setFilteredCheckouts(sortedData);
      } else {
        toast.error("Failed to fetch checkout records.");
        setCheckouts([]);
        setFilteredCheckouts([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching checkout records.");
      setCheckouts([]);
      setFilteredCheckouts([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalStats = () => {
    const total = filteredCheckouts.reduce(
      (sum, c) => sum + (c.totalAmount || 0),
      0
    );
    const totalProfit = filteredCheckouts.reduce(
      (sum, c) => sum + (c.totalProfit || 0),
      0
    );
    const totalCost = filteredCheckouts.reduce(
      (sum, c) => sum + (c.totalCost || 0),
      0
    );
    const totalQuantity = filteredCheckouts.reduce(
      (sum, c) =>
        sum +
        (c.cart?.reduce((pSum, item) => {
          const costPrice =
            item.costPrice || item.productId?.price || item.price || 0;
          const sellingPrice = item.price || 0;
          const quantity = item.quantity || 1;
          const itemProfit = (sellingPrice - costPrice) * quantity;
          // Only count non-returned items
          return itemProfit !== 0 ? pSum + quantity : pSum;
        }, 0) || 0),
      0
    );

    return { total, totalProfit, totalCost, totalQuantity };
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      amount = 0;
    }
    return `NPR ${(amount || 0).toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const exportToExcel = () => {
    if (!filteredCheckouts || filteredCheckouts.length === 0) {
      toast.error("No checkout records to export.");
      return;
    }

    const checkoutData = filteredCheckouts.map((checkout, index) => {
      const productDetails =
        checkout.cart
          ?.filter((item) => {
            const costPrice =
              item.costPrice || item.productId?.price || item.price || 0;
            const sellingPrice = item.price || 0;
            const quantity = item.quantity || 1;
            const itemProfit = (sellingPrice - costPrice) * quantity;
            return itemProfit !== 0; // Only include non-returned items
          })
          .map((item) => {
            const costPrice = item.costPrice || 0;
            const sellingPrice = item.price || 0;
            const quantity = item.quantity || 0;
            const totalCost = costPrice * quantity;
            const totalSelling = sellingPrice * quantity;
            const itemProfit = totalSelling - totalCost;

            return [
              `Name: ${item.productName || item.name || "N/A"}`,
              `Size: ${item.size || "N/A"}`,
              `Color: ${item.color || "N/A"}`,
              `Quantity: ${quantity}`,
              `Cost Price/unit: NPR ${costPrice}`,
              `Selling Price/unit: NPR ${sellingPrice}`,
              `Total Cost: NPR ${totalCost}`,
              `Total Selling: NPR ${totalSelling}`,
              `Item Profit: NPR ${itemProfit}`,
            ].join("\n");
          })
          .join("\n\n") || "No products";

      const paymentMethods = {
        Cash: checkout.paymentMethod === "cash" ? checkout.totalAmount : 0,
        Esewa: checkout.paymentMethod === "esewa" ? checkout.totalAmount : 0,
        "Fone Pay":
          checkout.paymentMethod === "fonepay" ? checkout.totalAmount : 0,
        Khalti: checkout.paymentMethod === "khalti" ? checkout.totalAmount : 0,
      };

      return {
        "S.N": index + 1,
        "Invoice Number": checkout.invoiceNumber || "N/A",
        "Date & Time": `${new Date(
          checkout.createdAt
        ).toLocaleDateString()} ${new Date(
          checkout.createdAt
        ).toLocaleTimeString()}`,
        "Product Details": productDetails,
        "Payment Method":
          checkout.paymentMethod?.charAt(0).toUpperCase() +
            checkout.paymentMethod?.slice(1) || "N/A",
        Quantity:
          checkout.cart?.reduce((total, item) => {
            const costPrice =
              item.costPrice || item.productId?.price || item.price || 0;
            const sellingPrice = item.price || 0;
            const quantity = item.quantity || 1;
            const itemProfit = (sellingPrice - costPrice) * quantity;
            return itemProfit !== 0 ? total + quantity : total;
          }, 0) || 0,
        "Customer Name": checkout.customer?.name || "N/A",
        "Customer Mobile Number": checkout.customer?.phone || "N/A",
        Remarks: checkout.remarks || "N/A",
        Subtotal: checkout.subtotal || 0,
        Discount: checkout.discount || 0,
        "VAT Amount": checkout.vatAmount || 0,
        Cash: paymentMethods["Cash"],
        Esewa: paymentMethods["Esewa"],
        "Fone Pay": paymentMethods["Fone Pay"],
        Khalti: paymentMethods["Khalti"],
        "Total Amount": checkout.totalAmount || 0,
        "Total Cost": checkout.totalCost || 0,
        "Profit Made": checkout.totalProfit || 0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(checkoutData);
    const totalRows = checkoutData.length + 1;

    const footerRow = {
      "S.N": "",
      "Invoice Number": "",
      "Date & Time": "",
      "Product Details": "",
      "Payment Method": "",
      Quantity: "",
      "Customer Name": "",
      "Customer Mobile Number": "",
      Remarks: "",
      Subtotal: "",
      Discount: "",
      "VAT Amount": "",
      Cash: {
        t: "s",
        f: `"Grand Total in Cash: NPR " & TEXT(SUM(M2:M${totalRows}), "#,##0.00")`,
      },
      Esewa: {
        t: "s",
        f: `"Grand Total in Esewa: NPR " & TEXT(SUM(N2:N${totalRows}), "#,##0.00")`,
      },
      "Fone Pay": {
        t: "s",
        f: `"Grand Total in Fone Pay: NPR " & TEXT(SUM(O2:O${totalRows}), "#,##0.00")`,
      },
      Khalti: {
        t: "s",
        f: `"Grand Total in Khalti: NPR " & TEXT(SUM(P2:P${totalRows}), "#,##0.00")`,
      },
      "Total Amount": {
        t: "s",
        f: `"Grand Total: NPR " & TEXT(SUM(Q2:Q${totalRows}), "#,##0.00")`,
      },
      "Total Cost": {
        t: "s",
        f: `"Total Cost: NPR " & TEXT(SUM(R2:R${totalRows}), "#,##0.00")`,
      },
      "Profit Made": {
        t: "s",
        f: `"Total Profit: NPR " & TEXT(SUM(S2:S${totalRows}), "#,##0.00")`,
      },
    };

    XLSX.utils.sheet_add_json(ws, [footerRow], {
      skipHeader: true,
      origin: -1,
    });

    const colWidths = Object.keys(checkoutData[0]).map((key) => {
      switch (key) {
        case "Product Details":
          return { wch: 60 };
        case "Invoice Number":
          return { wch: 20 };
        case "Cash":
        case "Esewa":
        case "Fone Pay":
        case "Khalti":
          return { wch: 22 };
        case "Total Amount":
        case "Total Cost":
        case "Profit Made":
          return { wch: 20 };
        default:
          return { wch: 18 };
      }
    });
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Checkouts");
    XLSX.writeFile(
      wb,
      `Checkouts_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    toast.success("Excel file exported successfully!");
  };

  const StatCard = ({ icon, title, value, secondary, gradient, loading }) => (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold opacity-90 mb-2">{title}</p>
          {loading ? (
            <div className="animate-pulse h-10 w-32 bg-white/30 rounded mt-2"></div>
          ) : (
            <h1 className="text-4xl font-bold mb-1">{value}</h1>
          )}
          {secondary && <p className="text-xs opacity-80 mt-2">{secondary}</p>}
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  const { total, totalProfit, totalCost, totalQuantity } = getTotalStats();
  const profitMargin = total > 0 ? (totalProfit / total) * 100 : 0;

  const uniqueCustomers = Array.isArray(filteredCheckouts)
    ? new Set(
        filteredCheckouts
          .map((c) => c?.customer?.phone)
          .filter((phone) => phone && phone !== "null")
      ).size
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">
            Loading sales data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-8 px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <FiPieChart className="text-blue-600" size={36} />
              Sales Analytics Dashboard
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <FiCalendar className="w-4 h-4" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {startDate || endDate
                ? ` | Filtered: ${startDate || "Start"} to ${endDate || "End"}`
                : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 items-center bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border-2 border-blue-200 shadow-sm">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm font-medium"
              />
              <span className="text-gray-500 font-semibold">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-sm font-medium"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="ml-2 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              onClick={exportToExcel}
              disabled={filteredCheckouts.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiDownload size={20} /> Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FiDollarSign size={28} />}
            title="Total Revenue"
            value={formatCurrency(total)}
            secondary={`${filteredCheckouts.length} transactions`}
            gradient="from-blue-500 to-blue-600 text-white"
            loading={false}
          />
          <StatCard
            icon={<FiShoppingBag size={28} />}
            title="Products Sold"
            value={totalQuantity}
            secondary={`${uniqueCustomers} unique customers`}
            gradient="from-green-500 to-emerald-600 text-white"
            loading={false}
          />
          <StatCard
            icon={<FiTrendingUp size={28} />}
            title="Net Profit"
            value={formatCurrency(totalProfit)}
            secondary={`${profitMargin.toFixed(2)}% margin`}
            gradient="from-purple-500 to-purple-600 text-white"
            loading={false}
          />
          <StatCard
            icon={<FiBarChart2 size={28} />}
            title="Total Cost"
            value={formatCurrency(totalCost)}
            secondary={`Average: ${formatCurrency(
              totalCost / (filteredCheckouts.length || 1)
            )}`}
            gradient="from-orange-500 to-red-600 text-white"
            loading={false}
          />
        </div>

        {/* Payment Methods Breakdown */}
        {filteredCheckouts.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiCreditCard className="text-blue-600" />
              Payment Methods Overview
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(
                filteredCheckouts.reduce((acc, c) => {
                  const method = c.paymentMethod || "unknown";
                  acc[method] = (acc[method] || 0) + 1;
                  return acc;
                }, {})
              ).map(([method, count]) => (
                <div
                  key={method}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="text-sm font-semibold text-gray-600 uppercase mb-2">
                    {method}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">
                    {count}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((count / filteredCheckouts.length) * 100).toFixed(1)}% of
                    total
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-slate-600 text-sm">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredCheckouts.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {checkouts.length}
          </span>{" "}
          records
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FiFileText size={24} />
              Transaction Details
            </h2>
          </div>

          {filteredCheckouts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <svg
                className="w-16 h-16 text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-slate-600 text-lg font-medium">
                No checkout records found
              </p>
              <p className="text-slate-500 text-sm">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      #
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Invoice
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Date & Time
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      Product Details
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Payment
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold whitespace-nowrap">
                      Total
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold whitespace-nowrap">
                      Cost
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold whitespace-nowrap">
                      Profit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCheckouts.map((checkout, index) => {
                    return (
                      <tr
                        key={checkout._id}
                        className="hover:bg-slate-50 transition"
                      >
                        <td className="px-4 py-4 text-sm text-slate-700 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-black">
                            {checkout.invoiceNumber || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">
                          <div className="font-medium">
                            {new Date(checkout.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {new Date(checkout.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {checkout.cart && checkout.cart.length > 0 ? (
                            <div className="space-y-3">
                              {checkout.cart
                                .filter((item) => {
                                  const costPrice =
                                    item.costPrice ||
                                    item.productId?.price ||
                                    item.price ||
                                    0;
                                  const sellingPrice = item.price || 0;
                                  const quantity = item.quantity || 1;
                                  const itemProfit =
                                    (sellingPrice - costPrice) * quantity;
                                  return itemProfit !== 0; // Only show non-returned items
                                })
                                .map((item, i) => {
                                  const costPrice = item.costPrice || 0;
                                  const sellingPrice = item.price || 0;
                                  const quantity = item.quantity || 0;
                                  const totalCost = costPrice * quantity;
                                  const totalSelling = sellingPrice * quantity;
                                  const itemProfit = totalSelling - totalCost;

                                  return (
                                    <div
                                      key={i}
                                      className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                                    >
                                      <p className="font-semibold text-slate-800 mb-2">
                                        {item.productName || item.name || "N/A"}
                                      </p>
                                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                                        <p className="text-slate-600">
                                          <span className="font-medium">
                                            Size:
                                          </span>{" "}
                                          {item.size || "N/A"}
                                        </p>
                                        <p className="text-slate-600">
                                          <span className="font-medium">
                                            Color:
                                          </span>{" "}
                                          {item.color || "N/A"}
                                        </p>
                                        <p className="text-slate-600">
                                          <span className="font-medium">
                                            Qty:
                                          </span>{" "}
                                          {quantity}
                                        </p>
                                        <p className="text-slate-600">
                                          <span className="font-medium">
                                            Unit Price:
                                          </span>{" "}
                                          NPR {sellingPrice}
                                        </p>
                                      </div>
                                      <div className="border-t border-slate-300 pt-2 space-y-1">
                                        <div className="flex justify-between text-xs">
                                          <span className="text-slate-600">
                                            Cost/unit:
                                          </span>
                                          <span className="font-medium text-slate-700">
                                            NPR {costPrice}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-slate-600">
                                            Total Cost:
                                          </span>
                                          <span className="font-medium text-red-600">
                                            NPR {totalCost.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                          <span className="text-slate-600">
                                            Total Selling:
                                          </span>
                                          <span className="font-medium text-green-600">
                                            NPR {totalSelling.toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-xs pt-1 border-t border-slate-200">
                                          <span className="font-semibold text-slate-700">
                                            Item Profit:
                                          </span>
                                          <span
                                            className={`font-bold ${
                                              itemProfit >= 0
                                                ? "text-green-700"
                                                : "text-red-700"
                                            }`}
                                          >
                                            NPR {itemProfit.toLocaleString()}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              {/* Customer info shown once per checkout */}
                              {checkout.customer && (
                                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mt-2">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">
                                    Customer Information
                                  </p>
                                  {checkout.customer.name && (
                                    <p className="text-xs text-slate-700">
                                      <span className="font-medium">Name:</span>{" "}
                                      {checkout.customer.name}
                                    </p>
                                  )}
                                  {checkout.customer.phone && (
                                    <p className="text-xs text-slate-700">
                                      <span className="font-medium">
                                        Phone:
                                      </span>{" "}
                                      {checkout.customer.phone}
                                    </p>
                                  )}
                                  {checkout.remarks && (
                                    <p className="text-xs text-slate-700">
                                      <span className="font-medium">
                                        Remarks:
                                      </span>{" "}
                                      {checkout.remarks}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">
                              No products
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {checkout.paymentMethod?.charAt(0).toUpperCase() +
                              checkout.paymentMethod?.slice(1) || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-right font-semibold text-slate-800">
                          NPR {(checkout.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-right font-semibold text-red-600">
                          NPR {(checkout.totalCost || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-right font-semibold">
                          <span
                            className={
                              (checkout.totalProfit || 0) >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            NPR {(checkout.totalProfit || 0).toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewGetCheckoutAdmin;
