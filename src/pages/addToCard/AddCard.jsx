import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { decreaseQuantity, increaseQuantity, removeFromCart, clearCart } from "../store/cartSlice"; // Import clearCart
import { createOrderApi } from "../../Apis/Api";
import toast from "react-hot-toast";
import { baseURL } from "../../Apis/Api";

const AddToCart = () => {
  const dispatch = useDispatch();

  // Redux selectors
  const { cart } = useSelector((state) => state.cartReducer);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Local states
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState(""); // Added state for location
  const [shippingCharge, setShippingCharge] = useState(0); // Dynamically calculate shipping charge

  // Utility functions for calculations
  const calculateTotalAmount = () =>
    cart.reduce((total, item) => total + item.discountedPrice * item.quantity, 0);

  const totalAmount = calculateTotalAmount();
  const totalPriceWithShipping = totalAmount + shippingCharge;
  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  // Update shipping charge based on location
  useEffect(() => {
    if (location === "inside") {
      setShippingCharge(120);
    } else if (location === "outside") {
      setShippingCharge(170);
    } else {
      setShippingCharge(0);
    }
  }, [location]);

  // Event handlers
  const handleBuyNow = async () => {
    if (!location) {
      toast.error("Please select a delivery location.");
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error("Please enter a valid shipping address.");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    if (!user?.id) {
      toast.error("User ID is missing. Please log in again.");
      return;
    }

    const orderData = {
      userId: user.id,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        colors: item.color,
        sizes: item.size,
        images: item.images,
        quantity: item.quantity,
        discountedPrice: item.discountedPrice,
      })),
      shippingAddress,
      phone,
      totalAmount,
      shippingCharge,
      totalPriceWithShipping,
      status: "pending",
    };

    try {
      const response = await createOrderApi(orderData);
      toast.success(response.data.message || "Order placed successfully!");

      // Clear the cart after successful order placement
      dispatch(clearCart());
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.message ||
        "Failed to place order. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-center p-5 bg-gray-200 font-bold text-gray-600 valky">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-red-500 text-3xl font-bold pb-10 valky">
            Your cart is empty!
          </h3>
          <Link
            to="/category"
            className="btn bg-red-600 hover:bg-red-700 text-white rounded-md text-lg px-4 py-2 "
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5 p-5">
          {/* Cart Items Section */}
          <div className="col-span-2 relative overflow-x-auto ">
            <table className="table-auto w-full text-sm text-left text-gray-500 bg-gray-100">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Color</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Quantity</th>
                  <th className="px-6 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="bg-white hover:bg-gray-50">
                    <td className="flex items-center gap-4 px-6 py-4">
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? `${baseURL}/${item.images[0]}`
                            : "fallback-image-url"
                        }
                        alt="product"
                        className="h-20 w-16 object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.category?.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.size}</td>
                    <td className="px-6 py-4">{item.color}</td>
                    <td className="px-6 py-4">NPR. {item.discountedPrice}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            dispatch(decreaseQuantity({ itemId: item.id }));
                          } else {
                            toast.error("Quantity cannot be less than 1.");
                          }
                        }}
                        className="px-2 py-1 bg-gray-300 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => {
                          if (item.quantity < item.stock) { // Replace item.stock with the actual stock field
                            dispatch(increaseQuantity({ itemId: item.id }));
                          } else {
                            toast.error("Quantity cannot exceed stock availability.");
                          }
                        }}
                        className="px-2 py-1 bg-gray-300 rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => dispatch(removeFromCart({ itemId: item.id }))}
                        className="ml-3 text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      NPR. {(item.discountedPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary Section */}
          <div className="bg-gray-50 p-5 rounded shadow-md lg:col-span-1 col-span-2">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="flex justify-between text-gray-600">
              <span>Total Items:</span>
              <span>{totalQuantity}</span>
            </div>
            <div className="flex justify-between text-gray-600 mt-2">
              <span>Shipping Charge:</span>
              <span>NPR. {shippingCharge.toFixed(2)}</span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between font-bold text-xl">
              <span>Total Price:</span>
              <span>NPR. {totalPriceWithShipping.toFixed(2)}</span>
            </div>
            <hr className="my-3" />

            {/* Location Dropdown */}
            <label htmlFor="location" className="block text-gray-600 mb-2">
              Delivery Location
            </label>
            <select
              id="location"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="inside">Inside Kathmandu</option>
              <option value="outside">Outside Kathmandu</option>
            </select>

            {/* Shipping Address */}
            <label htmlFor="shippingAddress" className="block text-gray-600 mb-2">
              Shipping Address
            </label>
            <input
              id="shippingAddress"
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your address"
            />

            {/* Phone Number */}
            <label htmlFor="phone" className="block text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
            />

            <button
              onClick={handleBuyNow}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
