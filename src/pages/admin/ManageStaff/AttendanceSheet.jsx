import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { getAllStaffApi, baseURL } from "../../../Apis/Api";

const AttendanceSheet = ({ onUpdate }) => {
  const [date, setDate] = useState(new Date());
  const [staffList, setStaffList] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch staff - using API helper
        const staffResponse = await getAllStaffApi();

        // Extract staff data
        const staffData = staffResponse.data?.data || staffResponse.data || [];
        const staffArray = Array.isArray(staffData) ? staffData : [];

        // Fetch attendance for the selected date
        const attendanceResponse = await axios.get(
          `${baseURL}/api/attendance?date=${date.toISOString()}`,
          getAuthHeaders()
        );
        const attendance = attendanceResponse.data || [];

        // Build initial attendance map
        const initialMap = {};
        staffArray.forEach((s) => {
          const record = attendance.find((a) => a.staff?._id === s._id || a.staff === s._id);
          initialMap[s._id] = record ? record.isPresent : false;
        });

        setStaffList(staffArray);
        setAttendanceMap(initialMap);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to load attendance data", "error");
        setStaffList([]);
        setAttendanceMap({});
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [date]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const attendanceArray = Object.entries(attendanceMap).map(
        ([staffId, isPresent]) => ({
          staffId,
          isPresent,
        })
      );

      await axios.post(
        `${baseURL}/api/attendance/bulk`,
        {
          date,
          attendance: attendanceArray,
        },
        getAuthHeaders()
      );

      if (onUpdate) onUpdate();

      Swal.fire("Success", "Attendance saved successfully", "success");
    } catch (error) {
      console.error("Error saving attendance:", error);
      Swal.fire("Error", "Failed to save attendance", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleAll = (value) => {
    const newMap = {};
    staffList.forEach((staff) => {
      newMap[staff._id] = value;
    });
    setAttendanceMap(newMap);
  };

  const presentCount = Object.values(attendanceMap).filter(Boolean).length;
  const absentCount = staffList.length - presentCount;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#AB3430] to-[#8a2b28] px-6 py-5">
        <h2 className="text-2xl font-bold text-white mb-1">Daily Attendance</h2>
        <p className="text-white/90 text-sm">
          Mark staff attendance for the selected date
        </p>
      </div>

      {/* Controls Section */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
          {/* Date Picker */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Select Date
            </label>
            <DatePicker
              selected={date}
              onChange={setDate}
              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB3430] focus:border-[#AB3430] transition-all text-gray-900 font-medium"
              dateFormat="dd/MM/yyyy"
              disabled={loading || saving}
            />
          </div>

          {/* Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white px-4 py-2.5 rounded-lg border-2 border-green-200 shadow-sm">
              <p className="text-xs font-medium text-gray-600 mb-0.5">
                Present
              </p>
              <p className="text-xl font-bold text-green-600">{presentCount}</p>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-lg border-2 border-red-200 shadow-sm">
              <p className="text-xs font-medium text-gray-600 mb-0.5">Absent</p>
              <p className="text-xl font-bold text-red-600">{absentCount}</p>
            </div>
            <div className="bg-white px-4 py-2.5 rounded-lg border-2 border-blue-200 shadow-sm">
              <p className="text-xs font-medium text-gray-600 mb-0.5">
                Total Staff
              </p>
              <p className="text-xl font-bold text-blue-600">
                {staffList.length}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => toggleAll(true)}
              disabled={loading || saving}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Mark All Present
            </button>
            <button
              onClick={() => toggleAll(false)}
              disabled={loading || saving}
              className="px-4 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Mark All Absent
            </button>
            <button
              onClick={handleSave}
              disabled={loading || saving}
              className="px-6 py-2.5 bg-[#AB3430] text-white rounded-lg hover:bg-[#8a2b28] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#AB3430] border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading attendance data...
              </p>
            </div>
          </div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500 font-medium text-lg">
              No staff members found
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Add staff members to start tracking attendance
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Attendance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff, index) => (
                <tr
                  key={staff._id}
                  className={`transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#AB3430] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {staff.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-semibold text-gray-900">
                          {staff.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attendanceMap[staff._id] || false}
                        onChange={(e) =>
                          setAttendanceMap((prev) => ({
                            ...prev,
                            [staff._id]: e.target.checked,
                          }))
                        }
                        disabled={saving}
                        className="sr-only peer"
                      />
                      <div className="relative w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#AB3430]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                      <span
                        className={`ml-3 text-sm font-semibold ${
                          attendanceMap[staff._id]
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {attendanceMap[staff._id] ? "Present" : "Absent"}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {staffList.length > 0 && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Tip:</span> Use the "Mark All"
            buttons to quickly set attendance for all staff members
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceSheet;
