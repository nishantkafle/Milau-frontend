import React from "react";
import Lottie from "react-lottie";
import animationData from "./assets/animations/404.json";

const NotFoundPage = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-gray-800">Site Unavailable</h1>
      <Lottie options={defaultOptions} height={250} width={400} />
      <p className="text-lg text-gray-600 mt-2 text-center">
        This site is temporarily offline due to unpaid dues. <br /> Please contact support to resolve the issue.
      </p>
    </div>
  );
};

export default NotFoundPage;
