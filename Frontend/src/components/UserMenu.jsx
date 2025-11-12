import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Bell, Swords } from "lucide-react";
import Swal from "sweetalert2";
import { GetUserDetails } from "../services/User"; // ✅ same API as UserHeader

const UserMenu = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const profileRef = useRef();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ✅ Fetch user details (same as in UserHeader)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await GetUserDetails(token, userId);
        if (res?.status) {
          const data = res.data;
          setUserDetails(data);
        }
      } catch (err) {
        console.error("User fetch error", err);
      }
    };

    fetchUser();
  }, [token, userId]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "custom-swal-popup",
        title: "text-xl font-semibold text-gray-800",
        htmlContainer: "text-gray-600 text-base",
        confirmButton:
          "px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton:
          "px-5 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
      },
    });

    if (confirm.isConfirmed) {
      localStorage.clear();
      await Swal.fire({
        title: "✅ Logged Out",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 footer shadow-lg bg-white z-50 rounded-t-2xl">
      <div className="flex justify-around items-center h-16">
        {/* Home */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center hover:scale-110 transition"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        {/* Search */}
        <button
          onClick={() => navigate("/mycontests")}
          className="flex flex-col items-center hover:scale-110 transition"
        >
          <Swords className="h-6 w-6" />
          <span className="text-xs">My Contests</span>
        </button>

        {/* Alerts */}
        <button
          onClick={() => navigate("/alert")}
          className="flex flex-col items-center hover:scale-110 transition"
        >
          <Bell className="h-6 w-6" />
          <span className="text-xs">Alerts</span>
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => navigate("/profile")}
            className="flex flex-col items-center hover:scale-110 transition"
          >

            <div className="h-8 w-8 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center shadow-md">
              {userDetails?.image ? (
                <img
                  src={userDetails.image}
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-400 w-full h-full flex items-center justify-center">
                  {userDetails?.FullName
                    ? userDetails.FullName.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                    : "U"}
                </span>
              )}
            </div>
            <span className="text-xs">Profile</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserMenu;
