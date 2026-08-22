import React, { useState, useEffect } from 'react';
import { loginApi } from '../../Apis/Api'; // Import the login API function
import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logos/logo.png";
import RegisterModal from './RegisterModal';
import toast from 'react-hot-toast';
import googleLogo from "../../assets/logos/google.png";

const ADMIN_ROLES = ['super_admin', 'system_operator', 'system_admin', 'vendor'];
const SALES_ROLES = ['staff'];

const LoginModal = ({ isVisible, onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [emailError, setEmailError] = useState(''); // State for email error message
    const [passwordError, setPasswordError] = useState(''); // State for password error message

    const handleRegisterClick = () => {
        setShowRegisterModal(true);
    };
    const handleCloseModal = () => {
        setShowRegisterModal(false);
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isVisible]);

    if (!isVisible) return null;

    // Function to handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Clear previous error messages
        setEmailError(''); // Clear email error
        setPasswordError(''); // Clear password error

        // Validation
        if (!email) {
            setEmailError('Email is required');
            toast.error('Please enter your email'); // Toast notification
            return;
        }
        if (!password) {
            setPasswordError('Password is required');
            toast.error('Please enter your password'); // Toast notification
            return;
        }
        try {
            const response = await loginApi({ email, password });
            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user)); // Save user details
    
                const userRole = (user.role || '').toLowerCase();

                // Check if the logged-in user is an admin, vendor, or staff member
                if (ADMIN_ROLES.includes(userRole) || user.isAdmin) {
                    navigate("/admindashboard");
                } else if (SALES_ROLES.includes(userRole) || user.isSale) {
                    navigate("/salesdashboard");
                } else {
                    navigate("/");
                }
    
                onLoginSuccess(); // Notify parent that login was successful
                onClose(); // Close the modal on successful login
                toast.success('Login successful!'); // Success toast notification
            } else {
                setError(response.data.message);
                toast.error(response.data.message);
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            toast.error('Login failed. Please try again.');
        }
    };

    // Function to handle outside modal click
    const handleOutsideClick = (e) => {
        if (e.target.id === 'modal-container') {
            onClose();
        }
    };
    const loginWithGoogle = async () => {
        try {
          // Check if token is already present in local storage
          const token = localStorage.getItem('googleToken');
          if (token) return;
      
          // Redirect to Google login URL
          window.location.href = 'https://api.pranucollection.com/auth/google';
      
          // Add event listener to listen for response data from backend
          window.addEventListener('message', async (event) => {
            if (event.origin !== 'https://api.pranucollection.com' || !event.data.googleToken) return;
      
            // Store token in local storage
            localStorage.setItem('googleToken', event.data.googleToken);
      
            // Reload page to fetch user data
            window.location.reload();
          });
        } catch (err) {
          console.error('Error during Google login:', err);
          toast.error('Google login failed. Please try again.');
        }
      };
    

    // Function to handle successful Google login
    // const handleGoogleLoginSuccess = (credentialResponse) => {
    //     console.log('credentialResponse: ', credentialResponse);
    //     const googleToken = credentialResponse.credential;
    //     localStorage.setItem('googleToken', googleToken);

    //     navigate('/'); 
    //     onClose();
    //     toast.success('Google login successful!');
    // };

    return (
        <div 
            id="modal-container" 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4" 
            onClick={handleOutsideClick}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}
        >
            <div className="relative w-full max-w-md my-auto" onClick={(e) => e.stopPropagation()}>
                <div className="glass-panel p-6 lg:p-8 space-y-5">
                    {/* Close Icon */}
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 text-slate-400 hover:text-white focus:outline-none transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Modal Header */}
                    <div className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-orange-400/30 to-pink-500/30 grid place-items-center border border-white/10">
                                <img src={logo} alt="Logo" className="h-10 object-contain" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white valky">Login to Your Account</h2>
                        <p className="text-sm text-slate-400">Welcome back! Please sign in to continue.</p>
                    </div>
                    
                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm text-slate-300 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com" 
                                className={`w-full px-4 py-3 bg-white/5 border ${emailError ? 'border-red-500' : 'border-white/10'} rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none text-white placeholder:text-slate-500 transition`}
                                required
                            />
                            {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <label className="block text-sm text-slate-300 mb-2">Password</label>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password" 
                                className={`w-full px-4 py-3 bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/10'} rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 focus:outline-none text-white placeholder:text-slate-500 transition pr-12`}
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-3 top-[34px] text-slate-400 hover:text-white focus:outline-none transition"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                        <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                                        <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                                        <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
                                    </svg>
                                )}
                            </button>
                            {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className="btn-primary w-full py-3"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Google Login Button */}
                    <button 
                        className='flex justify-center items-center gap-3 w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-white/20 transition' 
                        onClick={loginWithGoogle}
                    >
                        <img src={googleLogo} alt="Google Logo" className="w-5 h-5" />
                        <span>Continue with Google</span>
                    </button>

                    {/* Register link */}
                    <p className="text-center text-sm text-slate-400">
                        Don't have an account?{' '}
                        <button 
                            className="text-orange-400 font-semibold hover:text-orange-300 transition" 
                            onClick={handleRegisterClick}
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>

            {/* Register Modal */}
            {showRegisterModal && (
                <RegisterModal
                    isVisible={showRegisterModal}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default LoginModal;
