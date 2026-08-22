import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { registerApi } from '../../Apis/Api';
import logo from '../../assets/logos/logo.png';

const ROLES = [
  {
    value: 'staff',
    label: 'Staff',
    icon: '👤',
    desc: 'Sales & floor staff access',
    color: '#f97316',
  },
  {
    value: 'vendor',
    label: 'Vendor',
    icon: '🛍️',
    desc: 'Supplier & vendor account',
    color: '#10b981',
  },
  {
    value: 'customer',
    label: 'Customer',
    icon: '🛒',
    desc: 'General customer account',
    color: '#6366f1',
  },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'staff',
  street: '',
  city: '',
  country: '',
};

const RegisterModal = ({ isVisible, onClose }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = role select, 2 = details

  if (!isVisible) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === 'rm-backdrop') onClose();
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setStep(1);
    setLoading(false);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!emailRe.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters.';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    if (!formData.street.trim()) newErrors.street = 'Street address is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (!formData.country) newErrors.country = 'Please select a country.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.role) { toast.error('Please select a role.'); return; }
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) {
      toast.error('Please fix the highlighted errors.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = formData;
      const response = await registerApi(payload);
      if (response.data.success) {
        toast.success(`Account created successfully! You can now sign in as ${formData.role}.`);
        handleClose();
      } else {
        toast.error(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const selectedRole = ROLES.find((r) => r.value === formData.role);

  return (
    <>
      <div
        id="rm-backdrop"
        className="rm-backdrop"
        onClick={handleOutsideClick}
      >
        <div className="rm-modal" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="rm-header">
            <div className="rm-header-left">
              <div className="rm-logo-wrap">
                <img src={logo} alt="Logo" className="rm-logo" />
              </div>
              <div>
                <h2 className="rm-title">Create Account</h2>
                <p className="rm-subtitle">
                  {step === 1 ? 'Select your account type' : `Registering as ${selectedRole?.label}`}
                </p>
              </div>
            </div>
            <button className="rm-close-btn" onClick={handleClose} aria-label="Close modal">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div className="rm-steps">
            {['Role', 'Details'].map((s, i) => (
              <div key={s} className={`rm-step ${step > i ? 'rm-step-done' : ''} ${step === i + 1 ? 'rm-step-active' : ''}`}>
                <div className="rm-step-circle">
                  {step > i + 1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className="rm-step-label">{s}</span>
              </div>
            ))}
            <div className="rm-step-line" />
          </div>

          {/* ── STEP 1: Role Selection ── */}
          {step === 1 && (
            <div className="rm-step1">
              <p className="rm-step1-hint">Choose the type of account you want to create:</p>
              <div className="rm-role-grid">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    className={`rm-role-card ${formData.role === r.value ? 'rm-role-card-active' : ''}`}
                    style={formData.role === r.value ? { '--rc': r.color } : {}}
                    onClick={() => setFormData((p) => ({ ...p, role: r.value }))}
                  >
                    <span className="rm-role-icon">{r.icon}</span>
                    <span className="rm-role-name">{r.label}</span>
                    <span className="rm-role-desc">{r.desc}</span>
                    {formData.role === r.value && (
                      <span className="rm-role-check">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="rm-next-btn"
                onClick={handleNextStep}
              >
                Continue
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {/* ── STEP 2: Account Details ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="rm-form" noValidate>
              <div className="rm-form-grid">
                {/* Full Name */}
                <div className="rm-field">
                  <label className="rm-label" htmlFor="rm-name">Full Name</label>
                  <input
                    id="rm-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`rm-input ${errors.name ? 'rm-input-err' : ''}`}
                  />
                  {errors.name && <p className="rm-err">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="rm-field">
                  <label className="rm-label" htmlFor="rm-email">Email Address</label>
                  <input
                    id="rm-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`rm-input ${errors.email ? 'rm-input-err' : ''}`}
                  />
                  {errors.email && <p className="rm-err">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="rm-field rm-field-full rm-input-wrap-outer">
                  <label className="rm-label" htmlFor="rm-password">Password</label>
                  <div className="rm-input-pw-wrap">
                    <input
                      id="rm-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 6 characters"
                      className={`rm-input ${errors.password ? 'rm-input-err' : ''}`}
                    />
                    <button type="button" className="rm-eye" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword
                        ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                      }
                    </button>
                  </div>
                  {errors.password && <p className="rm-err">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="rm-field rm-field-full">
                  <label className="rm-label" htmlFor="rm-confirm">Confirm Password</label>
                  <div className="rm-input-pw-wrap">
                    <input
                      id="rm-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`rm-input ${errors.confirmPassword ? 'rm-input-err' : ''}`}
                    />
                    <button type="button" className="rm-eye" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm
                        ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="16" height="16"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                      }
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="rm-err">{errors.confirmPassword}</p>}
                </div>

                {/* Address section */}
                <div className="rm-section-label rm-field-full">📍 Address Information</div>

                {/* Street */}
                <div className="rm-field">
                  <label className="rm-label" htmlFor="rm-street">Street Address</label>
                  <input
                    id="rm-street"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className={`rm-input ${errors.street ? 'rm-input-err' : ''}`}
                  />
                  {errors.street && <p className="rm-err">{errors.street}</p>}
                </div>

                {/* City */}
                <div className="rm-field">
                  <label className="rm-label" htmlFor="rm-city">City</label>
                  <input
                    id="rm-city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Kathmandu"
                    className={`rm-input ${errors.city ? 'rm-input-err' : ''}`}
                  />
                  {errors.city && <p className="rm-err">{errors.city}</p>}
                </div>

                {/* Country */}
                <div className="rm-field rm-field-full">
                  <label className="rm-label" htmlFor="rm-country">Country</label>
                  <select
                    id="rm-country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`rm-input rm-select ${errors.country ? 'rm-input-err' : ''}`}
                  >
                    <option value="">Select your country</option>
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="UAE">UAE</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.country && <p className="rm-err">{errors.country}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="rm-actions">
                <button
                  type="button"
                  className="rm-back-btn"
                  onClick={() => { setStep(1); setErrors({}); }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="rm-submit-btn"
                  disabled={loading}
                  id="rm-submit"
                >
                  {loading ? (
                    <span className="rm-loading">
                      <span className="rm-spinner" /> Creating Account...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2.046 15.253c-.058.468.172.92.57 1.175A9.953 9.953 0 0 0 8 18c1.982 0 3.83-.578 5.384-1.573.398-.254.628-.707.57-1.175a7 7 0 0 0-13.908 0ZM15.5 7a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5H12.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 15.5 7Z" />
                      </svg>
                      Create Account
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ── Scoped styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .rm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .rm-modal {
          background: linear-gradient(160deg, #111827 0%, #0f172a 100%);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 600px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .rm-modal::-webkit-scrollbar { width: 4px; }
        .rm-modal::-webkit-scrollbar-track { background: transparent; }
        .rm-modal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        /* Header */
        .rm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .rm-header-left { display: flex; align-items: center; gap: 14px; }
        .rm-logo-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(220,38,38,0.3), rgba(124,58,237,0.2));
          border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .rm-logo { height: 30px; object-fit: contain; }
        .rm-title { font-size: 20px; font-weight: 700; color: #f8fafc; letter-spacing: -0.02em; margin: 0; }
        .rm-subtitle { font-size: 12px; color: rgba(255,255,255,0.4); margin: 0; }
        .rm-close-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          padding: 6px;
          transition: background 0.2s, color 0.2s;
        }
        .rm-close-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

        /* Steps */
        .rm-steps {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
        }
        .rm-step {
          display: flex;
          align-items: center;
          gap: 8px;
          z-index: 1;
        }
        .rm-step-circle {
          width: 24px; height: 24px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 600;
          color: rgba(255,255,255,0.4);
          transition: all 0.3s;
        }
        .rm-step-active .rm-step-circle {
          background: linear-gradient(135deg, #dc2626, #7c3aed);
          border-color: transparent;
          color: #fff;
        }
        .rm-step-done .rm-step-circle {
          background: #10b981;
          border-color: transparent;
          color: #fff;
        }
        .rm-step-label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          font-weight: 500;
        }
        .rm-step-active .rm-step-label { color: rgba(255,255,255,0.8); }
        .rm-step-done .rm-step-label { color: #10b981; }
        .rm-step-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
          margin: 0 4px;
        }

        /* Step 1 */
        .rm-step1 { padding: 24px 28px 28px; }
        .rm-step1-hint {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          margin-bottom: 20px;
        }
        .rm-role-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }
        @media (max-width: 480px) {
          .rm-role-grid { grid-template-columns: 1fr; }
        }
        .rm-role-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 20px 12px;
          background: rgba(255,255,255,0.04);
          border: 1.5px solid rgba(255,255,255,0.09);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          text-align: center;
          font-family: inherit;
        }
        .rm-role-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .rm-role-card-active {
          background: rgba(255,255,255,0.07);
          border-color: var(--rc, #dc2626) !important;
          box-shadow: 0 0 0 1px var(--rc, #dc2626), 0 4px 20px rgba(0,0,0,0.3);
        }
        .rm-role-icon { font-size: 26px; }
        .rm-role-name { font-size: 14px; font-weight: 600; color: #f1f5f9; }
        .rm-role-desc { font-size: 11px; color: rgba(255,255,255,0.4); }
        .rm-role-check {
          position: absolute;
          top: 8px;
          right: 8px;
          color: var(--rc, #dc2626);
        }
        .rm-next-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #dc2626, #7c3aed);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
        }
        .rm-next-btn:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Step 2 form */
        .rm-form { padding: 20px 28px 28px; }
        .rm-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        @media (max-width: 500px) {
          .rm-form-grid { grid-template-columns: 1fr; }
        }
        .rm-field { display: flex; flex-direction: column; gap: 5px; }
        .rm-field-full { grid-column: 1 / -1; }
        .rm-label {
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          letter-spacing: 0.01em;
        }
        .rm-input {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 10px 14px;
          color: #f1f5f9;
          font-size: 13.5px;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .rm-input::placeholder { color: rgba(255,255,255,0.2); }
        .rm-input:focus {
          border-color: rgba(124,58,237,0.6);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }
        .rm-input-err { border-color: rgba(239,68,68,0.6) !important; }
        .rm-select { cursor: pointer; }
        .rm-select option { background: #111827; color: #f1f5f9; }
        .rm-err { font-size: 11px; color: #f87171; margin: 0; }

        .rm-input-pw-wrap { position: relative; }
        .rm-input-pw-wrap .rm-input { padding-right: 40px; }
        .rm-eye {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 2px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .rm-eye:hover { color: rgba(255,255,255,0.7); }

        .rm-section-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          padding-top: 4px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .rm-actions {
          display: flex;
          gap: 10px;
        }
        .rm-back-btn {
          padding: 12px 20px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .rm-back-btn:hover { background: rgba(255,255,255,0.09); color: #fff; }
        .rm-submit-btn {
          flex: 1;
          padding: 12px 20px;
          background: linear-gradient(135deg, #dc2626, #7c3aed);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(124,58,237,0.25);
        }
        .rm-submit-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        .rm-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rm-loading { display: flex; align-items: center; gap: 8px; }
        .rm-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: rmSpin 0.7s linear infinite;
        }
        @keyframes rmSpin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default RegisterModal;
