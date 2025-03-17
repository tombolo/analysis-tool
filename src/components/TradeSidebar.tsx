'use client';
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info, Bell } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TradeSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState("Over/Under");

  const contractOptions = ["Over/Under", "Rise/Fall", "Touch/No Touch", "Higher/Lower"];

  const handleContractChange = (option: string) => {
    setSelectedContract(option);
    setIsOpen(false);
    toast.success(`✅ ${option} contract enabled!`, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: "colored",
    });
  };

  return (
    <div className="w-full p-6 bg-gradient-to-b from-blue-600 to-blue-800 text-white border-l shadow-2xl rounded-xl">
      {/* Contract Selection Dropdown */}
      <div className="relative mb-6">
        <button
          className="w-full flex items-center justify-between p-4 border-2 border-yellow-500 rounded-xl bg-yellow-600 text-black font-bold shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedContract}</span>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {isOpen && (
          <ul className="absolute w-full mt-2 bg-white text-black border border-yellow-500 rounded-xl shadow-xl overflow-hidden">
            {contractOptions.map((option) => (
              <li
                key={option}
                className="p-4 hover:bg-yellow-500 hover:text-white cursor-pointer transition-all duration-300"
                onClick={() => handleContractChange(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Trading Tip Section */}
      <div className="p-5 bg-gray-800 rounded-xl shadow-lg text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Info size={22} className="text-yellow-500" />
          <h2 className="text-lg font-bold text-yellow-400">Trading Tip</h2>
        </div>
        <p className="text-md text-gray-300">
          "Patience and risk management are key. Don't rush into a trade without a plan!"
        </p>
      </div>

      {/* Notification Box */}
      <div className="p-5 mt-6 bg-blue-900 rounded-xl shadow-lg text-center flex items-center justify-center space-x-3">
        <Bell size={22} className="text-yellow-400" />
        <p className="text-md text-gray-200">Stay updated on market trends!</p>
      </div>
    </div>
  );
};

export default TradeSidebar;
