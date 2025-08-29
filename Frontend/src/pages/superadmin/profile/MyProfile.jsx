import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserDetails } from "../../../services/SuperAdmin";
import ChangePassword from "../../superadmin/profile/ChangePassword" 
// import Content from "../../superadmin/content/Content"
import Content from "../../../components/superadmin/Content"



const MyProfile = () => {
  const [userdetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 🔹 Tab state
  const [formData, setFormData] = useState({
    fullName: ""
  });

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const response = await GetUserDetails(token, id);
      setUserDetails(response?.data);
      setFormData({
        fullName: response?.data?.FullName || ""
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving profile data:", formData);
    setIsEditing(false);
   
  };

  return (
    <Content className="border-none p-6">
    <div className="min-h-screen p-6 ">
      <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">
   
        <div className="lg:col-span-2 ">
          <div className="border rounded-xl p-6 text-center shadow-sm ">
   
            <div className="w-32 h-32 border rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4">
              {userdetails?.FullName?.charAt(0) || "U"}
            </div>

            <h2 className="text-xl font-semibold">
              {userdetails?.FullName || "User Name"}
            </h2>
            <p className="">@{userdetails?.UserName || "username"}</p>

            {/* Status */}
            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm border ${userdetails?.ActiveStatus === 1
                    ? "bg-green-50 text-green-600 border-green-300"
                    : "bg-red-50 text-red-600 border-red-300"
                  }`}
              >
                {userdetails?.ActiveStatus === 1 ? "Active" : "DeActive"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-3">
          <div className="border rounded-xl shadow-sm">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === "profile"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                  }`}
              >
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === "settings"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                  }`}
              >
               ChangePassword
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {activeTab === "profile" && (
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Profile Information</h3>
                    <button
                      onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                      className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {isEditing ? "Save" : "Edit"}
                    </button>
                  </div>

                  {/* Full Name */}
                  <div className="border rounded-lg p-3">
                    <p className="text-xs">Full Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="mt-1 w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-gray-300"
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p>{formData.fullName || "Not specified"}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="border rounded-lg p-3">
                    <p className="text-xs">Username</p>
                    <p>{userdetails?.UserName || "Not specified"}</p>
                  </div>

                  {/* Phone */}
                  <div className="border rounded-lg p-3">
                    <p className="text-xs">Phone Number</p>
                    <p>{userdetails?.PhoneNo || "Not provided"}</p>
                  </div>

                  {/* Email */}
                  <div className="border rounded-lg p-3">
                    <p className="text-xs">Email Address</p>
                    <p>{userdetails?.Email || "user@example.com"}</p>
                    <span className="text-xs text-green-600 border border-green-300 px-2 py-1 rounded inline-block mt-1">
                      Verified
                    </span>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Change Password</h3>
                  <div className="space-y-4">

                    {/* Change Password */}
                    <div className="border rounded-lg p-4">
                      
                      <ChangePassword />
                    </div>

                

                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
    </Content>
  );
};

export default MyProfile;
