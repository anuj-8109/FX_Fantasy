import React from 'react'
// import { Search, Bell, User } from "lucide-react";
import { Home, Search, Bell, User } from "lucide-react";

const UserMenu = () => {
   return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md">
      <div className="flex justify-around items-center h-16">
        
        
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Home classNa me="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

     
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </button>

        
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <Bell className="h-6 w-6" />
          <span className="text-xs">Alerts</span>
        </button>

        <button className="flex flex-col items-center text-gray-600 hover:text-blue-500">
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>

      </div>
    </div>
  );
}

export default UserMenu;




