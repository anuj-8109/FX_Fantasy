import React, { useEffect, useState } from "react";
import { getNotificationList, changeAllNotificationStatus } from "../../../services/SuperAdmin";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // number of notifications per page

  // ✅ Fetch notifications with pagination
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotificationList(page);
      if (res?.status) {
        setNotifications(res.data || []);
        setTotalPages(res.totalPages || 1);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notification list:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Mark all notifications as read
  const handleMarkAllRead = async () => {
    const confirm = await Swal.fire({
      title: "Mark all as read?",
      text: "This will mark all notifications as read.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, mark all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await changeAllNotificationStatus();
        if (res?.status) {
          Swal.fire({
            icon: "success",
            title: "All notifications marked as read",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchNotifications();
        }
      } catch (error) {
        console.error("Error changing all notification statuses:", error);
      }
    }
  };

  // ✅ Pagination handlers
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">🔔 Notifications</h1>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 border rounded-lg ${
                n.status === "unread" ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-medium text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-600">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {n.status === "unread" && (
                  <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full h-fit">
                    New
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Pagination */}
      {notifications.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={prevPage}
            disabled={page === 1}
            className={`flex items-center gap-1 px-3 py-1 border rounded ${
              page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={page === totalPages}
            className={`flex items-center gap-1 px-3 py-1 border rounded ${
              page === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Notification;
