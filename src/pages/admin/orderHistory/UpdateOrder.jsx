import React, { useEffect, useState } from "react";
import { getAllOrderApi, deleteOrderApi, updateOrderApi, baseURL } from "../../../Apis/Api"; 
import NoDataFound from "../../component/NoDataFound";
import toast from "react-hot-toast";

const UpdateOrder = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getAllOrderApi();
        const orderData = response.data;

        if (Array.isArray(orderData)) {
          setOrders(orderData);
        } else {
          setError("Unexpected data format received.");
        }

    
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        setError("Failed to fetch orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on the search term
  const filteredOrders = orders.filter(order => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      order.userId.name.toLowerCase().includes(lowercasedSearchTerm) ||
      order.userId.email.toLowerCase().includes(lowercasedSearchTerm) ||
      order.shippingAddress.toLowerCase().includes(lowercasedSearchTerm) ||
      order.items.some(item => item.name.toLowerCase().includes(lowercasedSearchTerm))
    );
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const cancelOrder = async () => {
    if (orderToDelete) {
      try {
        await deleteOrderApi(orderToDelete);
        setOrders(orders.filter(order => order._id !== orderToDelete));
        setShowModal(false);
      } catch (error) {
        setError("Failed to delete the order. Please try again.");
      }
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const orderData = { status: newStatus };
      await updateOrderApi(orderId, orderData);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success("Order status updated successfully.");
    } catch (err) {
      toast.error("Failed to update the order status. Please try again.");
    }
  };

  return (
    <section>
      <div className="mx-auto p-5 mt-10">
        <h2 className="text-gray-600 text-3xl font-bold mb-4">Update Order</h2>
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
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-4 text-left text-gray-600">SN</th>
                  <th className="px-6 py-4 text-left text-gray-600">User Detail</th>
                  <th className="px-6 py-4 text-left text-gray-600">Shipping Address/ Contact</th>
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
                    className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition-all duration-200`}
                  >
                    <td className="px-6 py-4 text-gray-500 flex gap-1">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-500">
                      name: {order.userId.name} email: {order.userId.email}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.shippingAddress} <br/>{order.phone}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <ul>
                        {order.items?.map((item) => (
                          <li key={item._id} className="flex gap-4 items-center">
                            <div className="w-[60px] h-[80px] flex-shrink-0">
                              <img
                                src={item?.images?.[0] ? `${baseURL}/${item.images[0].replace(/\\/g, "/")}` : baseURL}
                                alt={item?.name || "Product Image"}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div>
                              <strong>Product Name: {item.name} </strong> <br />
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
                      <span className={`px-3 py-1 rounded-full text-white text-sm 
                        ${order.status === "cancelled" ? "bg-red-500" : order.status === "shipped" ? "bg-green-500" : order.status === "delivered" ? "bg-blue-500" : "bg-yellow-500"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="bg-gray-200 p-2 rounded"
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        disabled={order.status === "cancelled"}
                      >
                        <option value="pending">Pending</option>
                        {/* <option value="shipped">Shipped</option> */}
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
              <option value={5}>5</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpdateOrder;
