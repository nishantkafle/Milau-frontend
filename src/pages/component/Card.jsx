import React from "react";
import { Link } from "react-router-dom";
import MyRating from "./TotalRating";
import { getImageUrl } from "../../Apis/Api"; // Changed from baseURL to getImageUrl

const Card = ({ product }) => {
  return (
    <div className="soft-card h-full">
      <Link
        to={`/viewProduct/${product._id}`}
        key={product._id}
        className="flex flex-col gap-4"
      >
        <div className="overflow-hidden rounded-xl">
          <img
            src={getImageUrl(product.images[0])} // Using getImageUrl helper function
            alt={product.name}
            className="w-full rounded-xl lg:h-[320px] md:h-[280px] h-[220px] object-cover transition duration-500 ease-in-out hover:scale-105"
          />
        </div>
        <div className="px-1 pb-3 space-y-2">
          <div className="text-white font-semibold text-lg whitespace-nowrap overflow-hidden text-ellipsis">
            {product.name}
          </div>
          <div className="hidden lg:block">
            <MyRating productId={product._id} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg text-orange-300 font-bold">
              Rs {product.discountedPrice}
            </span>
            <span className="text-sm text-slate-500 line-through">
              Rs {product.fakePrice}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;
