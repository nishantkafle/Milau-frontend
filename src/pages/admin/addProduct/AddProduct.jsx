import React, { useState } from "react";
import ViewProduct from "./ViewProduct";
import AddProducts from "./AddProducts";
import ViewInventory from "./ViewInventory";
import TotalProductsLeft from "./TotalProductsLeft";
import { useProductView } from "../../../context/ProductContext";

const AddProduct = () => {
  const { view, setView } = useProductView(); // Set default view to 'add'

  const tabs = [
    {
      id: "add",
      label: "Add Product",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M5.566 4.657A4.505 4.505 0 0 1 6.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0 0 15.75 3h-7.5a3 3 0 0 0-2.684 1.657ZM2.25 12a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3v-6ZM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 0 1 6.75 6h10.5a3 3 0 0 1 2.684 1.657A4.505 4.505 0 0 0 18.75 7.5H5.25Z" />
        </svg>
      ),
    },
    {
      id: "view",
      label: "View Products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path
            fillRule="evenodd"
            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
        </svg>
      ),
    },
    {
      id: "viewcategorywithcount",
      label: "Product Count based on Category",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M2.25 13.5a8.25 8.25 0 0 1 16.5 0V15a.75.75 0 0 1 1.5 0v-1.5a9.75 9.75 0 0 0-19.5 0V15a.75.75 0 0 1 1.5 0v-1.5Z"
            clipRule="evenodd"
          />
          <path d="M9 8.25a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h6a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75H9ZM9.75 9.75h4.5v3h-4.5v-3Z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Product Management
        </h1>
        <p className="text-gray-600">
          Manage your products, inventory, and categories
        </p>
      </div>

      {/* Modern Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                view === tab.id
                  ? "bg-gradient-to-r from-[#AB3430] to-[#c94542] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#AB3430]"
              }`}
            >
              <span
                className={view === tab.id ? "text-white" : "text-gray-500"}
              >
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        {view === "view" && <ViewProduct />}
        {view === "add" && <AddProducts />}
        {view === "inventory" && <ViewInventory />}
        {view === "viewcategorywithcount" && <TotalProductsLeft />}
      </div>
    </div>
  );
};

export default AddProduct;
