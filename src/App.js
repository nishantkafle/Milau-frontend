import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getProfileApi } from "./Apis/Api";
import "./app.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoutes from "./PrivateRoutes/AdminRoutes";
import { Toaster } from "react-hot-toast";
import SalesDashboard from "./pages/sales/SalesDashboard.jsx";
import SalesRoutes from "./PrivateRoutes/SalesRoutes.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // If token exists and user is already stored, don't fetch profile again
    if (token && storedUser) {
      setLoading(false);
      return;
    }

    // If token exists but user is not in localStorage, fetch the profile
    const fetchProfile = async () => {
      try {
        if (token) {
          const profileResponse = await getProfileApi();
          const user = profileResponse.data.user;
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  // Show loading indicator while login state is being confirmed
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-red-900 to-rose-950 text-white">
        <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="h-3 w-3 bg-gradient-to-r from-red-400 to-rose-500 rounded-full animate-pulse" />
          <span className="tracking-wide text-sm text-red-200">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Login page — default entry point */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected Admin Route */}
          <Route element={<AdminRoutes />}>
            <Route path="/admindashboard" element={<AdminDashboard />} />
          </Route>

          {/* Protected Sales Route */}
          <Route element={<SalesRoutes />}>
            <Route path="/salesdashboard" element={<SalesDashboard />} />
          </Route>

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
