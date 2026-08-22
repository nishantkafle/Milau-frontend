import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { updateProfileApi, updatePasswordApi } from "../../Apis/Api";

const ProfileSettingsPage = ({ user, setUser }) => {
  // Name form state
  const [name, setName] = useState("");
  const [updatingName, setUpdatingName] = useState(false);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setUpdatingName(true);
      const response = await updateProfileApi({ name: name.trim() });
      if (response.data.success) {
        toast.success("Profile name updated successfully!");
        const updatedUser = { ...user, name: name.trim() };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        if (setUser) setUser(updatedUser);
      } else {
        toast.error(response.data.message || "Failed to update name");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Error updating name");
    } finally {
      setUpdatingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setUpdatingPassword(true);
      const response = await updatePasswordApi({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        toast.success("Password updated successfully!");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Error changing password");
    } finally {
      setUpdatingPassword(false);
    }
  };

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-50 text-[#AB3430]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            Profile Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account information, profile name, and password
          </p>
        </div>
      </div>

      {/* User Info Overview Banner */}
      <div className="bg-gradient-to-r from-[#AB3430] to-[#c94542] rounded-xl shadow-md p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 text-white font-bold flex items-center justify-center text-2xl border-2 border-white/40 shadow-inner">
            {userInitial}
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name || "Account User"}</h2>
            <p className="text-sm text-white/80">{user?.email}</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 text-center">
          <p className="text-xs uppercase tracking-wider text-white/70">Role</p>
          <p className="text-base font-semibold">{getRoleLabel(user?.role)}</p>
        </div>
      </div>

      {/* Settings Forms Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Change Name */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <span className="p-2 rounded-lg bg-red-50 text-[#AB3430]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">General Info</h3>
                <p className="text-xs text-gray-500">Update your account name</p>
              </div>
            </div>

            <form id="name-form" onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 rounded-lg px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-400 mt-1">Email address cannot be changed.</p>
              </div>
            </form>
          </div>

          <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              form="name-form"
              disabled={updatingName}
              className="bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {updatingName ? "Saving..." : "Save Name"}
            </button>
          </div>
        </div>

        {/* Section 2: Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
              <span className="p-2 rounded-lg bg-red-50 text-[#AB3430]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Security</h3>
                <p className="text-xs text-gray-500">Change your login password</p>
              </div>
            </div>

            <form id="password-form" onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  required
                  className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
                  placeholder="Confirm new password"
                />
              </div>
            </form>
          </div>

          <div className="pt-6 mt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              form="password-form"
              disabled={updatingPassword}
              className="bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {updatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
