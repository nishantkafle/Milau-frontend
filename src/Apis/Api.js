import axios from "axios";

// ============================================
// API CONFIGURATION
// ============================================
// ALWAYS use production API unless explicitly told otherwise
// This allows you to develop frontend locally while using production backend

const useLocalBackend = process.env.REACT_APP_USE_LOCAL_BACKEND === "true";

export const baseURL = useLocalBackend
  ? (process.env.REACT_APP_API_URL || "http://localhost:5000")
  : "https://api.pranucollection.com";

export const imageBaseURL = baseURL;

console.log("🔧 API Configuration:");
console.log("   Using local backend:", useLocalBackend);
console.log("   baseURL:", baseURL);
console.log("   imageBaseURL:", imageBaseURL);

const Api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper function to get image URL with debug logging
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.warn("⚠️ getImageUrl: No image path provided");
    return "";
  }

  // If it's already a full URL, use it directly
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Remove any leading slashes and 'public/' prefix
  let cleanPath = imagePath.replace(/^\/+/, "").replace(/^public\//, "");

  // Construct full URL
  const fullUrl = `${imageBaseURL}/${cleanPath}`;

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    console.log("🖼️ Image URL:", fullUrl);
  }

  return fullUrl;
};

const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

// ============================================
// CATEGORY API
// ============================================
export const addCategoryApi = (categoryData) =>
  Api.post("/api/category/add-category", categoryData);
export const getAllCategoryApi = () => Api.get("/api/category/getAllCategory");
export const updateCategoryApi = (categoryId, categoryData) =>
  Api.put(`/api/category/categories/${categoryId}`, categoryData);
export const deleteCategoryApi = (categoryId) =>
  Api.delete(`/api/category/deleteCategory/${categoryId}`);

// ============================================
// SUBCATEGORY API
// ============================================
export const getAllSubcategoriesApi = () =>
  Api.get("/api/subcategory/subcategories");
export const getSubCategoryByIdApi = () =>
  Api.get("/api/subcategory/subcategory/:id");
export const addSubCategoryApi = (subCategoryData) =>
  Api.post("/api/subcategory/addsubcategory", subCategoryData);
export const getSubCategoriesByCategoryApi = (categoryId) =>
  Api.get(`/api/subcategory/category/${categoryId}`);
export const updateSubCategoryApi = (subCategoryId, subCategoryData) =>
  Api.put(`/api/subcategory/subcategory/${subCategoryId}`, subCategoryData);
export const deleteSubCategoryApi = (subCategoryId) =>
  Api.delete(`/api/subcategory/deleteSubCategory/${subCategoryId}`);

// ============================================
// PRODUCT API
// ============================================
export const getAllProductApi = () => Api.get("/api/product/getAllProducts");
export const getProductByIdApi = (id) =>
  Api.get(`/api/product/getProductById/${id}`);
export const getProductByCategoryApi = (categoryId) =>
  Api.get(`/api/product/category/${categoryId}`);
export const getProductBySku = (sku) =>
  Api.get(`/api/product/getProductBySku/${sku}`);
