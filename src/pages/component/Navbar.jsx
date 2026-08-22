import React, { useState, useEffect } from "react";
import logo from "../../assets/logos/logo.png";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { baseURL, getAllProductApi, logoutUserApi } from "../../Apis/Api";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const location = useLocation();
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
      }
    };

    const timeoutId = setTimeout(() => {
      checkLoginStatus();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getAllProductApi()
      .then((response) => {
        const productData = response.data.products || [];
        setProducts(productData);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter((product) => {
        console.log("Product during filtering:", product);
        return (
          product.name.toLowerCase().includes(searchText.toLowerCase()) &&
          product.showProductinSite === true
        );
      });
      setFilteredProducts(filtered);
    }
  }, [searchText, products]);

  const handleIconClick = () => {
    setIsInputVisible(!isInputVisible);
  };

  const handleRemoveClick = () => {
    setSearchText("");
    setIsInputVisible(false);
  };

  const handleProductClick = (id) => {
    console.log("Navigating to product ID:", id);
    if (!id) {
      console.error("Product ID is undefined.");
      return;
    }
    navigate(`/viewProduct/${id}`);
  };

  const cart = useSelector((state) => state.cartReducer.cart);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (location.pathname === "/admindashboard") {
    return null;
  }
  if (location.pathname === "/salesdashboard") {
    return null;
  }

  const handleLogout = async () => {
    try {
      try {
        await logoutUserApi();
      } catch (apiError) {
        console.log("Logout API call failed (non-critical):", apiError);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("hasReloadedProfile");
      localStorage.removeItem("user");
      setIsLoggedIn(false);

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("hasReloadedProfile");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
      toast.success("Logged out");
    }
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleProfileClick = () => {
    const hasReloaded = localStorage.getItem("hasReloadedProfile");

    if (!hasReloaded) {
      localStorage.setItem("hasReloadedProfile", "true");
      window.location.href = "/profile";
    } else {
      navigate("/profile");
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 bg-gradient-to-r from-red-950 via-red-900 to-red-950 border-b border-red-800/30 ${
        isScrolled ? "shadow-lg shadow-red-950/50" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between py-4 items-center">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500/30 to-rose-600/30 grid place-items-center border border-red-400/20">
              <img src={logo} alt="logo" className="h-8 object-contain" />
            </div>
            <div className="hidden sm:block">
              <p className="text-red-50 font-semibold leading-tight">
                Pranu Collection
              </p>
              <p className="text-xs text-red-200">
                Mero Pahiran. Mero Pahichan.
              </p>
            </div>
          </NavLink>
          <div className="hidden md:flex gap-6 items-center">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "text-red-50 font-semibold border-b-2 border-red-500 pb-1"
                  : "text-red-200 hover:text-red-50 transition"
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/category"
              className={({ isActive }) =>
                isActive
                  ? "text-red-50 font-semibold border-b-2 border-red-500 pb-1"
                  : "text-red-200 hover:text-red-50 transition"
              }
            >
              Category
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                isActive
                  ? "text-red-50 font-semibold border-b-2 border-red-500 pb-1"
                  : "text-red-200 hover:text-red-50 transition"
              }
            >
              Gallery
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-red-50 font-semibold border-b-2 border-red-500 pb-1"
                  : "text-red-200 hover:text-red-50 transition"
              }
            >
              About
            </NavLink>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-red-200 cursor-pointer hover:text-red-50 transition"
                onClick={handleIconClick}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>

              {isInputVisible && (
                <div className="absolute top-[-8px] right-0 flex flex-col bg-gradient-to-br from-red-950 to-red-900 text-red-50 rounded-xl border border-red-700/40 shadow-2xl shadow-red-950/50 px-4 py-3 z-50 w-[280px]">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search outfits, colors, sizes..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full bg-red-950/50 rounded-lg text-sm border border-red-700/40 focus:border-red-500 px-3 py-2 outline-none text-red-50 placeholder-red-300"
                    />
                    <button
                      className="p-2 text-red-300 rounded hover:text-red-50 transition"
                      onClick={handleRemoveClick}
                      aria-label="Clear search"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {searchText.trim() && (
                    <div className="mt-4 max-h-64 overflow-y-auto space-y-2">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-red-800/30 transition"
                            onClick={() => handleProductClick(product._id)}
                          >
                            <img
                              src={`${baseURL}/${product.images[0]}`}
                              alt={product.name}
                              className="h-12 w-10 object-cover rounded-lg border border-red-700/40"
                            />
                            <span className="font-medium text-sm text-red-50">
                              {product.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-red-300">
                          No products found.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <div className="hidden md:block">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6 hover:text-red-50 text-red-200 transition"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                        />
                      </svg>
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-gradient-to-br from-red-950 to-red-900 border border-red-700/40 shadow-xl shadow-red-950/50 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <div className="py-1">
                      <MenuItem>
                        <Link
                          to="/profile"
                          onClick={handleProfileClick}
                          className="block px-4 py-2 text-sm text-red-100 data-[focus]:bg-red-800/30 data-[focus]:text-red-50 transition"
                        >
                          Account settings
                        </Link>
                      </MenuItem>
                      <MenuItem>
                        <Link
                          to="/faq"
                          className="block px-4 py-2 text-sm text-red-100 data-[focus]:bg-red-800/30 data-[focus]:text-red-50 transition"
                        >
                          Support
                        </Link>
                      </MenuItem>

                      <hr className="border-red-800/40" />
                      <form>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              type="button"
                              onClick={handleLogout}
                              className={`${
                                active ? "bg-red-800/30" : ""
                              } block w-full px-4 py-2 text-left text-sm text-red-100 transition`}
                            >
                              Logout
                            </button>
                          )}
                        </MenuItem>
                      </form>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            ) : (
              <>
                <button
                  className="hidden md:block text-red-100 hover:text-red-50 font-semibold transition"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
                <button
                  className="hidden md:block px-3 py-2 rounded-lg border border-red-700/40 text-red-100 hover:border-red-500 hover:text-red-50 hover:bg-red-800/20 transition"
                  onClick={handleRegisterClick}
                >
                  Register
                </button>
              </>
            )}

            <Link to="/addCart" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 hover:text-red-50 text-red-200 transition"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <span className="absolute right-[-14px] top-[-10px] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-full shadow-lg">
                {cart.length}
              </span>
            </Link>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-red-50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9h16.5m-16.5 6.75h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-0 right-0 w-72 h-full bg-gradient-to-br from-red-950 to-red-900 border-l border-red-700/40 shadow-lg p-5 transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } ease-in-out duration-300 z-50`}
      >
        <button
          className="absolute top-4 right-4 text-red-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6m0 12L6 6"
            />
          </svg>
        </button>
        <nav className="mt-6">
          <ul className="space-y-4 text-red-100">
            <li>
              <NavLink
                to="/"
                className="text-red-100 hover:text-red-50 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category"
                className="text-red-100 hover:text-red-50 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Category
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/gallery"
                className="text-red-100 hover:text-red-50 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="text-red-100 hover:text-red-50 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li className="pt-4 border-t border-red-800/40">
              {isLoggedIn ? (
                <>
                  <button
                    className="text-red-100 hover:text-red-50 transition"
                    onClick={() => {
                      handleProfileClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    Profile
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-red-100 hover:text-red-50 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-red-100 hover:text-red-50 transition"
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="text-red-100 hover:text-red-50 transition"
                    onClick={() => {
                      setShowRegisterModal(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    {" "}
                    / Register
                  </button>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Modals */}
      <LoginModal
        isVisible={showLoginModal}
        onClose={handleCloseModal}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterModal isVisible={showRegisterModal} onClose={handleCloseModal} />
    </div>
  );
};

export default Navbar;
