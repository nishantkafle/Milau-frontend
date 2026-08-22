import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TransactionManager from "./components/TransactionEntry";
import LedgerView from "./components/LedgerView ";
import PartyManager from "./components/AddBusiness";

const BusinessManagement = () => {
  const [view, setView] = useState("add");
  const [date, setDate] = useState(new Date());

  const tabs = [
    {
      id: "add",
      label: "Add Business",
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
      id: "entry",
      label: "Transaction Entry",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
          <path
            fillRule="evenodd"
            d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z"
            clipRule="evenodd"
          />
          <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
        </svg>
      ),
    },
    {
      id: "ledger",
      label: "Ledger View",
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
  ];

  return (
    <div className="p-4">
      <div className="pt-10 mt-3">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Business Management
          </h1>
          <p className="text-gray-600">
            Manage your businesses, transactions, and ledgers
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
          {view === "add" && <PartyManager />}
          {view === "entry" && <TransactionManager />}
          {view === "ledger" && <LedgerView />}
        </div>
      </div>
    </div>
  );
};

export default BusinessManagement;
