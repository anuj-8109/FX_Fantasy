import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Bell, User } from "lucide-react";
import Swal from "sweetalert2";

const UserMenu = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user

  // Close dropdown on outside click
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
        confirmButton: "px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton: "px-5 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
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
      navigate("/userlogin");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
      <div className="flex justify-around items-center h-16">

        <button onClick={() => navigate("/userDashboard")} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        <button onClick={() => navigate("/search")} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </button>

        <button onClick={() => navigate("/alerts")} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Bell className="h-6 w-6" />
          <span className="text-xs">Alerts</span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex flex-col items-center text-gray-600 hover:text-blue-500"
          >
            <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
              {user?.FullName?.split(" ").map((n) => n[0]).join("")}
            </div>
            <span className="text-xs">Profile</span>
          </button>

          {showProfile && (
            <div className="absolute bottom-16 right-0 w-56 shadow-lg rounded-lg border bg-white z-50">
              <div className="p-3 border-b text-sm">
                <p className="font-medium">{user?.FullName}</p>
                <p className="text-xs text-gray-500">{user?.Email}</p>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile Management
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserMenu;
