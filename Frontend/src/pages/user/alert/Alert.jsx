import React, { useEffect, useState } from "react";
import BackButton from "../../../pages/user/Backbutton";
import { getNotificationList } from "../../../services/User";

function Alert() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const limit = 10; // number of notifications per page

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await getNotificationList(token, userId, page, limit);

        if (res?.status) {
          setNotifications(res.data);
          setPagination(res.pagination || { totalPages: 1 });
          setError(null);
        } else {
          setNotifications([]);
          setError(res?.message || "No notifications found");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Something went wrong while fetching notifications");
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) fetchNotifications();
  }, [userId, token, page]); // re-fetch when page changes

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="p-2">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl shadow-sm border border-blue-200">
        <h2 className="text-xl sm:text-2xl font-bold text-orange-600 tracking-wide">
          Alerts
        </h2>
        <BackButton showText={true} />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center p-10 text-gray-500 animate-pulse">
          Loading notifications...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-10 text-red-500">
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-2xl shadow-md border border-gray-200 animate-fadeIn relative">
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
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <ul className="space-y-4">
            {notifications.map((notif, index) => (
              <li
                key={notif._id || index}
                className="p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition duration-300"
              >
                <h3 className="text-lg font-semibold text-blue-700 capitalize">
                  {notif.title || "Untitled Alert"}
                </h3>
                <p className="text-gray-600 mt-1">
                  {notif.message || "No message available."}
                </p>
                <span className="text-sm text-gray-400 mt-2 block">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-medium border transition ${
                page === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            <span className="text-gray-600 text-sm">
              Page {page} of {pagination.totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={page === pagination.totalPages}
              className={`px-4 py-2 rounded-lg font-medium border transition ${
                page === pagination.totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alert;