export const addProductApi = (productData) =>
  Api.post("/api/product/add-product", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editProductByIdApi = (id, productData) =>
  Api.put(`/api/product/updateProductById/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteProductByIdApi = (id) =>
  Api.delete(`/api/product/deleteProductById/${id}`);
export const updateRatingApi = (productId, ratingData) =>
  Api.put(
    `/api/product/updateProductRatingByUser/${productId}`,
    ratingData,
    config
  );
export const getProductsByRatingApi = (userId, productId) =>
  Api.get(`/api/product/getProductRatingByUserId/${userId}/${productId}`);
export const getProductAnalytics = () =>
  Api.get(`${baseURL}/api/product-analytics`);

// ============================================
// ORDER API
// ============================================
export const createOrderApi = (orderData) =>
  Api.post("/api/order/createOrder", orderData);
export const getAllOrderApi = () => Api.get("/api/order/getAllOrders");
export const getAllOrdersByUserIdApi = (userId) =>
  Api.get(`/api/order/orders/${userId}`);
export const updateOrderApi = (orderId, orderData) =>
  Api.put(`/api/order/updateOrder/${orderId}`, orderData);
export const deleteOrderApi = (orderId) =>
  Api.delete(`/api/order/deleteOrder/${orderId}`);

// ============================================
// USER AUTH API
// ============================================
export const loginApi = (loginData) => Api.post("/api/login", loginData);
export const registerApi = (registerData) =>
  Api.post("/api/register", registerData);
export const googleLoginApi = (loginData) =>
  Api.post("/api/auth/google", loginData);
export const logoutUserApi = () => Api.post("/api/logout");
export const getProfileApi = () => Api.get("/api/profile", config);
export const updateProfileApi = (profileData) => {
  return Api.put("/api/updateProfile", profileData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const updatePasswordApi = (passwordData) => {
  return Api.put("/api/change-password", passwordData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// ============================================
// SELF CHECKOUT API
// ============================================
export const processCheckout = (checkoutData) =>
  Api.post("/api/selfcheckout/create", checkoutData);
export const getAllCheckouts = () =>
  Api.get("/api/selfcheckout/getallcheckouts");
export const lookupCheckout = (phone) =>
  Api.get(`/api/selfcheckout/lookup/${phone}`);
export const getCheckoutById = (id) =>
  Api.get(`/api/selfcheckout/checkout/${id}`);
export const getTransactionDetails = (transactionId) =>
  Api.get(`/api/returns/transaction/${transactionId}`);

export const getTransactionDetailsFromCheckout = (transactionId) =>
  Api.get(`/api/selfcheckout/transaction/${transactionId}`);

// ============================================
// CUSTOMER API
// ============================================
export const checkCustomer = (phone) => Api.get(`/api/check-customer/${phone}`);
export const getCustomerHistory = (phone) =>
  Api.get(`/api/customer-history/${phone}`);
export const getTopCustomersApi = () => Api.get("/api/top-customers");
export const getNegativeCustomersApi = () => Api.get("/api/negative-customers");

// ============================================
// RETURN/EXCHANGE API
// ============================================
export const processReturnExchange = (data) =>
  Api.post("/api/selfcheckout/return-exchange", data);
export const processReturn = (data) => Api.post("/api/returns/process", data);
export const getReturnHistory = (phone) =>
  Api.get(`/api/returns/history/${phone}`);

// ============================================
// SALES & ANALYTICS API
// ============================================
export const getTotalCountsApi = () => Api.get("/api/totalcounts");
export const getDailySales = () => Api.get(`${baseURL}/api/daily-sales`);
export const getDailySalesApi = () => Api.get("/api/dailysales");
export const getCategorySalesApi = () => Api.get("/api/category-sales");

// ============================================
// GALLERY API
// ============================================
export const createGalleryApi = (galleryData) =>
  Api.post("/api/gallery/addGallery", galleryData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateGalleryApi = (id, formData) => {
  return Api.put(`/api/gallery/updateGallery/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteGalleryApi = (id) => {
  return Api.delete(`/api/gallery/deleteGallery/${id}`);
};
export const getAllGalleryApi = () => Api.get("/api/gallery/getAllGallery");

// ============================================
// BANNER API
// ============================================
export const createBannerApi = (bannerData) =>
  Api.post("/api/banner/add", bannerData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getAllBannersApi = () => Api.get("/api/banner/banners");
export const deleteBannerApi = (bannerId) =>
  Api.delete(`/api/banner/bannersDelete/${bannerId}`);

// ============================================
// CASHBOOK/EXPENSE TRANSACTION API
// ============================================
export const addTransactionApi = (transactionData) =>
  Api.post("/api/expenses", transactionData);
export const getTransactionsApi = (params) =>
  Api.get("/api/expenses", { params });
export const getTransactionByIdApi = (id) => Api.get(`/api/expenses/${id}`);
export const updateTransactionApi = (id, transactionData) =>
  Api.put(`/api/expenses/${id}`, transactionData);
export const deleteTransactionApi = (id) => Api.delete(`/api/expenses/${id}`);
export const getCashbookSummaryApi = (params) =>
  Api.get("/api/expenses/summary", { params });
export const getTransactionCategoriesApi = () =>
  Api.get("/api/expenses/categories/all");
export const getPaymentMethodsApi = () =>
  Api.get("/api/expenses/payment-methods/all");

export const getDailySummaryApi = (date) =>
  Api.get("/api/expenses/daily-summary", { params: { date } });

export const getPeriodSummaryApi = (params) =>
  Api.get("/api/expenses/period-summary", { params });

export const exportTransactionsApi = (params) =>
  Api.get("/api/expenses/export", {
    params,
    responseType: "blob",
  });

// Staff Management APIs
export const getAllStaffApi = () => Api.get("/api/staff");
export const addStaffApi = (data) => Api.post("/api/staff", data);
export const updateStaffApi = (id, data) => Api.put(`/api/staff/${id}`, data);
export const deleteStaffApi = (id) => Api.delete(`/api/staff/${id}`);
export const toggleStaffStatusApi = (id, data) =>
  Api.patch(`/api/staff/${id}/toggle-status`, data);
export const addStaffAdvanceApi = (staffId, data) =>
  Api.post(`/api/staff/${staffId}/advance`, data);
export const addStaffSalaryPaymentApi = (staffId, data) =>
  Api.post(`/api/staff/${staffId}/salary-payment`, data);
export const deleteStaffAdvanceApi = (staffId, advanceId) =>
  Api.delete(`/api/staff/${staffId}/advance/${advanceId}`);
export const deleteStaffSalaryPaymentApi = (staffId, paymentId) =>
  Api.delete(`/api/staff/${staffId}/salary-payment/${paymentId}`);
export const getStaffSalarySummaryApi = (id, month, year) =>
  Api.get(`/api/staff/${id}/salary-summary?month=${month}&year=${year}`);

export const setManualBalanceApi = (staffId, data) =>
  Api.put(`/api/staff/${staffId}/manual-balance`, data);
export const clearMonthlyRecordsApi = (staffId, data) =>
  Api.post(`/api/staff/${staffId}/clear-monthly`, data);

// Vendor and Staff Management APIs
export const getAllVendorsApi = () => Api.get("/api/vendors");
export const getStaffByVendorApi = (vendorId) => Api.get(`/api/vendors/${vendorId}/staff`);
export const getMyStaffApi = () => Api.get("/api/my-staff");
export const createManagedUserApi = (userData) => Api.post("/api/users", userData);
export const updateVendorApi = (id, data) => Api.put(`/api/users/${id}`, data);
export const deleteVendorApi = (id) => Api.delete(`/api/users/${id}`);
export const deleteStaffByAdminApi = (id) => Api.delete(`/api/users/${id}`);

// Staff Feature Access Control & Activity Log APIs
export const getVendorStaffPermissionsApi = () => Api.get("/api/staff-permissions");
export const updateStaffPermissionsApi = (staffId, permissions) =>
  Api.put(`/api/staff-permissions/${staffId}`, { permissions });
export const getActivityLogsApi = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return Api.get(`/api/activity-logs?${query}`);
};
