import React, { useState, useEffect } from 'react';
import { getCashbookSummaryApi } from '../../../Apis/Api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import moment from 'moment';
import toast from 'react-hot-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CashbookSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month');
  const [customRange, setCustomRange] = useState({
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD')
  });
  const [viewType, setViewType] = useState('expenses'); // 'expenses' or 'income'

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, customRange, viewType]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      let params = { period: timeRange, type: viewType };

      if (timeRange === 'custom') {
        params.startDate = customRange.startDate;
        params.endDate = customRange.endDate;
      }

      const response = await getCashbookSummaryApi(params);
      setSummaryData(response.data || null);
    } catch (error) {
      toast.error('Failed to fetch cashbook summary');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setCustomRange({
      ...customRange,
      [name]: value
    });
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
  };

  // Prepare chart data from categories array
  const barChartData = summaryData?.categories?.map(item => ({
    name: item.category,
    amount: item.totalAmount
  })) || [];

  const pieChartData = summaryData?.categories?.map(item => ({
    name: item.category,
    value: item.totalAmount
  })) || [];

  const totalAmount = summaryData?.totalAmount || 0;

  const formatDisplayName = (value) => {
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="mt-5">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-gray-600 font-bold text-2xl mb-4 md:mb-0">
            {viewType === 'income' ? 'Income Summary' : 'Expense Summary'}
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleViewTypeChange('income')}
              className={`px-4 py-2 rounded-md ${
                viewType === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Income View
            </button>
            <button
              onClick={() => handleViewTypeChange('expenses')}
              className={`px-4 py-2 rounded-md ${
                viewType === 'expenses' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Expense View
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleTimeRangeChange('day')}
            className={`px-4 py-2 rounded-md ${
              timeRange === 'day' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleTimeRangeChange('month')}
            className={`px-4 py-2 rounded-md ${
              timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => handleTimeRangeChange('year')}
            className={`px-4 py-2 rounded-md ${
              timeRange === 'year' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            This Year
          </button>
          <button
            onClick={() => handleTimeRangeChange('custom')}
            className={`px-4 py-2 rounded-md ${
              timeRange === 'custom' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Custom
          </button>
        </div>

        {timeRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={customRange.startDate}
                onChange={handleDateChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={customRange.endDate}
                onChange={handleDateChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : summaryData ? (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                <span className="font-semibold">Period:</span> {moment(summaryData.startDate).format('MMM D, YYYY')} - {moment(summaryData.endDate).format('MMM D, YYYY')}
              </p>
              <p className={`text-lg font-bold ${
                viewType === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                Total {viewType === 'income' ? 'Income' : 'Expenses'}: NPR {totalAmount.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="h-80">
                <h3 className="text-center font-medium mb-2">Amount by Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`NPR ${value.toLocaleString()}`, 'Amount']}
                      labelFormatter={(label) => formatDisplayName(label)}
                    />
                    <Legend />
                    <Bar 
                      dataKey="amount" 
                      name={viewType === 'income' ? 'Income Amount' : 'Expense Amount'} 
                      fill={viewType === 'income' ? '#4CAF50' : '#F44336'} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-80">
                <h3 className="text-center font-medium mb-2">Percentage Distribution</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${formatDisplayName(name)} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`NPR ${value.toLocaleString()}`, 'Amount']}
                      labelFormatter={(label) => formatDisplayName(label)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-right">Amount (NPR)</th>
                    <th className="py-3 px-6 text-right">Percentage</th>
                    <th className="py-3 px-6 text-right">Transactions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {summaryData.categories?.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">No data found</td>
                    </tr>
                  ) : (
                    summaryData.categories?.map((item) => (
                      <tr key={item.category} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left capitalize">
                          {formatDisplayName(item.category)}
                        </td>
                        <td className="py-3 px-6 text-right">
                          {item.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-6 text-right">
                          {totalAmount > 0 ? ((item.totalAmount / totalAmount) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="py-3 px-6 text-right">
                          {item.count}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-bold">
                    <td className="py-3 px-6 text-right">Total:</td>
                    <td className="py-3 px-6 text-right">{totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-6 text-right">100%</td>
                    <td className="py-3 px-6 text-right">
                      {summaryData.categories?.reduce((sum, item) => sum + item.count, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-4">No summary data available</div>
        )}
      </div>
    </div>
  );
};

export default CashbookSummary;