import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import logo from "../../assets/logos/logo.png";
import { logoutUserApi } from "../../Apis/Api";
import { ProductProvider } from "../../context/ProductContext.jsx";
import AddProduct from "./addProduct/AddProduct.jsx";
import Dashboard from "./Dashboard.jsx";
import AddCategory from "./addCategory/AddCategory.jsx";
import CurrentDate from "../component/CurrentDate.jsx";
import AddSubCategory from "./addCategory/AddSubCategory.jsx";
import CheckoutAdmin from "./selfCheckout/CheckoutAdmin.jsx";
import TimeFrame from "./TimeFrame/TimeFrame.jsx";
import AttendanceSystem from "./ManageStaff/ManageStaff.jsx";
import BusinessManagement from "./ManageBills/BusinessManagement.jsx";
import ExpenseManagement from "./ExpenseManagement/main.jsx";
import SystemAdminDashboard from "./SystemAdminDashboard.jsx";
import UserProfileSection from "../component/UserProfileSection.jsx";
import ProfileSettingsPage from "../profile/ProfileSettingsPage.jsx";
import StaffPermissionsManager from "./ManageStaff/StaffPermissionsManager.jsx";
import ActivityLogViewer from "./ActivityLogs/ActivityLogViewer.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeContainer, setActiveContainer] = useState("dashboard");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get current user
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "{}"));
  const userRole = (user?.role || "").toLowerCase();
  
  // Check if user is system admin
  const isSystemAdmin = userRole === "system_admin";
  // Check if user is vendor
  const isVendor = userRole === "vendor";

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleContainerChange = (containerName) => {
    setActiveContainer(containerName);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 640) {
      setSidebarOpen(false);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUserApi();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("hasReloadedProfile");
      toast.success("Logged out successfully");
      // Use window.location for full page reload with navigation
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("hasReloadedProfile");
      toast.success("Logged out");
      window.location.href = "/";
    }
    // No finally block needed as page will reload
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  // Sidebar menu items configuration
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },

    {
      id: "addProduct",
      label: "Products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.684 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
        </svg>
      ),
    },
    {
      id: "selfCheckout",
      label: "Self Checkout",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.5c.98 0 1.813.626 2.122 1.5H2.25a.75.75 0 0 0 0 1.5h3.622a2.251 2.251 0 0 0 2.122 1.5H2.25a.75.75 0 0 0 0 1.5h6a2.25 2.25 0 0 0 2.122-1.5H21.75a.75.75 0 0 0 0-1.5h-8.628A2.251 2.251 0 0 0 11 4.5H8.628A2.251 2.251 0 0 0 6.5 3H2.25Z" />
          <path
            fillRule="evenodd"
            d="M15.75 10.5a4.5 4.5 0 0 1 4.284 5.772c.341.059.683.088 1.035.088 3.314 0 6-2.686 6-6s-2.686-6-6-6c-.352 0-.694.029-1.035.088A4.5 4.5 0 0 1 15.75 10.5ZM15 6a3 3 0 0 0-2.83 4h5.66A3 3 0 0 0 15 6Zm-9 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "timeframe",
      label: "Stock TimeFrame",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "staff",
      label: "Staff",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
        </svg>
      ),
    },
    {
      id: "business",
      label: "Business",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
          <path
            fillRule="evenodd"
            d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25a.75.75 0 0 1 .75.75v16.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V3a.75.75 0 0 1 .75-.75ZM6.75 9.75a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 3a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5h-9Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "addcategory",
      label: "Categories",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
        </svg>
      ),
    },
    {
      id: "addsubcategory",
      label: "Sub Categories",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
        </svg>
      ),
    },
    ...(isSystemAdmin ? [{
      id: "systemAdmin",
      label: "System Admin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
          <path d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
          <path d="M6 13.5A7.5 7.5 0 0 0 13.5 21V13.5H6Z" />
        </svg>
      ),
    }] : []),
    ...(isVendor || isSystemAdmin ? [
      {
        id: "staffPermissions",
        label: "Staff Access Control",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        id: "activityLogs",
        label: "Activity Logs",
        icon: (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ] : []),

  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-red-600"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Confirm Logout
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to logout? You will need to login again to
                access the admin panel.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoggingOut ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Logging out...
                    </>
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Navigation Bar */}
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  type="button"
                  className="inline-flex items-center p-2 text-sm text-gray-600 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#AB3430] transition-colors"
                >
                  <span className="sr-only">Open sidebar</span>
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex items-center ms-2 md:me-24">
                  <img src={logo} className="h-10 me-3" alt="Logo" />
                  <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-gray-800">
                      Pranu Collection
                    </h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-3">
                  <CurrentDate />
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Admin Dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0 bg-white border-r border-gray-200 shadow-lg`}
          aria-label="Sidebar"
        >
          <div className="h-full px-3 pb-4 overflow-y-auto">
            <ul className="space-y-1 font-medium">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleContainerChange(item.id)}
                    className={`w-full flex items-center p-3 text-gray-700 rounded-lg transition-all duration-200 group ${
                      activeContainer === item.id
                        ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                        : "hover:bg-gray-100 hover:text-[#AB3430]"
                    }`}
                  >
                    <span
                      className={`${
                        activeContainer === item.id
                          ? "text-white"
                          : "text-gray-500 group-hover:text-[#AB3430]"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span
                      className={`ms-3 font-medium ${
                        activeContainer === item.id ? "text-white" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}

              {/* User Profile & Account Settings Section */}
              <li className="pt-4 mt-4 border-t border-gray-200">
                <UserProfileSection
                  user={user}
                  setUser={setUser}
                  onLogoutClick={handleLogoutClick}
                  onSelectSettings={() => handleContainerChange("profileSettings")}
                />
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="sm:ml-64 pt-20">
          <ProductProvider>
            <div className="p-4 sm:p-6">
              {activeContainer === "dashboard" && (
                <Dashboard setActiveContainer={setActiveContainer} />
              )}
              {activeContainer === "addProduct" && <AddProduct />}
              {activeContainer === "addcategory" && <AddCategory />}
              {activeContainer === "selfCheckout" && <CheckoutAdmin />}
              {activeContainer === "addsubcategory" && <AddSubCategory />}
              {activeContainer === "timeframe" && <TimeFrame />}
              {activeContainer === "staff" && <AttendanceSystem />}
              {activeContainer === "business" && <BusinessManagement />}
              {activeContainer === "expenses" && <ExpenseManagement />}
              {activeContainer === "systemAdmin" && <SystemAdminDashboard />}
              {activeContainer === "vendorStaff" && <AttendanceSystem />}
              {activeContainer === "profileSettings" && (
                <ProfileSettingsPage user={user} setUser={setUser} />
              )}
              {activeContainer === "staffPermissions" && <StaffPermissionsManager />}
              {activeContainer === "activityLogs" && <ActivityLogViewer />}
            </div>
          </ProductProvider>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
