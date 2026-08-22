import React, { useState, useEffect, useRef } from "react";

const UserProfileSection = ({ user, setUser, onLogoutClick, onSelectSettings }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleLabel = (role) => {
    if (!role) return "User";
    const r = role.toLowerCase();
    if (r === "system_admin" || r === "super_admin") return "Admin";
    if (r === "vendor") return "Vendor";
    if (r === "staff") return "Staff";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Menu (Opens upwards above profile card) */}
      {dropdownOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-4 py-2 border-b border-gray-100 mb-1">
            <p className="text-xs text-gray-400 font-medium">Signed in as</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.email || user?.name}</p>
          </div>

          {/* Option 1: Profile Settings (Opens as main Page) */}
          <button
            onClick={() => {
              setDropdownOpen(false);
              if (onSelectSettings) onSelectSettings();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#AB3430] transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Profile Settings</span>
          </button>

          {/* Option 2: Logout */}
          <button
            onClick={() => {
              setDropdownOpen(false);
              if (onLogoutClick) onLogoutClick();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Profile Button Card at the position of Logout */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white font-bold flex items-center justify-center text-sm shadow-sm flex-shrink-0">
            {userInitial}
          </div>
          <div className="text-left min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#AB3430]">
              {user?.name || "User"}
            </p>
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-red-100 text-[#AB3430]">
              {getRoleLabel(user?.role)}
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 group-hover:text-[#AB3430] transition-transform duration-200 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default UserProfileSection;
