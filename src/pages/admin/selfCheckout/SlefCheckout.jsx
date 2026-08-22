import React, { useState, useEffect } from 'react';
import { baseURL, getProductBySku, processCheckout } from '../../../Apis/Api'; // Import API functions
import toast from 'react-hot-toast';

const SelfCheckout = () => {
  const [barcode, setBarcode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    size: '',
    color: '',
    quantity: 1,
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [debouncedBarcode, setDebouncedBarcode] = useState('');
  const [discount, setDiscount] = useState(''); // Discount state (5% or 10%)
  const [totalPrice, setTotalPrice] = useState(0); // State to store total price after discount
  const [otherDiscount, setOtherDiscount] = useState(0); // For custom discount values
  const [remarks, setRemarks] = useState(''); // For additional remarks
  const [customerFullName, setCustomerFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [totalProductPrice, setTotalProductPrice] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  // Debouncing barcode input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBarcode(barcode);
    }, 500);
    return () => clearTimeout(timer);
  }, [barcode]);

  useEffect(() => {
    if (debouncedBarcode.trim()) {
      searchProduct();
    }
  }, [debouncedBarcode]);
  useEffect(() => {
    if (selectedProduct && selectedOptions.quantity > 0) {
      const productPrice = selectedProduct.discountedPrice * selectedOptions.quantity;
      let discountValue = 0;

      if (discount === '5') {
        discountValue = productPrice * 0.05;
      } else if (discount === '10') {
        discountValue = productPrice * 0.1;
      } else if (discount === 'other') {
        discountValue = Math.min(otherDiscount, productPrice); // Prevent exceeding product price
      }

      const finalPrice = productPrice - discountValue;

      setTotalProductPrice(productPrice);
      setTotalDiscount(discountValue);
      setTotalPrice(Math.max(finalPrice, 0));
    }
  }, [selectedProduct, selectedOptions, discount, otherDiscount]);

  const searchProduct = async () => {
    if (!debouncedBarcode.trim()) {
      toast.error('Please enter a barcode!');
      return;
    }

    setLoading(true);
    try {
      const { data } = await getProductBySku(debouncedBarcode);
      if (data && data.success && data.product) {
        setSelectedProduct(data.product);
        setSelectedOptions({ size: '', color: '', quantity: 1 });
        toast.success('Product loaded successfully!');
        sendProductId(data.product._id); // Send productId immediately
      } else {
        toast.error('Product not found!');
        setSelectedProduct(null);
      }
    } catch (error) {
      toast.error('Error fetching product. Please try again.');
      setSelectedProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const sendProductId = async (productId) => {
    try {
      // Add your logic here to handle the productId.
      console.log('Sending productId:', productId);
      // Example: Call an API endpoint with productId
      // const { data } = await someApiFunction(productId);
    } catch (error) {
      console.error('Error sending productId:', error);
      toast.error('Error processing product. Please try again.');
    }
  };

  const handleInput = (e) => {
    setBarcode(e.target.value);
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'size' ? { color: '' } : {}), // Reset color when size changes
    }));
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value)); // Ensure at least 1
    setSelectedOptions((prev) => ({
      ...prev,
      quantity: value,
    }));
  };
  const printReceipt = (product, options, totalPrice, paymentMethod, discount) => {
    const printWindow = window.open('', '', 'width=600,height=800');

    const styles = `
      @media print {
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        .receipt {
          width: 58mm;
          padding: 10px;
          text-align: center;
          border: 1px solid #ccc;
        }
        .receipt h2, .receipt h4 {
          margin: 5px 0;
        }
        .receipt p {
          margin: 3px 0;
          font-size: 12px;
        }
        .receipt hr {
          border: 0.5px dashed #000;
          margin: 10px 0;
        }
      }
    `;

    // Calculate the original price (before discount)
    const originalPrice = product.discountedPrice * options.quantity;

    const receiptContent = `
      <div class="receipt">
        <h2>Pranu Collection</h2>
        <h4>Location: Indrachowk, Kathmandu</h4>
        <hr />
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>Size:</strong> ${options.size}</p>
        <p><strong>Color:</strong> ${options.color}</p>
        <p><strong>Quantity:</strong> ${options.quantity}</p>
        <p><strong>Price (Each):</strong> Npr. ${product.discountedPrice}</p>
        <p><strong>Original Total Price:</strong> Npr. ${originalPrice.toFixed(2)}</p>
        <p><strong>Total Price After Discount:</strong> Npr. ${totalPrice.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <hr />
        <p>Thank you for shopping with us!</p>
        <p>Visit again!</p>
      </div>
    `;

    printWindow.document.head.innerHTML = `<style>${styles}</style>`;
    printWindow.document.body.innerHTML = receiptContent;

    printWindow.print();
    printWindow.close();
  };

  const handleCheckout = async () => {
    const { size, color, quantity } = selectedOptions;

    if (!size || !color || !paymentMethod || !customerFullName || !mobileNumber) {
      toast.error('Please complete all fields!');
      return;
    }

    if (totalDiscount > totalProductPrice) {
      toast.error('Discount cannot exceed total product price!');
      return;
    }

    const checkoutData = {
      productId: selectedProduct._id,
      size,
      color,
      quantity,
      totalPrice,
      paymentMethod,
      customerFullName,
      mobileNumber,
      remarks,
    };

    try {
      setLoading(true);
      const { data } = await processCheckout(checkoutData);
      if (data.success) {
        toast.success('Checkout successful!');
        setSelectedProduct(null);
        setSelectedOptions({ size: '', color: '', quantity: 1 });
        setBarcode('');
        setPaymentMethod('');
        setRemarks('');
        setCustomerFullName('');
        setMobileNumber('');
      } else {
        toast.error('Checkout failed! Please try again.');
      }
    } catch (error) {
      toast.error('Error during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className=" mt-5">
      <div className="bg-white ">
        <div className="text-gray-600 font-bold text-3xl mt-5">Admin Self Checkout</div>


        <div className="mb-6">
          <label className="block font-semibold mb-2">Scan Barcode</label>
          <input
            type="text"
            value={barcode}
            onChange={handleInput}
            placeholder="Scan or enter barcode"
            className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          />
        </div>

        {loading && <div className="text-center text-blue-500">Loading...</div>}

        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 border rounded-lg bg-gray-100">
            <div className="flex flex-col items-center">
              <img
                src={`${baseURL}/${selectedProduct.images[0]}`}
                alt={selectedProduct.name}
                className="w-full h-auto mb-4 rounded-lg"
              />
              <h3 className="text-lg font-semibold text-center">Product: {selectedProduct.name}</h3>
              <p className="text-sm text-gray-600">Price: Npr. {selectedProduct.discountedPrice}</p>
            </div>

            <div className="flex flex-col space-y-4">
              <label className="block font-semibold">Size</label>
              <select
                name="size"
                value={selectedOptions.size}
                onChange={handleOptionChange}
                className="border px-4 py-2 rounded-lg w-full"
                disabled={loading}
              >
                <option value="">Choose Size</option>
                {selectedProduct.sizes.map((size) => (
                  <option key={size._id} value={size.size}>
                    {size.size}
                  </option>
                ))}
              </select>

              <label className="block font-semibold">Color</label>
              <select
                name="color"
                value={selectedOptions.color}
                onChange={handleOptionChange}
                className="border px-4 py-2 rounded-lg w-full"
                disabled={loading || !selectedOptions.size}
              >
                <option value="">Choose Color</option>
                {selectedProduct.sizes
                  .find((s) => s.size === selectedOptions.size)
                  ?.colors.map((color) => (
                    <option key={color._id} value={color.color}>
                      {color.color} (Stock: {color.quantity})
                    </option>
                  ))}
              </select>

              <label className="block font-semibold">Quantity</label>
              <input
                type="number"
                value={selectedOptions.quantity}
                onChange={handleQuantityChange}
                className="border px-4 py-2 rounded-lg w-full"
                min={1}
                disabled={loading || !selectedOptions.size || !selectedOptions.color}
              />
            </div>
          </div>
        )}

        {selectedProduct && (
          <div>
            <div className="mb-6">
              <label className="block font-semibold mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full"
                disabled={loading}
              >
                <option value="">Choose Payment Method</option>
                <option value="cash">Cash</option>
                <option value="esewa">Esewa</option>
                <option value="fonepay">Fonepay</option>
                <option value="khalti">Khalti</option>
              </select>
            </div>

            <div className='border p-4 rounded-lg mb-6'>
              <label className="block font-semibold mb-2">Discount:</label>
              <select
                className="border px-4 py-2 rounded-lg w-full"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              >
                <option value="">Select Discount</option>
                <option value="0">No Discount</option>
                <option value="5">5%</option>
                <option value="10">10%</option>
                <option value="other">Other</option>
              </select>
              {discount === 'other' && (
                <input
                  type="number"
                  value={otherDiscount || ''}
                  onChange={(e) => setOtherDiscount(Number(e.target.value) || 0)}
                  placeholder="Enter Discount Amount"
                  className="border px-4 py-2 rounded-lg w-full mt-2 "
                />

              )}
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Customer Name</label>
              <input
                type="text"
                name="customerFullName"
                value={customerFullName}
                onChange={(e) => setCustomerFullName(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Enter full name"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Customer Phone Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Enter phone number"
              />
            </div>
            <div className="mb-4">
              <label className="block font-semibold">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="border px-4 py-2 rounded-lg w-full"
                placeholder="Enter remarks"
              />
            </div>
            <div className="font-semibold">
              <p>Total Product Price: Npr. {totalProductPrice.toFixed(2)}</p>
              <p>Total Discount: Npr. {totalDiscount.toFixed(2)}</p>
              <p>Final Price: Npr. {totalPrice.toFixed(2)}</p>
            </div>
            {totalPrice > 0 && (
              <div className="mt-4 font-semibold">
                <p>Total Price After Discount: Npr. {totalPrice.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleCheckout}
          className="bg-green-500 text-white py-3 px-6 rounded-lg w-full"
          disabled={!selectedProduct || loading}
        >
          Finalize Checkout
        </button>
      </div>
    </div>
  );
};

export default SelfCheckout;
