import React, { useState } from "react";
import AddTransaction from "./add_transaction";
import ViewTransactions from "./view_transactions";
import CashbookSummary from "./cashbook_summary";

const CashbookManagement = () => {
  const [view, setView] = useState("add");

  const tabs = [
    {
      id: "add",
      label: "Add Transaction",
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
      label: "View Transactions",
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
  ];

  return (
    <div className="p-4">
      <div className="pt-10 mt-3">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Cashbook Management
          </h1>
          <p className="text-gray-600">
            Manage your cash transactions and view transaction history
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
          {view === "add" && <AddTransaction />}
          {view === "view" && <ViewTransactions />}
          {/* {view === 'summary' && <CashbookSummary />} */}
        </div>
      </div>
    </div>
  );
};

export default CashbookManagement;
