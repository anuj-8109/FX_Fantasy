import React from 'react';
import BackButton from "../../../pages/user/Backbutton";

function Alert() {
  return (
    <div className='p-2'>

      {/* Back button aligned to the right */}
      <div className="w-full flex items-center justify-between mb-2 p-3 bg-gray-50 rounded-xl shadow-sm border border-blue-200">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-600 tracking-wide">
           Alert
        </h2>
        <BackButton showText={true} />
      </div>

      <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-2xl shadow-md border border-gray-200 animate-fadeIn relative">
        {/* Animated empty bell */}
        <div className="bg-red-100 p-6 rounded-full mb-6 animate-bounce">
          <svg
            className="w-16 h-16 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3c0 .386-.147.735-.405 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          No Alerts Found
        </h2>
        <p className="text-gray-500 text-center max-w-xs">
          You currently have no alerts. Once an alert is triggered, it will appear here.
        </p>
      </div>
    </div>
  );
}

export default Alert;
