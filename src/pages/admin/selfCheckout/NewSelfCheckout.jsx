import React, { useState, useEffect, useRef } from "react";
import {
  baseURL,
  getProductBySku,
  processCheckout,
  checkCustomer,
  getCustomerHistory,
} from "../../../Apis/Api";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import "jspdf-autotable";

const NewSelfCheckout = () => {
  // State management
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [customerStatus, setCustomerStatus] = useState("new");
  const [customerHistory, setCustomerHistory] = useState(null);
  const [customDiscount, setCustomDiscount] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("");
  const barcodeInputRef = useRef(null);
  const isScanningRef = useRef(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0
  );
  const grandTotal = Math.max(0, subtotal - discount);

  // PDF Invoice Generator
  const generateInvoicePDF = (checkoutData, requestData) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200], // Thermal printer size
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 10;

    // Company Logo & Name
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text("PRANU COLLECTION", pageWidth / 2, yPos, { align: "center" });

    yPos += 6;
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text("NewRoad, Kathmandu", pageWidth / 2, yPos, { align: "center" });

    yPos += 4;
    doc.text("Ph: +977 984-8556062", pageWidth / 2, yPos, { align: "center" });

    yPos += 6;
    doc.setLineWidth(0.5);
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Invoice Details
    yPos += 5;
    doc.setFontSize(10);
    doc.setFont(undefined, "bold");
    doc.text("SALES INVOICE", pageWidth / 2, yPos, { align: "center" });

    yPos += 5;
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");

    // Invoice Number
    doc.text(`Invoice: ${checkoutData.invoiceNumber || "N/A"}`, 5, yPos);

    yPos += 4;
    // Receipt/Transaction Number - IMPORTANT FOR RETURNS
    doc.setFont(undefined, "bold");
    doc.text(`Receipt: ${checkoutData.receiptNumber}`, 5, yPos);
    doc.setFont(undefined, "normal");

    yPos += 4;
    doc.setFontSize(8);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 5, yPos);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, pageWidth - 5, yPos, {
      align: "right",
    });

    yPos += 6;
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Customer Details
    yPos += 5;
    doc.setFont(undefined, "bold");
    doc.text("Customer Details:", 5, yPos);

    yPos += 4;
    doc.setFont(undefined, "normal");
    doc.text(`Name: ${requestData.customer.name}`, 5, yPos);

    yPos += 4;
    doc.text(`Phone: ${requestData.customer.phone}`, 5, yPos);

    yPos += 6;
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Product Table Header
    yPos += 5;
    doc.setFont(undefined, "bold");
    doc.setFontSize(7);
    doc.text("Item", 5, yPos);
    doc.text("Qty", 40, yPos);
    doc.text("Price", 52, yPos);
    doc.text("Amount", 72, yPos, { align: "right" });

    yPos += 3;
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Products
    yPos += 4;
    doc.setFont(undefined, "normal");
    doc.setFontSize(7);

    checkoutData.cart.forEach((item) => {
      // Product name
      const productName = `${item.name}`;
      doc.text(productName, 5, yPos, { maxWidth: 38 });

      // Size & Color on next line
      yPos += 3;
      doc.setFontSize(6);
      doc.text(`${item.size} / ${item.color}`, 5, yPos);

      // Quantity, Price, Amount
      yPos -= 3;
      doc.setFontSize(7);
      doc.text(String(item.quantity), 40, yPos);
      doc.text(item.price.toFixed(2), 52, yPos);
      doc.text((item.price * item.quantity).toFixed(2), 72, yPos, {
        align: "right",
      });

      yPos += 6;
    });

    // Totals section
    yPos += 2;
    doc.line(5, yPos, pageWidth - 5, yPos);

    yPos += 5;
    doc.setFont(undefined, "normal");
    doc.text("Subtotal:", 5, yPos);
    doc.text(`NPR ${requestData.subtotal.toFixed(2)}`, 67, yPos, {
      align: "right",
    });

    if (requestData.discount > 0) {
      yPos += 4;
      doc.text("Discount:", 5, yPos);
      doc.text(`- NPR ${requestData.discount.toFixed(2)}`, 67, yPos, {
        align: "right",
      });
    }

    yPos += 5;
    doc.setLineWidth(0.8);
    doc.line(5, yPos, pageWidth - 5, yPos);

    yPos += 5;
    doc.setFont(undefined, "bold");
    doc.setFontSize(10);
    doc.text("TOTAL:", 5, yPos);
    doc.text(`NPR ${requestData.totalAmount.toFixed(2)}`, 67, yPos, {
      align: "right",
    });

    yPos += 6;
    doc.setLineWidth(0.5);
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Payment Method
    yPos += 5;
    doc.setFont(undefined, "normal");
    doc.setFontSize(8);
    doc.text(`Payment: ${requestData.paymentMethod.toUpperCase()}`, 5, yPos);

    if (requestData.remarks) {
      yPos += 4;
      doc.text(`Note: ${requestData.remarks}`, 5, yPos, {
        maxWidth: pageWidth - 10,
      });
    }

    // Return Policy Notice
    yPos += 8;
    doc.setLineWidth(0.3);
    doc.line(5, yPos, pageWidth - 5, yPos);

    yPos += 4;
    doc.setFontSize(7);
    doc.setFont(undefined, "bold");
    doc.text("RETURN POLICY", pageWidth / 2, yPos, { align: "center" });

    yPos += 4;
    doc.setFont(undefined, "normal");
    doc.setFontSize(6);
    doc.text("Keep this receipt for returns/exchanges", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 3;
    doc.text("Use Receipt Number or Transaction ID", pageWidth / 2, yPos, {
      align: "center",
    });

    // Footer
    yPos += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, "bold");
    doc.text("Thank you for shopping with us!", pageWidth / 2, yPos, {
      align: "center",
    });

    yPos += 5;
    doc.setFontSize(7);
    doc.setFont(undefined, "normal");
    doc.text("Visit us again!", pageWidth / 2, yPos, { align: "center" });

    // Open PDF in new tab with print dialog (no automatic download)
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  // Discount calculation effect - FIXED to include 3%
  useEffect(() => {
    let calculatedDiscount = 0;
    if (discountType === "3") {
      calculatedDiscount = subtotal * 0.03;
    } else if (discountType === "5") {
      calculatedDiscount = subtotal * 0.05;
    } else if (discountType === "10") {
      calculatedDiscount = subtotal * 0.1;
    } else if (discountType === "other") {
      calculatedDiscount = Math.min(Number(customDiscount) || 0, subtotal);
    }
    setDiscount(Math.max(0, calculatedDiscount));
  }, [discountType, customDiscount, subtotal]);

  // Customer verification effect
  useEffect(() => {
    const verifyCustomer = async () => {
      if (mobileNumber.length === 10) {
        try {
          const { data } = await checkCustomer(mobileNumber);
          if (data.exists) {
            setCustomerStatus(data.isReturning ? "returning" : "existing");
            if (data.name) setCustomerName(data.name);

            const historyResponse = await getCustomerHistory(mobileNumber);
            setCustomerHistory(historyResponse.data.summary);
          } else {
            setCustomerStatus("new");
            setCustomerHistory(null);
          }
        } catch (error) {
          toast.error("Error verifying customer");
        }
      } else {
        setCustomerHistory(null);
      }
    };
    verifyCustomer();
  }, [mobileNumber]);

  // Auto-focus barcode input on mount
  useEffect(() => {
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  // Auto-focus barcode input after product is added
  useEffect(() => {
    if (!scanning && barcodeInputRef.current && cart.length > 0) {
      setTimeout(() => {
        barcodeInputRef.current?.focus();
      }, 100);
    }
  }, [cart.length, scanning]);

  // Barcode scanning effect
  useEffect(() => {
    const handleScan = async () => {
      if (!barcode.trim() || isScanningRef.current) return;

      isScanningRef.current = true;
      setScanning(true);
      setLoading(true);

      try {
        const { data } = await getProductBySku(barcode.trim());
        if (data?.product) {
          setCart((currentCart) => {
            const existingProduct = currentCart.find(
              (item) =>
                item.product._id === data.product._id &&
                !item.size &&
                !item.color
            );

            if (existingProduct) {
              toast.error(
                "Product already in cart. Please select size and color first."
              );
              return currentCart;
            } else {
              toast.success(`Product added: ${data.product.name}`);
              return [
                ...currentCart,
                {
                  product: data.product,
                  size: "",
                  color: "",
                  quantity: 1,
                  costPrice: data.product.price,
                  sellingPrice: data.product.discountedPrice,
                },
              ];
            }
          });

          setBarcode("");
          setTimeout(() => {
            barcodeInputRef.current?.focus();
          }, 100);
        } else {
          toast.error("Product not found. Please check the barcode.");
        }
      } catch (error) {
        console.error("Barcode scan error:", error);
        toast.error(
          error.response?.data?.message ||
            "Product not found. Please try again."
        );
      } finally {
        setLoading(false);
        setScanning(false);
        isScanningRef.current = false;
      }
    };

    const timer = setTimeout(handleScan, 300);
    return () => {
      clearTimeout(timer);
      isScanningRef.current = false;
    };
  }, [barcode]);

  // Cart operations
  const updateCartItem = (index, field, value) => {
    setCart((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const updated = { ...item };
          if (field === "size") {
            updated.color = "";
            updated[field] = value;
          } else if (field === "quantity") {
            updated[field] = Math.max(1, Number(value));
          } else {
            updated[field] = value;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removeCartItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Enter key press for barcode scanner
  const handleBarcodeKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (barcode.trim() && !isScanningRef.current) {
        const handleScan = async () => {
          isScanningRef.current = true;
          setScanning(true);
          setLoading(true);

          try {
            const { data } = await getProductBySku(barcode.trim());
            if (data?.product) {
              setCart((currentCart) => {
                const existingProduct = currentCart.find(
                  (item) =>
                    item.product._id === data.product._id &&
                    !item.size &&
                    !item.color
                );

                if (existingProduct) {
                  toast.error(
                    "Product already in cart. Please select size and color first."
                  );
                  return currentCart;
                } else {
                  toast.success(`Product added: ${data.product.name}`);
                  return [
                    ...currentCart,
                    {
                      product: data.product,
                      size: "",
                      color: "",
                      quantity: 1,
                      costPrice: data.product.price,
                      sellingPrice: data.product.discountedPrice,
                    },
                  ];
                }
              });

              setBarcode("");
              setTimeout(() => {
                barcodeInputRef.current?.focus();
              }, 100);
            } else {
              toast.error("Product not found.");
            }
          } catch (error) {
            toast.error(error.response?.data?.message || "Product not found.");
          } finally {
            setLoading(false);
            setScanning(false);
            isScanningRef.current = false;
          }
        };
        handleScan();
      }
    }
  };

  // Checkout handler
  const handleCheckout = async () => {
    // Validation
    if (cart.length === 0) {
      toast.error("Cart is empty. Please scan products first.");
      return;
    }

    if (!cart.every((item) => item.size && item.color)) {
      toast.error("Please complete size and color selection for all items");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (!mobileNumber || mobileNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }

    // Validate VAT number if provided
    if (vatNumber && vatNumber.length !== 9) {
      toast.error("VAT number must be exactly 9 digits");
      return;
    }

    // Validate stock availability
    const stockIssues = [];
    cart.forEach((item, index) => {
      const productSize = item.product.sizes.find((s) => s.size === item.size);
      if (productSize) {
        const productColor = productSize.colors.find(
          (c) => c.color === item.color
        );
        if (productColor && productColor.quantity < item.quantity) {
          stockIssues.push(
            `${item.product.name} - ${item.size}/${item.color}: Only ${productColor.quantity} available`
          );
        }
      }
    });

    if (stockIssues.length > 0) {
      toast.error(`Stock issue: ${stockIssues[0]}`);
      return;
    }

    // Calculate totals - NO VAT CALCULATION (price already includes VAT)
    const calculatedSubtotal = cart.reduce(
      (sum, item) => sum + item.sellingPrice * item.quantity,
      0
    );
    const discountedTotal = Math.max(0, calculatedSubtotal - discount);

    const checkoutData = {
      cart: cart.map((item) => ({
        productId: item.product._id?.toString() || item.product._id,
        name: item.product.name,
        sku: item.product.sku || "",
        size: item.size,
        color: item.color,
        quantity: Number(item.quantity),
        price: Number(item.sellingPrice),
        costPrice: Number(item.costPrice || item.product.price),
        categoryId:
          item.product.categoryId?._id?.toString() ||
          item.product.categoryId ||
          undefined,
        categoryName:
          item.product.categoryName || item.product.category?.name || "",
      })),
      paymentMethod,
      subtotal: Number(calculatedSubtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      taxableAmount: Number(discountedTotal.toFixed(2)),
      vatAmount: 0,
      vatRate: 0,
      totalAmount: Number(discountedTotal.toFixed(2)),
      customer: {
        name: customerName.trim(),
        phone: mobileNumber,
        vatNumber: vatNumber.trim() || null,
        isReturning: customerStatus === "returning",
      },
      remarks: remarks.trim() || "",
    };

    try {
      setLoading(true);
      const { data } = await processCheckout(checkoutData);

      if (data.success) {
        toast.success("Checkout successful! Generating invoice...");

        // Generate PDF Invoice
        generateInvoicePDF(data.data, checkoutData);

        // Reset all states
        setCart([]);
        setBarcode("");
        setPaymentMethod("");
        setCustomerName("");
        setMobileNumber("");
        setVatNumber("");
        setRemarks("");
        setDiscount(0);
        setDiscountType("");
        setCustomDiscount("");
        setCustomerHistory(null);
        setCustomerStatus("new");

        setTimeout(() => {
          barcodeInputRef.current?.focus();
        }, 200);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Checkout failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white p-6 space-y-8">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Self Checkout System
          </h1>
          <p className="text-gray-600 mt-1">
            Scan products and process payments
          </p>
        </div>

        {/* Scanner & Customer Info */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Scanner Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barcode Scanner
              </label>
              <div className="relative">
                <input
                  ref={barcodeInputRef}
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  onKeyPress={handleBarcodeKeyPress}
                  placeholder="Scan product barcode or press Enter..."
                  className="w-full p-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 text-lg"
                  disabled={loading || scanning}
                  autoFocus
                  autoComplete="off"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  {scanning || loading ? (
                    <svg
                      className="animate-spin h-6 w-6 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h4M4 8h16M4 16h16"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-black">
                Customer Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(
                        e.target.value.replace(/\D/g, "").slice(0, 10)
                      )
                    }
                    placeholder="98XXXXXXXX"
                    className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                  />
                  {customerStatus !== "new" && (
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          customerStatus === "returning"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {customerStatus.charAt(0).toUpperCase() +
                          customerStatus.slice(1)}{" "}
                        Customer
                      </span>
                      {customerHistory && (
                        <span className="text-sm text-gray-600">
                          {customerHistory.totalTransactions} previous purchases
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 9);
                      setVatNumber(value);
                    }}
                    placeholder="Enter 9-digit VAT number"
                    className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                    maxLength="9"
                  />
                  {vatNumber &&
                    vatNumber.length > 0 &&
                    vatNumber.length < 9 && (
                      <p className="text-xs text-red-600 mt-1">
                        VAT number must be exactly 9 digits
                      </p>
                    )}
                  {vatNumber && vatNumber.length === 9 && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Valid VAT number
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 text-black">
                Cart Items ({cart.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex gap-4">
                      <img
                        src={`${baseURL}/${item.product.images[0]}`}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium text-gray-800">
                            {item.product.name}
                          </h3>
                          <button
                            onClick={() => removeCartItem(index)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <select
                            value={item.size}
                            onChange={(e) =>
                              updateCartItem(index, "size", e.target.value)
                            }
                            className="text-sm p-2 border rounded-md text-black"
                          >
                            <option value="" className="text-black">
                              Select Size
                            </option>
                            {item.product.sizes.map((size) => (
                              <option key={size._id} value={size.size}>
                                {size.size}
                              </option>
                            ))}
                          </select>

                          <select
                            value={item.color}
                            onChange={(e) =>
                              updateCartItem(index, "color", e.target.value)
                            }
                            className="text-sm p-2 border rounded-md text-black"
                            disabled={!item.size}
                          >
                            <option value="">Select Color</option>
                            {item.product.sizes
                              .find((s) => s.size === item.size)
                              ?.colors.map((color) => (
                                <option key={color._id} value={color.color}>
                                  {color.color} ({color.quantity})
                                </option>
                              ))}
                          </select>

                          <div className="col-span-2 flex items-center gap-3">
                            <h1 className="text-sm font-medium text-black">
                              Quantity
                            </h1>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                updateCartItem(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className="w-16 text-sm text-black p-2 border rounded-md focus:ring focus:ring-blue-200"
                              min="1"
                            />
                            <span className="text-gray-500 text-sm">
                              NPR {item.sellingPrice} × {item.quantity}
                            </span>
                            <span className="ml-auto font-semibold text-base text-black">
                              NPR{" "}
                              {(item.sellingPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Summary */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-black">
                  Payment Details
                </h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                      >
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="esewa">eSewa</option>
                        <option value="khalti">Khalti</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={discountType}
                          onChange={(e) => setDiscountType(e.target.value)}
                          className="p-2 border rounded-md flex-1 text-black"
                        >
                          <option value="">Select Discount</option>
                          <option value="3">3%</option>
                          <option value="5">5%</option>
                          <option value="other">Custom</option>
                        </select>
                        {discountType === "other" && (
                          <input
                            type="number"
                            value={customDiscount}
                            onChange={(e) => setCustomDiscount(e.target.value)}
                            className="p-2 border rounded-md w-24 text-black"
                            placeholder="Amount"
                            min="0"
                            max={subtotal}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-black">
                      Order Notes
                    </label>
                    <textarea
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Add any special instructions..."
                      className="w-full p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 text-black"
                      rows="2"
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary - REMOVED VAT CALCULATION */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="space-y-3">
                  <div className="flex justify-between font-medium text-black">
                    <span>Subtotal:</span>
                    <span>NPR {subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-green-600 font-medium">
                        - NPR {discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-blue-800 text-lg">
                    <span>Total Amount:</span>
                    <span>NPR {grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Price includes all taxes
                  </p>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={
                  !cart.length ||
                  loading ||
                  scanning ||
                  !paymentMethod ||
                  !mobileNumber ||
                  mobileNumber.length !== 10 ||
                  !customerName.trim()
                }
                className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-medium hover:bg-blue-700 
                         disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Checkout...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Complete Checkout (NPR {grandTotal.toFixed(2)})
                  </>
                )}
              </button>
              {(!paymentMethod ||
                !mobileNumber ||
                mobileNumber.length !== 10 ||
                !customerName.trim()) &&
                cart.length > 0 && (
                  <p className="text-sm text-red-600 text-center mt-2">
                    {!paymentMethod && "Please select payment method. "}
                    {(!mobileNumber || mobileNumber.length !== 10) &&
                      "Please enter valid mobile number. "}
                    {!customerName.trim() && "Please enter customer name."}
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSelfCheckout;
