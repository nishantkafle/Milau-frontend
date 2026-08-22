import React, { useEffect, useState } from "react";
import { getAllOrderApi, baseURL } from "../../../Apis/Api";
import NoDataFound from "../../component/NoDataFound";
import toast from "react-hot-toast";

const OrderList = () => {
  const [orders, setOrders] = useState([]); // Store orders
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [ordersPerPage, setOrdersPerPage] = useState(10); // Orders per page
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  // Fetch all orders and product details when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(""); // Clear previous errors

      try {
        // Fetch all orders from the API
        const response = await getAllOrderApi();
        const orderData = response.data; // Extract orders data from the response

        if (Array.isArray(orderData)) {
          setOrders(orderData); // Set the orders state if it's an array
        } else {
          setError("Unexpected data format received."); // Handle unexpected data format
        }

      // Store all product details in state
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders(); // Call fetchOrders function
  }, []); // Empty dependency array ensures this runs only once on mount

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Filter orders based on the searchTerm
  const filteredOrders = currentOrders.filter(order => {
    return (
      order.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  return (
    <section className="px-5">
      {/* Search Input */}
      <div className="relative mb-4">
        <input
          type="search"
          id="default-search"
          className="block w-[50%] p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search Orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center text-xl font-bold text-red-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-xl font-bold text-red-500">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <>
          <NoDataFound />
          <div className="text-center text-xl font-bold text-red-500">No orders found.</div>
        </>
      ) : (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg rounded-xl mt-3">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-left text-gray-600">SN</th>
                <th className="px-6 py-4 text-left text-gray-600">User Detail</th>
                <th className="px-6 py-4 text-left text-gray-600">Shipping Address</th>
                <th className="px-6 py-4 text-left text-gray-600">Items</th>
                <th className="px-6 py-4 text-left text-gray-600">Total Price</th>
                <th className="px-6 py-4 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all duration-200`}
                >
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-gray-500">name: {order.userId.name} email: {order.userId.email}</td>
                  <td className="px-6 py-4 text-gray-500">{order.shippingAddress} {order.phone}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <ul>
                      {order.items?.map((item) => (
                        <li key={item._id} className="flex gap-4 items-center">
                          {/* Product Image */}
                          <div className="w-[60px] h-[80px] flex-shrink-0">
                            <img
                              src={item?.images?.[0] ? `${baseURL}/${item.images[0].replace(/\\/g, "/")}` : baseURL}
                              alt={item?.name || "Product Image"}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>

                          {/* Product Details */}
                          <div>
                            <strong>{item.name} </strong> <br />
                            Qty: {item.quantity}, Price: {item.price}, Color: {item.colors}, Size: {item.sizes}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">
                    {order.totalPriceWithShipping} <small className="text-gray-500">(Incl. Shipping: {order.shippingCharge})</small>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${order.status === "cancelled" ? "bg-red-500" : order.status === "shipped" ? "bg-green-500" : order.status === "delivered" ? "bg-blue-500" : "bg-yellow-500"}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded-l-lg"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300"
            >
              Prev
            </button>
            <span className="px-4 py-2">{currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300"
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded-r-lg"
            >
              Last
            </button>
          </div>

          {/* Orders Per Page Dropdown */}
          <div className="mt-4">
            <label htmlFor="ordersPerPage" className="mr-2">Orders Per Page:</label>
            <select
              id="ordersPerPage"
              value={ordersPerPage}
              onChange={(e) => setOrdersPerPage(Number(e.target.value))}
              className="p-2 border"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrderList;
