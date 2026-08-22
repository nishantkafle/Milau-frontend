import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faThumbsDown, faUser } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { 
  getTopCustomersApi,
  getNegativeCustomersApi
} from '../../../Apis/Api'; // Update path as needed

const CustomerAnalytics = () => {
  const [topCustomers, setTopCustomers] = useState([]);
  const [negativeCustomers, setNegativeCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const [topCustomersRes, negativeCustomersRes] = await Promise.all([
        getTopCustomersApi(),
        getNegativeCustomersApi()
      ]);
      setTopCustomers(topCustomersRes.data);
      setNegativeCustomers(negativeCustomersRes.data);
    } catch (error) {
      toast.error('Failed to fetch customer data');
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return moment(date).format('MMM D, YYYY');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Customer Analytics</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Customers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faCrown} className="text-yellow-500 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">Top 10 Customers</h2>
            </div>
            
            {topCustomers.length === 0 ? (
              <p className="text-gray-500">No top customers found</p>
            ) : (
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 text-indigo-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{customer.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{formatCurrency(customer.totalSpent)}</p>
                      <p className="text-xs text-gray-500">
                        {customer.totalTransactions} transactions
                      </p>
                      <p className="text-xs text-gray-500">
                        Last: {formatDate(customer.lastPurchase)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Negative Customers Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 text-xl mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">Negative Experience Customers</h2>
            </div>
            
            {negativeCustomers.length === 0 ? (
              <p className="text-gray-500">No negative customers found</p>
            ) : (
              <div className="space-y-4">
                {negativeCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-red-100 text-red-600 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{customer.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">
                        {customer.complaintCount} issue(s)
                      </p>
                      {customer.totalRefundAmount > 0 && (
                        <p className="text-xs text-gray-500">
                          Refunds: {formatCurrency(customer.totalRefundAmount)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Last: {formatDate(customer.lastIssueDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAnalytics;