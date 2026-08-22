import React, { useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReportGenerator = ({
  reportData,
  detailedData,
  generateReport,
  startDate,
  endDate,
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await generateReport(localStartDate, localEndDate);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData || reportData.length === 0) return;

    const headers = [
      "Staff Member",
      "Days Present",
      "Days Absent",
      "Total Days",
      "Attendance %",
    ];
    const rows = reportData.map((item) => [
      item.name,
      item.presentDays,
      item.absentDays,
      item.totalDays,
      item.totalDays > 0
        ? ((item.presentDays / item.totalDays) * 100).toFixed(2)
        : "0.00",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance-report-${format(
        new Date(localStartDate),
        "dd-MM-yyyy"
      )}-to-${format(new Date(localEndDate), "dd-MM-yyyy")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-700 bg-green-100";
    if (percentage >= 75) return "text-blue-700 bg-blue-100";
    if (percentage >= 60) return "text-yellow-700 bg-yellow-100";
    return "text-red-700 bg-red-100";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#AB3430] to-[#8a2b28] px-6 py-5">
        <h2 className="text-2xl font-bold text-white mb-1">
          Attendance Report
        </h2>
        <p className="text-white/90 text-sm">
          Generate detailed attendance reports for any date range
        </p>
      </div>

      {/* Controls Section */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Date Range Pickers */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1 min-w-[180px]">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <DatePicker
                selected={localStartDate}
                onChange={setLocalStartDate}
                selectsStart
                startDate={localStartDate}
                endDate={localEndDate}
                maxDate={localEndDate}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB3430] focus:border-[#AB3430] transition-all text-gray-900 font-medium"
                dateFormat="dd/MM/yyyy"
                disabled={loading}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                End Date
              </label>
              <DatePicker
                selected={localEndDate}
                onChange={setLocalEndDate}
                selectsEnd
                startDate={localStartDate}
                endDate={localEndDate}
                minDate={localStartDate}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB3430] focus:border-[#AB3430] transition-all text-gray-900 font-medium"
                dateFormat="dd/MM/yyyy"
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 bg-[#AB3430] text-white rounded-lg hover:bg-[#8a2b28] transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Generate Report</span>
                </>
              )}
            </button>
            {reportData && reportData.length > 0 && (
              <button
                onClick={exportToCSV}
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-sm shadow-md flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Table */}
      {reportData && reportData.length > 0 && (
        <div className="p-6">
          {/* Report Header */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Report Period: {format(new Date(localStartDate), "dd/MM/yyyy")} to{" "}
              {format(new Date(localEndDate), "dd/MM/yyyy")}
            </h3>
            <p className="text-sm text-gray-600">
              Total Staff:{" "}
              <span className="font-semibold text-gray-900">
                {reportData.length}
              </span>{" "}
              | Total Days:{" "}
              <span className="font-semibold text-gray-900">
                {reportData[0]?.totalDays || 0}
              </span>
            </p>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b-2 border-gray-300">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Staff Member
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Days Present
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Days Absent
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Total Days
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Attendance %
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.map((item, index) => {
                  const percentage =
                    item.totalDays > 0
                      ? (item.presentDays / item.totalDays) * 100
                      : 0;

                  return (
                    <tr
                      key={item._id}
                      className={`transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#AB3430] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {item.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {item.name}
                            </div>
                            {item.role && (
                              <div className="text-xs text-gray-500">
                                {item.role}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                          {item.presentDays}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
                          {item.absentDays}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                          {item.totalDays}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getAttendanceColor(
                              percentage
                            )}`}
                          >
                            {percentage.toFixed(2)}%
                          </span>
                          {/* Progress Bar */}
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                percentage >= 90
                                  ? "bg-green-500"
                                  : percentage >= 75
                                  ? "bg-blue-500"
                                  : percentage >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-bold text-gray-700 mb-3">
              Attendance Performance Legend:
            </h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700 font-medium">
                  ≥ 90% - Excellent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-700 font-medium">
                  75-89% - Good
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-700 font-medium">
                  60-74% - Fair
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700 font-medium">
                  &lt; 60% - Needs Improvement
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!reportData && !loading && (
        <div className="p-12 text-center">
          <svg
            className="w-20 h-20 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Report Generated
          </h3>
          <p className="text-gray-500 mb-4">
            Select a date range and click "Generate Report" to view attendance
            data
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
