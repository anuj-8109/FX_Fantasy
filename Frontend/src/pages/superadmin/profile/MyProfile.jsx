import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserDetails, PassWordChange } from "../../../services/SuperAdmin";
import Content from "../../../components/superadmin/Content";
import swal from "sweetalert2";

const MyProfile = () => {
  const [userdetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({ fullName: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const roleId = Number(localStorage.getItem("roleId"));

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await GetUserDetails(token, id);
      setUserDetails(response?.data);
      setFormData({ fullName: response?.data?.FullName || "" });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    console.log("Saving profile data:", formData);
    setIsEditing(false);

  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
  };


  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      swal.fire("New password and confirm password do not match");
      return;
    }

    try {
      const response = await PassWordChange(token, {
        id: id,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.status) {
        swal.fire("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        swal.fire(response.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      swal.fire("Error changing password");
    }
  };


  return (
    <Content
      className="border-none p-6"
      Page_title="Profile Management"
      button_title="Back"
      button_status={true}
      route={"/superadmin/dashboard"}
    >
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            <div className="border rounded-xl p-6 text-center shadow-sm">
              <div className="w-32 h-32 border rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 overflow-hidden">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  userdetails?.FullName?.charAt(0) || "U"
                )}
              </div>

              <div className="flex items-center gap-4 mt-5">
                <button
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${userdetails?.ActiveStatus === 1
                    ? "bg-green-500 text-white border-green-600"
                    : "bg-red-100 text-red-600 border-red-300"
                    }`}
                >
                  {userdetails?.ActiveStatus === 1 ? "Active" : "DeActive"}
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition"
                >
                  Change Profile Photo
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-3">
            <div className="border rounded-xl shadow-sm">
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
                  Change Password
                </button>
              </div>

              <div className="p-4">
                {activeTab === "profile" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">
                        Profile Information
                      </h3>
                      <button
                        onClick={() =>
                          isEditing ? handleSaveProfile() : setIsEditing(true)
                        }
                        disabled={roleId === 1}  
                        className={`px-4 py-2 text-sm rounded-lg text-white 
                          ${roleId === 1
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"}`
                        }
                      >
                        {isEditing ? "Save" : "Edit"}
                      </button>
                    </div>

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

                    <div className="border rounded-lg p-3">
                      <p className="text-xs">Username</p>
                      <p>{userdetails?.UserName || "Not specified"}</p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <p className="text-xs">Phone Number</p>
                      <p>{userdetails?.PhoneNo || "Not provided"}</p>
                    </div>

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
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-3">
                        Change Password
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current Password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "currentPassword",
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-gray-300"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            handlePasswordChange("newPassword", e.target.value)
                          }
                          className="w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-gray-300"
                        />
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className="w-full border rounded px-3 py-2 text-sm focus:ring focus:ring-gray-300"
                        />

                        <button
                          onClick={handleChangePassword}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Save Password
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
            <h2 className="text-lg font-semibold mb-4">Change Profile Photo</h2>

            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex items-center justify-center w-full h-full text-gray-400">
                  No Image
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Profile photo uploaded!");
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Content>
  );
};

export default MyProfile;
