import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';

const PaymentEntry = ({ transactionId, onPaymentAdded }) => {
  const [form, setForm] = useState({
    amount: '',
    date: new Date(),
    paymentMethod: 'cash',
    referenceNumber: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://api.pranucollection.com/api/payments', {
        transaction: transactionId,
        ...form,
        date: form.date.toISOString()
      });
      onPaymentAdded();
      setForm({
        amount: '',
        date: new Date(),
        paymentMethod: 'cash',
        referenceNumber: ''
      });
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2">Add Payment</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="number"
          value={form.amount}
          onChange={e => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
          className="p-2 border rounded"
          required
        />
        
        <select
          value={form.paymentMethod}
          onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="cash">Cash</option>
          <option value="cheque">Cheque</option>
          <option value="bank-transfer">Bank Transfer</option>
        </select>

        <input
          type="text"
          value={form.referenceNumber}
          onChange={e => setForm({ ...form, referenceNumber: e.target.value })}
          placeholder="Reference Number"
          className="p-2 border rounded"
        />

        <DatePicker
          selected={form.date}
          onChange={date => setForm({ ...form, date })}
          className="p-2 border rounded"
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Record Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentEntry;