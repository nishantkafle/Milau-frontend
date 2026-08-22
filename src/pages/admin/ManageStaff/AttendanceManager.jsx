import { useState } from "react";
import AttendanceSheet from "./AttendanceSheet";
import axios from "axios";
import ReportGenerator from "./ReportGenerate";
import { baseURL } from "../../../Apis/Api";

const AttendanceManager = () => {
  const [reportData, setReportData] = useState(null);
  const [detailedData, setDetailedData] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  const generateReport = async (start, end) => {
    try {
      const { data } = await axios.get(
        `${baseURL}/api/attendance/report`,
        {
          params: {
            startDate: start.toISOString(),
            endDate: end.toISOString(),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReportData(data.summary);
      setDetailedData(data.details);
      setDateRange({ start, end });
    } catch (error) {
      console.error("Error generating report:", error);
      // Optional: Add toast notification or error state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Staff Attendance Management
          </h1>
          <p className="text-gray-600 text-lg">
            Track daily attendance and generate comprehensive reports
          </p>
        </div>

        {/* Attendance Sheet */}
        <AttendanceSheet
          onUpdate={() => generateReport(dateRange.start, dateRange.end)}
        />

        {/* Report Generator */}
        <ReportGenerator
          reportData={reportData}
          detailedData={detailedData}
          generateReport={generateReport}
          startDate={dateRange.start}
          endDate={dateRange.end}
        />
      </div>
    </div>
  );
};

export default AttendanceManager;
