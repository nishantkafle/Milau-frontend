import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { baseURL } from "../../Apis/Api";

const StaffAttendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [summary, setSummary] = useState({ presentDays: 0, absentDays: 0, lateDays: 0, totalDays: 0 });

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's attendance
      try {
        const response = await axios.get(
          `${baseURL}/api/attendance/staff/${user.id || user._id}/${today}`,
          getAuthHeaders()
        );
        if (response.data.success) {
          setTodayAttendance(response.data.attendance);
        }
      } catch (err) {
        setTodayAttendance(null);
      }

      // Get 30-day report history
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const historyResponse = await axios.get(
        `${baseURL}/api/attendance/staff/report`,
        {
          params: {
            staffId: user.id || user._id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
          ...getAuthHeaders(),
        }
      );

      if (historyResponse.data.success) {
        setAttendanceHistory(historyResponse.data.attendance || []);
        if (historyResponse.data.summary) {
          setSummary(historyResponse.data.summary);
        }
      }
    } catch (error) {
      console.error("Error fetching staff attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (status) => {
    try {
      setMarkingAttendance(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      const response = await axios.post(
        `${baseURL}/api/attendance/mark`,
        {
          staffId: user.id || user._id,
          status: status,
          date: new Date().toISOString(),
        },
        getAuthHeaders()
      );
      
      if (response.data.success) {
        toast.success(`Attendance marked as ${status.toUpperCase()}!`);
        fetchAttendanceData();
      } else {
        toast.error(response.data.message || "Failed to mark attendance");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error.response?.data?.message || "Error marking attendance");
    } finally {
      setMarkingAttendance(false);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AB3430]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-50 text-[#AB3430]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Staff Attendance Portal
          </h1>
          <p className="text-sm text-gray-500 mt-1">Mark your daily attendance and track your work logs</p>
        </div>
        <div className="bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white px-5 py-3 rounded-xl shadow flex items-center gap-4">
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wider">Current Time</p>
            <p className="text-lg font-bold">{getCurrentTime()}</p>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div>
            <p className="text-xs opacity-80 uppercase tracking-wider">Today</p>
            <p className="text-sm font-semibold">{getCurrentDate()}</p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Recorded</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{summary.totalDays || attendanceHistory.length}</p>
          </div>
          <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Present</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{summary.presentDays}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Absent</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">{summary.absentDays}</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Late Days</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{summary.lateDays || 0}</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Today's Status & Action Panel */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center justify-between">
          <span>Today's Attendance Status</span>
          <span className="text-xs text-gray-400 font-normal">{getCurrentDate()}</span>
        </h3>

        {todayAttendance ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className={`px-6 py-2.5 rounded-full text-base font-semibold shadow-sm border ${
              todayAttendance.status === 'present' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : todayAttendance.status === 'absent'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              ✓ Marked as {todayAttendance.status.toUpperCase()}
            </div>
            <p className="text-xs text-gray-500">
              Recorded at: {new Date(todayAttendance.markedAt || todayAttendance.updatedAt).toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">You haven't marked your attendance for today yet. Please select your status below:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => markAttendance("present")}
                disabled={markingAttendance}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark Present
              </button>
              <button
                onClick={() => markAttendance("late")}
                disabled={markingAttendance}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark Late
              </button>
              <button
                onClick={() => markAttendance("absent")}
                disabled={markingAttendance}
                className="bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Mark Absent
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Attendance History (Last 30 Days)</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
            {attendanceHistory.length} Records
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Time Recorded</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-400">
                    No attendance records found for the last 30 days.
                  </td>
                </tr>
              ) : (
                attendanceHistory.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {new Date(rec.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        rec.status === 'present' || rec.isPresent
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : rec.status === 'absent'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {(rec.status || (rec.isPresent ? 'present' : 'absent')).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(rec.markedAt || rec.createdAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;
