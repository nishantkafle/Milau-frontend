import React, { useEffect, useState } from "react";
import {
  getAllOrdersByUserIdApi,
  deleteOrderApi,
  baseURL
} from "../../Apis/Api"; // API functions
import NoDataFound from "../component/NoDataFound";

const Orders = () => {
  const [orders, setOrders] = useState([]); // Orders data
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [showModal, setShowModal] = useState(false); // Confirmation modal visibility
  const [orderToDelete, setOrderToDelete] = useState(null); // Order to be deleted

  const ordersPerPage = 2; // Orders per page

  // Fetch orders and related products
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const user = JSON.parse(localStorage.getItem("user"));
      

        const response = await getAllOrdersByUserIdApi(user.id);
        const orderData = response.data;

        if (!Array.isArray(orderData)) throw new Error("Invalid order data.");

        setOrders(orderData);

      
      
      } catch (err) {
        // Handle backend errors
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          // Handle generic errors
          setError(err.message || "Failed to fetch orders.");
        }}
         finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  const currentOrders = orders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle order cancellation
  const cancelOrder = async () => {
    if (!orderToDelete) return;
    try {
      await deleteOrderApi(orderToDelete);
      setOrders(orders.filter((order) => order._id !== orderToDelete));
      setShowModal(false);
    } catch {
      setError("Failed to cancel the order. Please try again.");
    }
  };

  return (
    <section>
      <h3 className="font-semibold text-2xl text-gray-800 mb-3">Order Details</h3>
      <p className="text-red-500 mb-2">
        Note: You can only cancel orders that have not been shipped.
      </p>

      {loading ? (
        <div className="text-center text-xl font-bold text-red-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-xl font-bold text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <>
          <NoDataFound />
          <p className="text-center text-xl font-bold text-red-500">No orders found.</p>
        </>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg rounded-xl mt-3">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-left text-gray-600">Shipping Address</th>
                <th className="px-6 py-4 text-left text-gray-600">Items</th>
                <th className="px-6 py-4 text-left text-gray-600">Total Price</th>
                <th className="px-6 py-4 text-left text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100`}
                >
                  <td className="px-6 py-4">{order.shippingAddress}</td>
                  <td className="px-6 py-4">
                  <ul>
                        {order.items?.map((item) => (
                          <li key={item._id} className="flex gap-4 items-center">
                            {/* Product Image */}
                            <div className="w-[60px] h-[80px] flex-shrink-0">
                            <img
  src={
    item?.images?.[0]
      ? `${baseURL}/${item.images[0].replace(/\\/g, "/")}`
      : baseURL
  }
  alt={item?.name || "Product Image"}
  className="w-full h-full object-cover rounded"
/>




                            </div>

                            {/* Product Details */}
                            <div>
                              <strong>Product Name: {item.name} </strong> <br />
                              Qty: {item.quantity}, Price: {item.price}, Color: {item.colors}, Size: {item.sizes}
                            </div>
                          </li>
                        ))}
                      
                      </ul>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {order.totalPriceWithShipping}{" "}
                    <small className="text-gray-500">
                      (Incl. Shipping: {order.shippingCharge})
                    </small>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        {
                          cancelled: "bg-red-500",
                          shipped: "bg-green-500",
                          delivered: "bg-blue-500",
                          pending: "bg-yellow-500",
                        }[order.status]
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className="py-2 px-4 w-full rounded text-white bg-red-500 hover:bg-[#ab0000] disabled:bg-gray-300"
                      onClick={() => {
                        setOrderToDelete(order._id);
                        setShowModal(true);
                      }}
                      disabled={order.status!== "pending"}
                    >
                      Cancel Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-red-600 hover:bg-[#ab0000] text-white rounded-l-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-red-600 hover:bg-[#ab0000] text-white rounded-r-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to cancel this order?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="py-2 px-4 rounded bg-gray-300 hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={cancelOrder}
                className="py-2 px-4 rounded bg-red-600 hover:bg-[#ab0000] text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Orders;
