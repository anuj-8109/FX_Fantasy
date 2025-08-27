import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserDetails } from "../../../services/SuperAdmin";

const MyProfile = () => {
  const [userdetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: ''
  });

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const response = await GetUserDetails(token, id);
      setUserDetails(response?.data);
      setFormData({
        fullName: response?.data?.FullName || ''
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center py-6 px-2">
      <div className="w-full max-w-md border border-gray-200 rounded-3xl shadow-lg p-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-bold text-xl text-gray-600">FX</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {userdetails?.FullName || "User Name"}
              </h2>
              <p className="text-sm text-gray-500">{userdetails?.Email || "user@example.com"}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* Profile Details */}
        <div className="space-y-3 mb-6">
          {/* Full Name */}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Full Name:</span>
            {isEditing ? (
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-40"
                placeholder="Your First Name"
              />
            ) : (
              <span className="font-semibold">{formData.fullName || "Your First Name"}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Username:</span>
            <span className="font-semibold">{userdetails?.UserName || "-"}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Phone:</span>
            <span className="font-semibold">{userdetails?.PhoneNo || "-"}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-medium">Status:</span>
            <span className={`font-semibold px-2 py-1 rounded-full text-sm border ${
              userdetails?.ActiveStatus === 1 
                ? 'text-green-700 border-green-200' 
                : 'text-red-700 border-red-200'
            }`}>
              {userdetails?.ActiveStatus === 1 ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Email Section */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">My email Address</h3>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white text-sm">📧</span>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{userdetails?.Email || "user@example.com"}</p>
              <p className="text-xs text-gray-500">1 month ago</p>
            </div>
          </div>
          <button className="mt-2 text-blue-500 hover:text-blue-600 font-medium text-sm">
            + Add Email Address
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Save Changes
            </button>
          ) : (
            <>
              <button className="px-5 py-2 border-2 border-blue-500 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors duration-200 text-sm">
                Reset Password
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-5 py-2 border-2 border-green-500 text-green-600 rounded-xl font-medium hover:bg-green-50 transition-colors duration-200 text-sm"
              >
                Update Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;