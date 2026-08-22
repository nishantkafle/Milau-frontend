import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Spinner } from "../component/Spinner";
import { format } from "date-fns";
import { baseURL } from "../../Apis/Api";

// Color palette with distinct colors
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A569BD",
  "#DC7633",
  "#5DADE2",
  "#58D68D",
  "#EB984E",
  "#AF7AC5",
  "#F1948A",
  "#7DCEA0",
];

const WeeklySaleChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("pie"); // 'pie' or 'bar'
  const [totalSales, setTotalSales] = useState(0);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${baseURL}/api/weekly-sales`, {
        params: {
          startDate: dateRange.start.toISOString(),
          endDate: dateRange.end.toISOString(),
        },
      });

      if (response.data.success) {
        setSalesData(response.data.data);
        setTotalSales(response.data.summary.totalItemsSold);
      }
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setError("Failed to load sales data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    if (start && end) {
      setDateRange({ start, end });
    }
  };

  const getCategoryColor = (index) => {
    return COLORS[index % COLORS.length];
  };

  const prepareChartData = () => {
    return salesData
      .map((category, index) => ({
        name: category.category,
        value: category.totalCategoryQuantity,
        revenue: category.totalCategoryRevenue,
        color: getCategoryColor(index),
      }))
      .sort((a, b) => b.value - a.value);
  };

  const downloadExcel = () => {
    const chartData = prepareChartData();

    const excelData = [
      ["Weekly Sales Report"],
      ["From", format(dateRange.start, "yyyy-MM-dd")],
      ["To", format(dateRange.end, "yyyy-MM-dd")],
      ["Total Items Sold", totalSales],
      [],
      ["Category", "Quantity Sold", "Revenue", "Percentage"],
    ];

    chartData.forEach(({ name, value, revenue }) => {
      const percentage = ((value / totalSales) * 100).toFixed(1);
      excelData.push([name, value, revenue, `${percentage}%`]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Weekly Sales");

    const fileName = `Sales_Report_${format(
      dateRange.start,
      "yyyyMMdd"
    )}_to_${format(dateRange.end, "yyyyMMdd")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const chartData = prepareChartData();

  return (
    <div className="bg-white p-6 rounded-lg shadow transition-shadow duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Weekly Sales by Category
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <DatePicker
              selectsRange
              startDate={dateRange.start}
              endDate={dateRange.end}
              onChange={handleDateChange}
              maxDate={new Date()}
              className="border rounded px-3 py-1 text-sm"
              dateFormat="yyyy-MM-dd"
            />
            <span className="text-sm text-gray-600">
              Total: <span className="font-bold">{totalSales}</span> items sold
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("pie")}
            className={`px-3 py-1 rounded ${
              viewMode === "pie" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Pie Chart
          </button>
          <button
            onClick={() => setViewMode("bar")}
            className={`px-3 py-1 rounded ${
              viewMode === "bar" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-200 flex items-center gap-1"
          >
            <span>Export</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="h-64 flex items-center justify-center text-red-500">
          {error}
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No sales data available for the selected period
        </div>
      ) : viewMode === "pie" ? (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} items (${((value / totalSales) * 100).toFixed(
                    1
                  )}%)`,
                  `Revenue: $${props.payload.revenue?.toLocaleString() || 0}`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} items (${((value / totalSales) * 100).toFixed(
                    1
                  )}%)`,
                  `Revenue: $${props.payload.revenue?.toLocaleString() || 0}`,
                  name,
                ]}
              />
              <Legend />
              <Bar dataKey="value" name="Items Sold" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default WeeklySaleChart;
