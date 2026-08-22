import React, { useState, useEffect } from "react";
import {
  getAllStaffApi,
  addStaffApi,
  updateStaffApi,
  deleteStaffApi,
  toggleStaffStatusApi,
  addStaffAdvanceApi,
  addStaffSalaryPaymentApi,
  deleteStaffAdvanceApi,
  deleteStaffSalaryPaymentApi,
  setManualBalanceApi,
  clearMonthlyRecordsApi,
} from "../../../Apis/Api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [newStaff, setNewStaff] = useState({ name: "", role: "", salary: "", email: "", password: "" });
  const [editingStaff, setEditingStaff] = useState(null);
  const [loading, setLoading] = useState(false);

  // Nepali months helper
  const nepaliMonths = [
    "Baisakh",
    "Jestha",
    "Ashad",
    "Shrawan",
    "Bhadra",
    "Ashwin",
    "Kartik",
    "Mangsir",
    "Poush",
    "Magh",
    "Falgun",
    "Chaitra",
  ];

  // Get current Nepali month/year
  const getCurrentNepaliMonthYear = () => {
    const currentDate = new Date();
    const currentMonth = nepaliMonths[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear() + 57;
    return { currentMonth, currentYear };
  };

  // Fetch staff data
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await getAllStaffApi();
      const staffData = response.data?.data || response.data || [];
      setStaff(Array.isArray(staffData) ? staffData : []);
    } catch (error) {
      console.error("Fetch staff error:", error);
      Swal.fire("Error", "Failed to fetch staff data", "error");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Add/edit staff
  const handleStaffSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (editingStaff) {
      if (!editingStaff.name || !editingStaff.role || !editingStaff.salary) {
        Swal.fire("Error", "Please fill all fields", "error");
        return;
      }
    } else {
      if (!newStaff.name || !newStaff.role || !newStaff.salary) {
        Swal.fire("Error", "Please fill all fields", "error");
        return;
      }
    }

    try {
      if (editingStaff) {
        await updateStaffApi(editingStaff._id, {
          ...editingStaff,
          salary: Number(editingStaff.salary),
        });
        Swal.fire("Success", "Staff updated successfully", "success");
        setEditingStaff(null);
      } else {
        const staffData = {
          ...newStaff,
          salary: Number(newStaff.salary),
        };
        await addStaffApi(staffData);
        setNewStaff({ name: "", role: "", salary: "", email: "", password: "" });
        Swal.fire("Success", "Staff added successfully with login account", "success");
      }
      fetchStaff();
    } catch (error) {
      console.error("Staff submit error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteStaffApi(id);
        setStaff((prevStaff) =>
          prevStaff.filter((member) => member._id !== id)
        );
        Swal.fire("Deleted!", "Staff member has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete staff member", "error");
        fetchStaff();
      }
    }
  };

  // Toggle staff status
  const toggleStaffStatus = async (id, currentStatus) => {
    try {
      const response = await toggleStaffStatusApi(id, {
        active: !currentStatus,
      });
      if (response.data?.data) {
        setStaff((prevStaff) =>
          prevStaff.map((member) =>
            member._id === id ? response.data.data : member
          )
        );
      }
      Swal.fire({
        title: "Success",
        text: `Staff status updated to ${
          !currentStatus ? "Active" : "Inactive"
        }`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Toggle error:", error);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  // Add advance payment
  const handleAddAdvance = async (staffId) => {
    const { currentMonth, currentYear } = getCurrentNepaliMonthYear();

    const { value: formValues } = await Swal.fire({
      title: "Add Advance Payment",
      html: `
        <input id="swal-amount" type="number" class="swal2-input" placeholder="Amount" required>
        <select id="swal-month" class="swal2-select">
          ${nepaliMonths
            .map(
              (month) =>
                `<option value="${month}" ${
                  month === currentMonth ? "selected" : ""
                }>${month}</option>`
            )
            .join("")}
        </select>
        <input id="swal-year" type="number" class="swal2-input" placeholder="Year" value="${currentYear}">
        <textarea id="swal-description" class="swal2-textarea" placeholder="Description (optional)"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const amount = document.getElementById("swal-amount").value;
        const month = document.getElementById("swal-month").value;
        const year = document.getElementById("swal-year").value;

        if (!amount || amount <= 0) {
          Swal.showValidationMessage("Please enter a valid amount");
          return false;
        }
        return {
          amount: Number(amount),
          month: month,
          year: Number(year),
          description: document.getElementById("swal-description").value || "",
        };
      },
    });

    if (formValues) {
      try {
        await addStaffAdvanceApi(staffId, formValues);
        await fetchStaff();
        Swal.fire("Success", "Advance payment added", "success");
      } catch (error) {
        console.error("Advance error:", error);
        Swal.fire("Error", "Failed to add advance", "error");
      }
    }
  };

  // Record salary payment
  const handleSalaryPayment = async (staffId) => {
    const { currentMonth, currentYear } = getCurrentNepaliMonthYear();

    const { value: formValues } = await Swal.fire({
      title: "Record Salary Payment",
      html: `
        <input id="swal-amount" type="number" class="swal2-input" placeholder="Amount" required>
        <select id="swal-month" class="swal2-select" required>
          ${nepaliMonths
            .map(
              (month) =>
                `<option value="${month}" ${
                  month === currentMonth ? "selected" : ""
                }>${month}</option>`
            )
            .join("")}
        </select>
        <input id="swal-year" type="number" class="swal2-input" placeholder="Year" value="${currentYear}" required>
        <label style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
          <input id="swal-full" type="checkbox" style="margin-right: 8px;">
          <span>Mark as full salary payment</span>
        </label>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const amount = document.getElementById("swal-amount").value;
        const month = document.getElementById("swal-month").value;
        const year = document.getElementById("swal-year").value;

        if (!amount || amount <= 0) {
          Swal.showValidationMessage("Please enter a valid amount");
          return false;
        }
        if (!month || !year) {
          Swal.showValidationMessage("Please select month and year");
          return false;
        }

        return {
          amount: Number(amount),
          month: month,
          year: Number(year),
          isFullPayment: document.getElementById("swal-full").checked,
        };
      },
    });

    if (formValues) {
      try {
        await addStaffSalaryPaymentApi(staffId, formValues);
        await fetchStaff();
        Swal.fire("Success", "Salary payment recorded", "success");
      } catch (error) {
        console.error("Payment error:", error);
        Swal.fire("Error", "Failed to record payment", "error");
      }
    }
  };

  // NEW: Set manual balance
  const handleSetManualBalance = async (staffId, currentBalance = 0) => {
    const { currentMonth, currentYear } = getCurrentNepaliMonthYear();

    const { value: formValues } = await Swal.fire({
      title: "Set Balance Amount",
      html: `
        <p style="margin-bottom: 10px; color: #666;">Enter the remaining amount to be paid to this staff member</p>
        <input id="swal-balance" type="number" class="swal2-input" placeholder="Balance Amount" value="${currentBalance}">
        <select id="swal-month" class="swal2-select">
          ${nepaliMonths
            .map(
              (month) =>
                `<option value="${month}" ${
                  month === currentMonth ? "selected" : ""
                }>${month}</option>`
            )
            .join("")}
        </select>
        <input id="swal-year" type="number" class="swal2-input" placeholder="Year" value="${currentYear}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const balance = document.getElementById("swal-balance").value;
        const month = document.getElementById("swal-month").value;
        const year = document.getElementById("swal-year").value;

        return {
          balance: Number(balance) || 0,
          month: month,
          year: Number(year),
        };
      },
    });

    if (formValues) {
      try {
        await setManualBalanceApi(staffId, formValues);
        await fetchStaff();
        Swal.fire("Success", "Balance amount updated", "success");
      } catch (error) {
        console.error("Balance error:", error);
        Swal.fire("Error", "Failed to update balance", "error");
      }
    }
  };

  // NEW: Clear monthly records

  const handleClearMonthly = async (staffId, staffName) => {
    const { currentMonth, currentYear } = getCurrentNepaliMonthYear();

    const { value: formValues } = await Swal.fire({
      title: `Clear Records for ${staffName}`,
      html: `
      <div style="margin-bottom: 15px;">
        <label style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px; padding: 10px; background: #f3f4f6; border-radius: 8px;">
          <input id="swal-clear-all" type="checkbox" style="margin-right: 8px; width: 18px; height: 18px;">
          <span style="font-weight: bold; color: #dc2626;">Clear ALL records (all months)</span>
        </label>
      </div>
      <div id="month-year-selector">
        <p style="margin-bottom: 10px; color: #6b7280; font-size: 14px;">Or select a specific month to clear:</p>
        <select id="swal-month" class="swal2-select">
          ${nepaliMonths
            .map(
              (month) =>
                `<option value="${month}" ${
                  month === currentMonth ? "selected" : ""
                }>${month}</option>`
            )
            .join("")}
        </select>
        <input id="swal-year" type="number" class="swal2-input" placeholder="Year" value="${currentYear}">
      </div>
      <p style="margin-top: 15px; color: #dc2626; font-weight: bold; font-size: 14px;">⚠️ This action cannot be undone!</p>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, clear it!",
      didOpen: () => {
        const clearAllCheckbox = document.getElementById("swal-clear-all");
        const monthYearSelector = document.getElementById(
          "month-year-selector"
        );

        clearAllCheckbox.addEventListener("change", (e) => {
          if (e.target.checked) {
            monthYearSelector.style.opacity = "0.4";
            monthYearSelector.style.pointerEvents = "none";
          } else {
            monthYearSelector.style.opacity = "1";
            monthYearSelector.style.pointerEvents = "auto";
          }
        });
      },
      preConfirm: () => {
        const clearAll = document.getElementById("swal-clear-all").checked;

        if (clearAll) {
          return { clearAll: true };
        }

        const month = document.getElementById("swal-month").value;
        const year = document.getElementById("swal-year").value;

        if (!month || !year) {
          Swal.showValidationMessage(
            "Please select month and year or check 'Clear ALL'"
          );
          return false;
        }

        return { month, year: Number(year), clearAll: false };
      },
    });

    if (formValues) {
      try {
        const response = await clearMonthlyRecordsApi(staffId, formValues);
        await fetchStaff();

        const message = formValues.clearAll
          ? `All records for ${staffName} have been cleared!`
          : `All records for ${formValues.month} ${formValues.year} have been cleared.`;

        Swal.fire({
          title: "Cleared!",
          text: message,
          icon: "success",
          html: response.data?.details
            ? `
          <div style="text-align: left; margin-top: 15px; padding: 10px; background: #f3f4f6; border-radius: 8px;">
            <p><strong>Advances removed:</strong> ${
              response.data.details.advancesRemoved
            }</p>
            <p><strong>Payments removed:</strong> ${
              response.data.details.paymentsRemoved
            }</p>
            <p><strong>Balance cleared:</strong> ${
              response.data.details.balanceCleared ? "Yes" : "No"
            }</p>
            <p><strong>Total transactions removed:</strong> ${
              response.data.details.totalRemoved
            }</p>
          </div>
        `
            : undefined,
        });
      } catch (error) {
        console.error("Clear error:", error);
        Swal.fire("Error", "Failed to clear records", "error");
      }
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    if (staff.length === 0) {
      Swal.fire("No Data", "No staff data to export", "info");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      staff.map((s) => ({
        Name: s.name,
        Role: s.role,
        "Monthly Salary": s.salary,
        Status: s.active ? "Active" : "Inactive",
        "Total Advances":
          s.advances?.reduce((sum, adv) => sum + adv.amount, 0) || 0,
        "Total Paid":
          s.salaryPayments?.reduce((sum, pay) => sum + pay.amount, 0) || 0,
        "Manual Balance": s.manualBalance || 0,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
    XLSX.writeFile(
      workbook,
      `staff_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
        <button
          onClick={exportToExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export to Excel
        </button>
      </div>

      {/* Add/Edit Staff Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#AB3430]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {editingStaff ? "Edit Staff Details" : "Add New Staff & Login Account"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Staff Name *</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
              value={editingStaff ? editingStaff.name : newStaff.name}
              onChange={(e) =>
                editingStaff
                  ? setEditingStaff({ ...editingStaff, name: e.target.value })
                  : setNewStaff({ ...newStaff, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Role / Position *</label>
            <input
              type="text"
              placeholder="e.g. Sales Associate"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
              value={editingStaff ? editingStaff.role : newStaff.role}
              onChange={(e) =>
                editingStaff
                  ? setEditingStaff({ ...editingStaff, role: e.target.value })
                  : setNewStaff({ ...newStaff, role: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Monthly Salary *</label>
            <input
              type="number"
              placeholder="Salary (NPR)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
              value={editingStaff ? editingStaff.salary : newStaff.salary}
              onChange={(e) =>
                editingStaff
                  ? setEditingStaff({ ...editingStaff, salary: e.target.value })
                  : setNewStaff({ ...newStaff, salary: e.target.value })
              }
              required
              min="0"
            />
          </div>
          {!editingStaff && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Login Email (Account)</label>
                <input
                  type="email"
                  placeholder="staff@example.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Login Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#AB3430] focus:border-transparent text-gray-800"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-3">
          {editingStaff && (
            <button
              type="button"
              onClick={() => setEditingStaff(null)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleStaffSubmit}
            className="bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white px-6 py-2 rounded-lg hover:opacity-90 transition text-sm font-semibold shadow-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {editingStaff ? "Update Staff" : "Create Staff Member"}
          </button>
        </div>
      </div>

      {/* Staff List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff data...</p>
        </div>
      ) : staff.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Staff Members
          </h3>
          <p className="text-gray-500">
            Add your first staff member using the form above
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {staff.map((member) => {
            const totalAdvances =
              member.advances?.reduce((sum, adv) => sum + adv.amount, 0) || 0;
            const totalPayments =
              member.salaryPayments?.reduce(
                (sum, pay) => sum + pay.amount,
                0
              ) || 0;
            const calculatedBalance =
              (member.salary || 0) - totalAdvances - totalPayments;
            const displayBalance =
              member.manualBalance !== undefined && member.manualBalance !== 0
                ? member.manualBalance
                : calculatedBalance;

            return (
              <div
                key={member._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">
                        {member.name}
                      </h3>
                      <p className="text-gray-600 text-lg">{member.role}</p>
                      <p className="text-lg font-semibold text-green-600 mt-2">
                        Rs. {(member.salary || 0).toLocaleString()} / month
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button
                        onClick={() =>
                          toggleStaffStatus(member._id, member.active)
                        }
                        className={`px-4 py-2 rounded-lg transition font-semibold ${
                          member.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {member.active ? "✓ Active" : "✗ Inactive"}
                      </button>
                      <button
                        onClick={() => setEditingStaff(member)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm font-medium text-blue-700 mb-1">
                        Total Advances
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        Rs. {totalAdvances.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        {member.advances?.length || 0} transactions
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border-l-4 border-green-500">
                      <p className="text-sm font-medium text-green-700 mb-1">
                        Total Paid
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        Rs. {totalPayments.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {member.salaryPayments?.length || 0} payments
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border-l-4 border-purple-500">
                      <p className="text-sm font-medium text-purple-700 mb-1">
                        Balance to Pay
                        {member.manualBalance !== undefined &&
                          member.manualBalance !== 0 && (
                            <span className="ml-2 text-xs">(Manual)</span>
                          )}
                      </p>
                      <p className="text-2xl font-bold text-purple-900">
                        Rs. {displayBalance.toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-600 mt-1">
                        {member.balanceMonth && member.balanceYear
                          ? `${member.balanceMonth} ${member.balanceYear}`
                          : "Calculated"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                    <button
                      onClick={() => handleAddAdvance(member._id)}
                      className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Advance
                    </button>
                    <button
                      onClick={() => handleSalaryPayment(member._id)}
                      className="bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-600 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      Record Payment
                    </button>
                    <button
                      onClick={() =>
                        handleSetManualBalance(member._id, displayBalance)
                      }
                      className="bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Set Balance
                    </button>
                    <button
                      onClick={() =>
                        handleClearMonthly(member._id, member.name)
                      }
                      className="bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear Monthly
                    </button>
                    <button
                      onClick={() => {
                        const monthYear = `${
                          member.balanceMonth ||
                          getCurrentNepaliMonthYear().currentMonth
                        } ${
                          member.balanceYear ||
                          getCurrentNepaliMonthYear().currentYear
                        }`;
                        Swal.fire({
                          title: `${member.name} - ${monthYear}`,
                          html: `
                            <div style="text-align: left;">
                              <p><strong>Monthly Salary:</strong> Rs. ${(
                                member.salary || 0
                              ).toLocaleString()}</p>
                              <p><strong>Total Advances:</strong> Rs. ${totalAdvances.toLocaleString()}</p>
                              <p><strong>Total Paid:</strong> Rs. ${totalPayments.toLocaleString()}</p>
                              <p><strong>Balance:</strong> Rs. ${displayBalance.toLocaleString()}</p>
                            </div>
                          `,
                          icon: "info",
                        });
                      }}
                      className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition font-semibold flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
