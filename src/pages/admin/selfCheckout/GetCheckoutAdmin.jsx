import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllCheckouts } from "../../../Apis/Api";
import * as XLSX from "xlsx";

const GetCheckoutAdmin = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [filteredCheckouts, setFilteredCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCheckouts();
  }, []);

  useEffect(() => {
    let filtered = checkouts;

    if (selectedDate) {
      filtered = filtered.filter((checkout) => {
        const checkoutDate = new Date(checkout.createdAt);
        const selected = new Date(selectedDate);
        return (
          checkoutDate.getFullYear() === selected.getFullYear() &&
          checkoutDate.getMonth() === selected.getMonth() &&
          checkoutDate.getDate() === selected.getDate()
        );
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((checkout) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          checkout.customer?.name?.toLowerCase().includes(searchLower) ||
          checkout.customer?.phone?.includes(searchTerm) ||
          checkout.invoiceNumber?.toLowerCase().includes(searchLower) ||
          checkout.cart?.some(
            (item) =>
              item.productName?.toLowerCase().includes(searchLower) ||
              item.name?.toLowerCase().includes(searchLower)
          )
        );
      });
    }

    setFilteredCheckouts(filtered);
  }, [checkouts, selectedDate, searchTerm]);

  const fetchCheckouts = async () => {
    try {
      const { data } = await getAllCheckouts();
      if (data.success) {
        console.log("Sample checkout data:", data.data[0]); // Debug log
        setCheckouts(data.data);
        setFilteredCheckouts(data.data);
      } else {
        toast.error("Failed to fetch checkout records.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching checkout records.");
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
    const totalQuantity = filteredCheckouts.reduce(
      (sum, c) =>
        sum +
        (c.cart?.reduce((pSum, item) => pSum + (item.quantity || 0), 0) || 0),
      0
    );

    return { total, totalProfit, totalQuantity };
  };

  const exportToExcel = () => {
    if (!filteredCheckouts || filteredCheckouts.length === 0) {
      toast.error("No checkout records to export.");
      return;
    }

    const checkoutData = filteredCheckouts.map((checkout, index) => {
      const productDetails =
        checkout.cart
          ?.map((item) => {
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
          checkout.cart?.reduce(
            (total, item) => total + (item.quantity || 0),
            0
          ) || 0,
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

  const { total, totalProfit, totalQuantity } = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Self-Checkout Records
          </h1>
          <p className="text-slate-600">
            Manage and export checkout transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Sales
            </p>
            <p className="text-2xl font-bold text-slate-800">
              NPR {total.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-green-500">
            <p className="text-slate-600 text-sm font-medium mb-1">
              Total Profit
            </p>
            <p className="text-2xl font-bold text-green-600">
              NPR {totalProfit.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-purple-500">
            <p className="text-slate-600 text-sm font-medium mb-1">
              Items Sold
            </p>
            <p className="text-2xl font-bold text-slate-800">{totalQuantity}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Customer, phone, invoice, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 border text-black border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Filter by Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 text-black focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={exportToExcel}
                disabled={filteredCheckouts.length === 0}
                className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition shadow-sm"
              >
                Export to Excel
              </button>
              {(selectedDate || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedDate("");
                    setSearchTerm("");
                  }}
                  className="px-4 py-2.5 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
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
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-600">Loading checkout records...</p>
            </div>
          ) : filteredCheckouts.length === 0 ? (
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
                              {checkout.cart.map((item, i) => {
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

export default GetCheckoutAdmin;
