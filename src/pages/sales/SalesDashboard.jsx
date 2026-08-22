import CheckoutAdmin from '../admin/selfCheckout/CheckoutAdmin'
import Dashboard from '../admin/Dashboard'
import React, { useState, useEffect } from 'react';
import logo from "../../assets/logos/logo.png";
import CurrentDate from '../component/CurrentDate';
import { toast } from 'react-hot-toast';
import { logoutUserApi, updatePasswordApi } from '../../Apis/Api';
import { ProductProvider } from '../../context/ProductContext.jsx';
import StaffAttendance from './StaffAttendance.jsx';
import UserProfileSection from '../component/UserProfileSection.jsx';
import ProfileSettingsPage from '../profile/ProfileSettingsPage.jsx';
import AddProduct from '../admin/addProduct/AddProduct.jsx';
import ExpenseManagement from '../admin/ExpenseManagement/main.jsx';
import BusinessManagement from '../admin/ManageBills/BusinessManagement.jsx';

const SalesDashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
    }, []);

    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };
  
    const [activeContainer, setActiveContainer] = useState('dashboard');
  
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('hasReloadedProfile');
            toast.success('Logged out successfully');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('hasReloadedProfile');
            toast.success('Logged out');
            window.location.href = '/';
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (!passwordData.oldPassword || !passwordData.newPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setUpdatingPassword(true);
            const response = await updatePasswordApi(passwordData);
            if (response.data.success) {
                toast.success('Password changed successfully');
                setShowPasswordModal(false);
                setPasswordData({ oldPassword: '', newPassword: '' });
            } else {
                toast.error(response.data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error(error.response?.data?.message || 'Error changing password');
        } finally {
            setUpdatingPassword(false);
        }
    };
  
    return (
        <ProductProvider>
            <div className="min-h-screen bg-gray-50">
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
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <div className="flex items-center ms-2 md:me-24">
                                    <img src={logo} className="h-10 me-3" alt="Logo" />
                                    <div className="hidden sm:block">
                                        <h1 className="text-xl font-bold text-gray-800">
                                            Pranu Collection
                                        </h1>
                                        <p className="text-xs text-gray-500">Staff Portal</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center gap-3">
                                    <CurrentDate />
                                    <div className="h-6 w-px bg-gray-300"></div>
                                    <span className="text-sm font-medium text-gray-700">
                                        Staff Dashboard
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
                            <li>
                                <button
                                    onClick={() => handleContainerChange('dashboard')}
                                    className={`w-full flex items-center p-3 text-gray-700 rounded-lg transition-all duration-200 group ${
                                        activeContainer === 'dashboard'
                                            ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                                            : "hover:bg-gray-100 hover:text-[#AB3430]"
                                    }`}
                                >
                                    <span className={activeContainer === 'dashboard' ? 'text-white' : 'text-gray-500 group-hover:text-[#AB3430]'}>
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
                                    </span>
                                    <span className="ms-3 font-medium">Dashboard</span>
                                </button>
                            </li>
                            {(!user?.permissions || user.permissions.includes("selfCheckout")) && (
                                <li>
                                    <button
                                        onClick={() => handleContainerChange('selfCheckout')}
                                        className={`w-full flex items-center p-3 text-gray-700 rounded-lg transition-all duration-200 group ${
                                            activeContainer === 'selfCheckout'
                                                ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                                                : "hover:bg-gray-100 hover:text-[#AB3430]"
                                        }`}
                                    >
                                        <span className={activeContainer === 'selfCheckout' ? 'text-white' : 'text-gray-500 group-hover:text-[#AB3430]'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
                                                <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
                                            </svg>
                                        </span>
                                        <span className="ms-3 font-medium">Self Checkout</span>
                                    </button>
                                </li>
                            )}
                            {(!user?.permissions || user.permissions.includes("attendance")) && (
                                <li>
                                    <button
                                        onClick={() => handleContainerChange('attendance')}
                                        className={`w-full flex items-center p-3 text-gray-700 rounded-lg transition-all duration-200 group ${
                                            activeContainer === 'attendance'
                                                ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                                                : "hover:bg-gray-100 hover:text-[#AB3430]"
                                        }`}
                                    >
                                        <span className={activeContainer === 'attendance' ? 'text-white' : 'text-gray-500 group-hover:text-[#AB3430]'}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M6.75 3a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 006.75 21h10.5A2.25 2.25 0 0019.5 18.75V5.25A2.25 2.25 0 0017.25 3H6.75zm1.5 4.5a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75zm6 0a.75.75 0 00-.75.75v7.5a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span className="ms-3 font-medium">Attendance</span>
                                    </button>
                                </li>
                            )}
                            {user?.permissions?.includes("products") && (
                                <li>
                                    <button
                                        onClick={() => handleContainerChange('products')}
                                        className={`w-full flex items-center p-3 text-gray-700 rounded-lg transition-all duration-200 group ${
                                            activeContainer === 'products'
                                                ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                                                : "hover:bg-gray-100 hover:text-[#AB3430]"
                                        }`}
                                    >
                                        <span className={activeContainer === 'products' ? 'text-white' : 'text-gray-500 group-hover:text-[#AB3430]'}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </span>
                                        <span className="ms-3 font-medium">Product Catalog</span>
                                    </button>
                                </li>
                            )}
                            {user?.permissions?.includes("expenses") && (
                                <li>
                                    <button
                                        onClick={() => handleContainerChange('expenses')}
                                        className={`w-full flex items-center p-3 text-gray-700 rounded-lg transition-all duration-200 group ${
                                            activeContainer === 'expenses'
                                                ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                                                : "hover:bg-gray-100 hover:text-[#AB3430]"
                                        }`}
                                    >
                                        <span className={activeContainer === 'expenses' ? 'text-white' : 'text-gray-500 group-hover:text-[#AB3430]'}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </span>
                                        <span className="ms-3 font-medium">Expenses</span>
                                    </button>
                                </li>
                            )}
                            {user?.permissions?.includes("business") && (
                                <li>
                                    <button
                                        onClick={() => handleContainerChange('business')}
                                        className={`w-full flex items-center p-3 text-gray-700 rounded-lg transition-all duration-200 group ${
                                            activeContainer === 'business'
                                                ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                                                : "hover:bg-gray-100 hover:text-[#AB3430]"
                                        }`}
                                    >
                                        <span className={activeContainer === 'business' ? 'text-white' : 'text-gray-500 group-hover:text-[#AB3430]'}>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span className="ms-3 font-medium">Business Bills</span>
                                    </button>
                                </li>
                            )}

                            {/* User Profile & Account Settings Section */}
                            <li className="pt-4 mt-4 border-t border-gray-200">
                                <UserProfileSection
                                    user={user}
                                    setUser={setUser}
                                    onLogoutClick={handleLogoutClick}
                                    onSelectSettings={() => handleContainerChange('profileSettings')}
                                />
                            </li>
                        </ul>
                    </div>
                </aside>

                <div className="sm:ml-64 pt-20">
                    <div className="p-4 sm:p-6">
                        {activeContainer === 'dashboard' && <Dashboard/>}
                        {activeContainer === 'selfCheckout' && <CheckoutAdmin />}
                        {activeContainer === 'attendance' && <StaffAttendance />}
                        {activeContainer === 'products' && <AddProduct />}
                        {activeContainer === 'expenses' && <ExpenseManagement />}
                        {activeContainer === 'business' && <BusinessManagement />}
                        {activeContainer === 'profileSettings' && (
                            <ProfileSettingsPage user={user} setUser={setUser} />
                        )}
                    </div>
                </div>

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
                                Are you sure you want to logout? You will need to login again to access your account.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
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

                {/* Account Modal */}
                {showAccountModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">My Account</h3>
                                <button
                                    onClick={() => setShowAccountModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-medium text-gray-900">{user?.name}</h4>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <button
                                        onClick={() => {
                                            setShowAccountModal(false);
                                            setShowPasswordModal(true);
                                        }}
                                        className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                                <button
                                    onClick={() => setShowPasswordModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB3430]"
                                        placeholder="Enter current password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        required
                                        minLength={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB3430]"
                                        placeholder="Enter new password (min 6 characters)"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updatingPassword}
                                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#AB3430] to-[#c94542] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updatingPassword ? "Changing..." : "Change Password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProductProvider>
    )
}

export default SalesDashboard
