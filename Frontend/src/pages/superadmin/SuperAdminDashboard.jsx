import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaTrophy,
  FaCalendarAlt,
  FaClipboardList,
  FaDollarSign,
  FaCoins,
  FaRupeeSign,
  FaMedal,
} from "react-icons/fa";
import { GetDashboardCount } from "../../services/SuperAdmin";
import Swal from "sweetalert2";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // 🔹 Adjust if token is stored differently

  // 🔹 Fetch dashboard count on mount
  useEffect(() => {
    const fetchDashboardCount = async () => {
      try {
        const response = await GetDashboardCount(token);
        if (response?.status) {
          setDashboardData(response.data);
        } else {
          Swal.fire(
            "Error",
            response?.message || "Failed to load data",
            "error"
          );
        }
      } catch (error) {
        Swal.fire(
          "Error",
          "Something went wrong while fetching dashboard data",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCount();
  }, [token]);

  // 🔹 Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-gray-600">
        Loading Dashboard...
      </div>
    );
  }

  // 🔹 No data fallback
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold text-red-500">
        No dashboard data available.
      </div>
    );
  }

  // 🔹 Dynamic stats from API
  const stats = [
    {
      title: "Total Clients",
      value: dashboardData.clientCountTotal,
      icon: <FaUsers />,
      route: "/superadmin/clients",
    },
    {
      title: "Active Clients",
      value: dashboardData.clientCountActive,
      icon: <FaUserCheck />,
      route: "/superadmin/activeclient",
    },
    {
      title: "Inactive Clients",
      value: dashboardData.clientCountInactive,
      icon: <FaUserTimes />,
      route: "/superadmin/inactiveclient",
    },
    {
      title: "Total Tournaments",
      value: dashboardData.tournamentTotal,
      icon: <FaTrophy />,
      route: "/superadmin/tournament",
    },
    {
      title: "Upcoming Tournaments",
      value: dashboardData.tournamentUpcoming,
      icon: <FaCalendarAlt />,
      route: "/superadmin/upcomingtournament",
    },
    {
      title: "Live Tournaments",
      value: dashboardData.tournamentLive,
      icon: <FaClipboardList />,
      route: "/superadmin/livetournament",
    },
    {
      title: "Completed Tournaments",
      value: dashboardData.tournamentCompleted,
      icon: <FaClipboardList />,
      route: "/superadmin/completedtournamnet",
    },
    {
      title: "Cancelled Tournaments",
      value: dashboardData.tournamentCancelled,
      icon: <FaClipboardList />,
      route: "/superadmin/cancelledtournament",
    },
    {
      title: "Total Contests",
      value: dashboardData.contestTotal,
      icon: <FaClipboardList />,
      route: "/superadmin/contest",
    },
    {
      title: "Active Contests",
      value: dashboardData.contestActive,
      icon: <FaClipboardList />,
      route: "/superadmin/activecontest",
    },
    {
      title: "Inactive Contests",
      value: dashboardData.contestInactive,
      icon: <FaClipboardList />,
      route: "/superadmin/inactivecontest",
    },
    {
      title: "Total Revenue",
      value: dashboardData.contestJoinTotalAmount || 0, // 👈 API se total revenue aayega
      icon: <FaRupeeSign />, // from react-icons/fa
      route: "/superadmin/revenue", // ya jaha revenue details dikhte ho
    },
    {
      title: "Total Winnings",
      value: dashboardData.prizePoolTotalAmount || 0, // 👈 API se total winnings aayega
      icon: <FaMedal />, // from react-icons/fa
      route: "/superadmin/winning", // ya jaha winnings details dikhte ho
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Super Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => stat.route && navigate(stat.route)}
            className={`group bg-white text-black rounded-2xl shadow-lg p-8 cursor-pointer
              transform transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl
              ${stat.route ? "hover:bg-blue-50" : "hover:bg-gray-50"}`}
            style={{
              animation: `fadeInUp 0.6s ease ${index * 0.08}s both`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="p-4 bg-gray-200 rounded-full group-hover:scale-110 transition-transform duration-300 text-xl">
                {stat.icon}
              </div>
              <div className="text-right">
                <h2 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h2>
                <p className="text-3xl font-bold mt-1 text-gray-900">
                  {stat.value !== null && stat.value !== undefined
                    ? stat.value
                    : 0}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default SuperAdminDashboard;
