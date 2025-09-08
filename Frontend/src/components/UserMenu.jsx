import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, Search, Bell, User } from "lucide-react";

const UserMenu = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/userDashboard"); // Route for the dashboard
  };

  const handleSearchClick = () => {
    navigate("/search"); // Route for search page if available
  };

  const handleAlertsClick = () => {
    navigate("/alerts"); // Route for alerts page if available
  };

  const handleProfileClick = async () => {
    try {
      const response = await fetch("https://api.example.com/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization headers if needed
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      const data = await response.json();
      console.log("User Profile:", data);
      // You can navigate to a profile page or show a modal here
      navigate("/profile", { state: { profile: data } });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
      <div className="flex justify-around items-center h-16">
        
        <button onClick={handleHomeClick} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        <button onClick={handleSearchClick} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </button>

        <button onClick={handleAlertsClick} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Bell className="h-6 w-6" />
          <span className="text-xs">Alerts</span>
        </button>

        <button onClick={handleProfileClick} className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>

      </div>
    </div>
  );
};

export default UserMenu;
