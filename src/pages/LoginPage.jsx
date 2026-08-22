import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../Apis/Api";
import { toast } from "react-hot-toast";
import logo from "../assets/logos/logo.png";
import RegisterModal from "./component/RegisterModal";

const ADMIN_ROLES = ["super_admin", "system_operator", "system_admin", "vendor"];
const SALES_ROLES = ["staff"];

// Role badge helper
const ROLE_LABELS = {
  super_admin: { label: "Super Admin", color: "#f59e0b" },
  system_operator: { label: "System Operator", color: "#8b5cf6" },
  system_admin: { label: "System Admin", color: "#3b82f6" },
  vendor: { label: "Vendor", color: "#10b981" },
  staff: { label: "Staff", color: "#f97316" },
  customer: { label: "Customer", color: "#6b7280" },
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Email is required"); return; }
    if (!password) { toast.error("Password is required"); return; }

    setLoading(true);
    try {
      const response = await loginApi({ email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        const userRole = (user.role || "").toLowerCase();
        const roleInfo = ROLE_LABELS[userRole];
        toast.success(`Welcome back! Signed in as ${roleInfo?.label || "User"}`);

        if (ADMIN_ROLES.includes(userRole) || user.isAdmin) {
          navigate("/admindashboard");
        } else if (SALES_ROLES.includes(userRole) || user.isSale) {
          navigate("/salesdashboard");
        } else {
          toast.error("Access denied. You do not have permission to access this system.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } else {
        toast.error(response.data.message || "Login failed.");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── REGISTER MODAL ── */}
      <RegisterModal isVisible={showRegister} onClose={() => setShowRegister(false)} />

      {/* ── LOGIN PAGE ── */}
      <div className="lp-root">
        {/* Animated blobs */}
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
        <div className="lp-blob lp-blob-3" />

        <div className="lp-card-wrap">
          {/* ── Left branding panel ── */}
          <div className="lp-brand">
            <div className="lp-brand-inner">
              <div className="lp-logo-ring">
                <img src={logo} alt="Pranu Collection" className="lp-logo-img" />
              </div>
              <h1 className="lp-brand-name">Pranu<br />Collection</h1>
              <p className="lp-brand-tagline">Inventory Management System</p>

              <div className="lp-role-list">
                <p className="lp-role-heading">Access for</p>
                {[
                  { icon: "🏢", label: "System Admins & Operators" },
                  { icon: "🛍️", label: "Vendor Accounts" },
                  { icon: "👤", label: "Staff Members" },
                ].map((r) => (
                  <div key={r.label} className="lp-role-item">
                    <span className="lp-role-icon">{r.icon}</span>
                    <span>{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right form panel ── */}
          <div className="lp-form-panel">
            <div className="lp-form-header">
              <h2 className="lp-form-title">Sign In</h2>
              <p className="lp-form-sub">Access your dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="lp-form" autoComplete="off">
              {/* Email */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="lp-email">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
                    <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
                  </svg>
                  Email Address
                </label>
                <input
                  id="lp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@pranucollection.com"
                  className="lp-input"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="lp-password">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                    <path fillRule="evenodd" d="M8 7a5 5 0 0 1 9.192-2.706.75.75 0 0 1-1.354.653A3.5 3.5 0 1 0 11.5 10.5h.5a.75.75 0 0 1 0 1.5h-.5a5 5 0 0 1-3.5-8.577V7a5 5 0 0 1 0 0Zm8 0a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5H16v1.5a.75.75 0 0 1-1.5 0V11H13a.75.75 0 0 1 0-1.5h1.5V8.25A.75.75 0 0 1 16 7Z" clipRule="evenodd" />
                  </svg>
                  Password
                </label>
                <div className="lp-input-wrap">
                  <input
                    id="lp-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="lp-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="lp-eye-btn"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="lp-submit-btn" id="lp-submit">
                {loading ? (
                  <span className="lp-loading">
                    <span className="lp-spinner" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                      <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.073a.75.75 0 1 0-1.064-1.055l-2.25 2.31a.75.75 0 0 0 0 1.055l2.25 2.31a.75.75 0 1 0 1.064-1.055l-1.048-1.073H18.25A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                    </svg>
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="lp-divider">
              <span>New to the system?</span>
            </div>

            {/* Register button */}
            <button
              type="button"
              id="lp-register-btn"
              className="lp-register-btn"
              onClick={() => setShowRegister(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="17" height="17">
                <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 0 0 8 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a7 7 0 0 0-13.908 0ZM15.5 7a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5H12.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 15.5 7Z" />
              </svg>
              Create New Account
            </button>

            <p className="lp-footer-note">
              🔒 This portal is for authorized personnel only. All access is logged and monitored.
            </p>
          </div>
        </div>
      </div>

      {/* ── Scoped Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .lp-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0f1e 0%, #0f172a 40%, #1a0a2e 100%);
          position: relative;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
          padding: 16px;
        }

        /* Animated blobs */
        .lp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: lpFloat 8s ease-in-out infinite;
        }
        .lp-blob-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(220,38,38,0.18) 0%, transparent 70%);
          top: -120px; right: -60px;
          animation-delay: 0s;
        }
        .lp-blob-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
          bottom: -100px; left: -80px;
          animation-delay: 3s;
        }
        .lp-blob-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 5s;
        }
        @keyframes lpFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        .lp-blob-3 {
          animation-name: lpFloat3;
        }
        @keyframes lpFloat3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -60%) scale(1.08); }
        }

        /* Card */
        .lp-card-wrap {
          display: flex;
          width: 100%;
          max-width: 900px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 28px;
          overflow: hidden;
          backdrop-filter: blur(24px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
          position: relative;
          z-index: 1;
        }

        /* Brand (left) */
        .lp-brand {
          width: 42%;
          background: linear-gradient(155deg, rgba(220,38,38,0.22) 0%, rgba(124,58,237,0.18) 50%, rgba(15,23,42,0.6) 100%);
          border-right: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
        }
        .lp-brand-inner {
          text-align: center;
          color: #fff;
        }
        .lp-logo-ring {
          width: 88px;
          height: 88px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(220,38,38,0.35), rgba(124,58,237,0.25));
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 32px rgba(220,38,38,0.2);
        }
        .lp-logo-img {
          height: 58px;
          width: auto;
          object-fit: contain;
        }
        .lp-brand-name {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.2;
          color: #fff;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .lp-brand-tagline {
          font-size: 12px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 36px;
        }
        .lp-role-heading {
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
        }
        .lp-role-list {
          text-align: left;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 16px;
        }
        .lp-role-item {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255,255,255,0.7);
          font-size: 13px;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .lp-role-item:last-child { border-bottom: none; }
        .lp-role-icon { font-size: 16px; }

        /* Form (right) */
        .lp-form-panel {
          flex: 1;
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .lp-form-header { margin-bottom: 28px; }
        .lp-form-title {
          font-size: 28px;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .lp-form-sub { font-size: 14px; color: rgba(255,255,255,0.4); }

        .lp-form { display: flex; flex-direction: column; gap: 18px; }

        .lp-field { display: flex; flex-direction: column; gap: 6px; }
        .lp-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.01em;
        }
        .lp-input-wrap { position: relative; }
        .lp-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #f1f5f9;
          font-size: 14px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .lp-input::placeholder { color: rgba(255,255,255,0.22); }
        .lp-input:focus {
          border-color: rgba(220,38,38,0.6);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.1);
        }
        .lp-input-wrap .lp-input { padding-right: 44px; }
        .lp-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 6px;
          transition: color 0.2s;
        }
        .lp-eye-btn:hover { color: rgba(255,255,255,0.7); }

        .lp-submit-btn {
          width: 100%;
          padding: 13px 20px;
          background: linear-gradient(135deg, #dc2626, #9333ea);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(220,38,38,0.3);
          margin-top: 4px;
        }
        .lp-submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(220,38,38,0.4);
        }
        .lp-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .lp-loading { display: flex; align-items: center; gap: 8px; }
        .lp-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lpSpin 0.7s linear infinite;
        }
        @keyframes lpSpin { to { transform: rotate(360deg); } }

        .lp-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 14px;
          color: rgba(255,255,255,0.25);
          font-size: 12px;
        }
        .lp-divider::before, .lp-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .lp-register-btn {
          width: 100%;
          padding: 12px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
        }
        .lp-register-btn:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.22);
          color: #fff;
          transform: translateY(-1px);
        }

        .lp-footer-note {
          margin-top: 20px;
          font-size: 11px;
          color: rgba(255,255,255,0.22);
          text-align: center;
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 680px) {
          .lp-card-wrap { flex-direction: column; }
          .lp-brand {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding: 32px 24px;
          }
          .lp-form-panel { padding: 32px 24px; }
          .lp-brand-name { font-size: 22px; }
          .lp-role-list { display: none; }
        }
      `}</style>
    </>
  );
};

export default LoginPage;
