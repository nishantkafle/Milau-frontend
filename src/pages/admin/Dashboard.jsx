// Dashboard.jsx - Enhanced Professional Version
import React, { useState, useEffect, useRef } from "react";
import DailySale from "../component/WeeklySale";
import OrderList from "./orderHistory/OrderList";
import { getDailySalesApi, getTotalCountsApi, baseURL } from "../../Apis/Api";
import WeeklySaleChart from "./WeeklySaleChart";
import { useReactToPrint } from "react-to-print";
import { useProductView } from "../../context/ProductContext";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Dashboard = ({ setActiveContainer }) => {
  const { view, setView } = useProductView();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalSubcategories, setTotalSubcategories] = useState(0);
  const [dailySales, setDailySales] = useState(null);
  const [weeklySales, setWeeklySales] = useState(null);
  const [loading, setLoading] = useState({
    counts: true,
    sales: true,
    weekly: true,
  });
  const [error, setError] = useState({
    counts: null,
    sales: null,
    weekly: null,
  });
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Pranu Dashboard Report",
    pageStyle: `@page { size: A4; margin: 20mm; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } }`,
  });

  const formatCurrency = (amount) => {
    return `Rs. ${amount?.toLocaleString("en-NP", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Fetch weekly sales data
  const fetchWeeklySales = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/sales/weekly`);
      if (response.data?.success) {
        setWeeklySales(response.data.data);
      } else {
        setWeeklySales({
          totalSales: 0,
          totalRevenue: 0,
          totalProfit: 0,
          profitMargin: 0,
          dailyBreakdown: [],
        });
      }
      setLoading((prev) => ({ ...prev, weekly: false }));
    } catch (err) {
      console.error("Error fetching weekly sales:", err);
      setError((prev) => ({ ...prev, weekly: err.message }));
      setWeeklySales({
        totalSales: 0,
        totalRevenue: 0,
        totalProfit: 0,
        profitMargin: 0,
        dailyBreakdown: [],
      });
      setLoading((prev) => ({ ...prev, weekly: false }));
    }
  };

  useEffect(() => {
    getTotalCountsApi()
      .then((response) => {
        setTotalProducts(response.data.data.totalProducts);
        setTotalCategories(response.data.data.totalCategories);
        setTotalSubcategories(response.data.data.totalSubCategories);
        setLoading((prev) => ({ ...prev, counts: false }));
      })
      .catch((err) => {
        setError((prev) => ({ ...prev, counts: err.message }));
        setLoading((prev) => ({ ...prev, counts: false }));
      });

    getDailySalesApi()
      .then((response) => {
        if (response.data?.success) {
          setDailySales(response.data.data);
        } else {
          setDailySales({
            onlineSales: 0,
            offlineSales: 0,
            totalDailySales: 0,
            onlineRevenue: 0,
            offlineRevenue: 0,
            totalRevenue: 0,
            onlineCost: 0,
            offlineCost: 0,
            totalCost: 0,
            onlineProfit: 0,
            offlineProfit: 0,
            totalProfit: 0,
            profitMargin: 0,
            topSellingProducts: [],
            hourlyData: [],
          });
        }
        setLoading((prev) => ({ ...prev, sales: false }));
      })
      .catch((err) => {
        console.error("Error fetching daily sales:", err);
        setError((prev) => ({
          ...prev,
          sales: err.response?.data?.message || err.message,
        }));
        setDailySales({
          onlineSales: 0,
          offlineSales: 0,
          totalDailySales: 0,
          onlineRevenue: 0,
          offlineRevenue: 0,
          totalRevenue: 0,
          onlineCost: 0,
          offlineCost: 0,
          totalCost: 0,
          onlineProfit: 0,
          offlineProfit: 0,
          totalProfit: 0,
          profitMargin: 0,
          topSellingProducts: [],
          hourlyData: [],
        });
        setLoading((prev) => ({ ...prev, sales: false }));
      });

    fetchWeeklySales();
  }, []);

  const StatCard = ({
    title,
    value,
    subtitle,
    gradient,
    icon,
    onClick,
    loading,
  }) => (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} border rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold opacity-80 mb-2">{title}</p>
          {loading ? (
            <div className="animate-pulse h-10 w-32 bg-white/30 rounded mt-2"></div>
          ) : (
            <h1 className="text-4xl font-bold mb-1">{value}</h1>
          )}
          {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 shadow-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  const MetricCard = ({ label, value, bgColor, textColor }) => (
    <div
      className={`${bgColor} rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
    >
      <p className={`text-sm font-medium ${textColor} mb-1 opacity-80`}>
        {label}
      </p>
      <h3 className={`text-3xl font-bold ${textColor}`}>{value}</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm mb-8 px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Real-time insights into your business performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg border border-blue-200">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Today's Sales
              </span>
              {loading.sales ? (
                <span className="text-sm text-gray-400">Loading...</span>
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {dailySales?.totalDailySales || 0}{" "}
                  <span className="text-sm font-normal text-gray-600">
                    items
                  </span>
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() =>
                printRef.current ? handlePrint() : alert("Unable to print")
              }
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#AB3430] to-[#8B2420] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                />
              </svg>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div ref={printRef} className="px-6">
        {/* Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={loading.counts ? "..." : totalProducts}
            subtitle="in inventory"
            gradient="from-blue-500 to-blue-600 text-white"
            loading={loading.counts}
            onClick={() => {
              setActiveContainer("addProduct");
              setView("view");
            }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.684 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
              </svg>
            }
          />
          <StatCard
            title="Total Categories"
            value={loading.counts ? "..." : totalCategories}
            subtitle="active categories"
            gradient="from-green-500 to-green-600 text-white"
            loading={loading.counts}
            onClick={() => {
              setActiveContainer("addcategory");
              setView("view");
            }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z" />
              </svg>
            }
          />
          <StatCard
            title="Sub Categories"
            value={loading.counts ? "..." : totalSubcategories}
            subtitle="subcategories"
            gradient="from-purple-500 to-purple-600 text-white"
            loading={loading.counts}
            onClick={() => {
              setActiveContainer("addsubcategory");
              setView("view");
            }}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
              >
                <path
                  fillRule="evenodd"
                  d="M3 6a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3v2.25a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3V6ZM3 15.75a3 3 0 0 1 3-3h2.25a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2.25Zm9.75 0a3 3 0 0 1 3-3H18a3 3 0 0 1 3 3V18a3 3 0 0 1-3 3h-2.25a3 3 0 0 1-3-3v-2.25Z"
                  clipRule="evenodd"
                />
              </svg>
            }
          />
        </div>

        {/* Today's Sales Performance */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <span className="text-white font-bold text-sm uppercase tracking-wider">
                  Today
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Sales Performance
              </h2>
            </div>
          </div>

          <div className="p-6">
            {loading.sales ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error.sales ? (
              <div className="text-red-600 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold">Error loading sales data</p>
                <p className="text-sm mt-1">{error.sales}</p>
              </div>
            ) : (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  <MetricCard
                    label="Total Sales"
                    value={`${dailySales?.totalDailySales || 0} items`}
                    bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
                    textColor="text-blue-900"
                  />
                  <MetricCard
                    label="Revenue"
                    value={formatCurrency(dailySales?.totalRevenue || 0)}
                    bgColor="bg-gradient-to-br from-green-50 to-green-100"
                    textColor="text-green-900"
                  />
                  <MetricCard
                    label="Profit"
                    value={formatCurrency(dailySales?.totalProfit || 0)}
                    bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
                    textColor="text-purple-900"
                  />
                  <MetricCard
                    label="Margin"
                    value={`${dailySales?.profitMargin || 0}%`}
                    bgColor="bg-gradient-to-br from-orange-50 to-orange-100"
                    textColor="text-orange-900"
                  />
                </div>

                {/* Online vs Offline Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="border-2 border-emerald-200 rounded-xl p-6 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="bg-emerald-500 rounded-lg p-2.5">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Online Sales
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-emerald-200">
                        <span className="text-gray-700 font-medium">
                          Items Sold
                        </span>
                        <span className="font-bold text-xl text-emerald-700">
                          {dailySales?.onlineSales || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                          Revenue
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(dailySales?.onlineRevenue || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Cost</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(dailySales?.onlineCost || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t-2 border-emerald-300">
                        <span className="font-bold text-gray-900">
                          Net Profit
                        </span>
                        <span className="font-bold text-xl text-purple-600">
                          {formatCurrency(dailySales?.onlineProfit || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-indigo-200 rounded-xl p-6 bg-gradient-to-br from-indigo-50 via-white to-indigo-50/30 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="bg-indigo-500 rounded-lg p-2.5">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Offline Sales
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-indigo-200">
                        <span className="text-gray-700 font-medium">
                          Items Sold
                        </span>
                        <span className="font-bold text-xl text-indigo-700">
                          {dailySales?.offlineSales || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">
                          Revenue
                        </span>
                        <span className="font-bold text-green-600">
                          {formatCurrency(dailySales?.offlineRevenue || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Cost</span>
                        <span className="font-bold text-red-600">
                          {formatCurrency(dailySales?.offlineCost || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t-2 border-indigo-300">
                        <span className="font-bold text-gray-900">
                          Net Profit
                        </span>
                        <span className="font-bold text-xl text-purple-600">
                          {formatCurrency(dailySales?.offlineProfit || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Hourly Trend */}
                  {dailySales?.hourlyData?.length > 0 && (
                    <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Hourly Sales Trend
                      </h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={dailySales.hourlyData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                          />
                          <XAxis
                            dataKey="hour"
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                          />
                          <YAxis
                            stroke="#6b7280"
                            style={{ fontSize: "12px" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            name="Sales"
                            dot={{ fill: "#3B82F6", r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Distribution Chart */}
                  <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                      </svg>
                      Sales Distribution
                    </h3>
                    <DailySale
                      dailySalesData={
                        dailySales || {
                          onlineSales: 0,
                          offlineSales: 0,
                          totalDailySales: 0,
                        }
                      }
                    />
                  </div>
                </div>

                {/* Top Selling Products */}
                {dailySales?.topSellingProducts?.length > 0 && (
                  <div className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Top Selling Products Today
                    </h3>
                    <div className="space-y-3">
                      {dailySales.topSellingProducts.map((product, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-white shadow-md ${
                                index === 0
                                  ? "bg-gradient-to-br from-amber-400 to-amber-600"
                                  : index === 1
                                  ? "bg-gradient-to-br from-gray-400 to-gray-500"
                                  : index === 2
                                  ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                  : "bg-gradient-to-br from-blue-400 to-blue-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <span className="font-semibold text-gray-900">
                              {product.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-gray-900">
                              {product.quantity}{" "}
                              <span className="text-sm font-normal text-gray-600">
                                items
                              </span>
                            </div>
                            <div className="text-sm font-semibold text-green-600">
                              {formatCurrency(product.revenue)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-white"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Recent Orders</h2>
              <div className="ml-auto">
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-white">
                  Live Updates
                </span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <OrderList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
