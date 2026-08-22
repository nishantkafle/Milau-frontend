import React, { useState, useRef } from 'react'; // Ensure useRef is imported
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MonthlySales = () => {
  const [data, setData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
        hoverBackgroundColor: '#66BB6A',
        hoverBorderColor: '#4CAF50',
        data: [15000, 22000, 18000, 25000, 27000, 30000, 24000, 26000, 29000, 32000, 21000, 28000], // Static sales data
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`, // Format y-axis labels as currency
        },
      },
    },
  };

  return (
    <div className='border rounded-xl p-5'>
      <div className='text-xl mb-4'>Monthly Sales</div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlySales;
