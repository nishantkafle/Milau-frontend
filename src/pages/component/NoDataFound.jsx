import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/nodata.json";

const NoDataFound = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <Lottie options={defaultOptions} height={200} width={200} />
      {/* <h1 className="text-4xl font-bold text-gray-800">404 Not Found</h1>
      <p className="text-lg text-gray-600 mt-2">
        The page you are looking for does not exist.
      </p> */}
    </div>
  );
};

export default NoDataFound;
