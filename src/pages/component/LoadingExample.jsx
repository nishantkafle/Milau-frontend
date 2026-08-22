import React from 'react';
import ReactLoading from 'react-loading';

const LoadingExample = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <ReactLoading type="spinningBubbles" color="#007BFF" height={100} width={100} />
  </div>
);

export default LoadingExample;
