import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Content from "../../../components/superadmin/Content";
import ChangePassword from "../../superadmin/profile/ChangePassword";
import { GetUserDetails } from "../../../services/User";

const UserProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({ fullName: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [name,setname] = useState("Anuj")
    

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await GetUserDetails(token, id); 
                setUserDetails(response?.data);
                setFormData({ fullName: response?.data?.FullName || "" });
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, [token, id]);


    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log("Saving profile data:", formData);
        setIsEditing(false);
        // TODO: Add API call to update profile
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedImage(URL.createObjectURL(file));
    };

    return (
        <>
            <div className=" p-6">
                <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">

                    {/* Left Section: Profile Image */}
                    <div className="lg:col-span-2">
                        <div className="border rounded-xl p-6 text-center shadow-sm">
                            <div className="w-32 h-32 border rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 overflow-hidden">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    userDetails?.FullName?.charAt(0) || "U"
                                )}
                            </div>

                            <div className="flex items-center gap-4 mt-5">
                                <button
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border ${userDetails?.ActiveStatus === 1
                                        ? "bg-green-500 text-white border-green-600"
                                        : "bg-red-100 text-red-600 border-red-300"
                                        }`}
                                >
                                    {userDetails?.ActiveStatus === 1 ? "Active" : "DeActive"}
                                </button>

                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 transition"
                                >
                                    Change Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Profile Info / Change Password */}
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
                                {/* <button
                                    onClick={() => setActiveTab("settings")}
                                    className={`flex-1 p-3 text-sm font-medium ${activeTab === "settings"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-500"
                                        }`}
                                >
                                    Change Password
                                </button> */}
                            </div>

                            <div className="p-4">
                                {activeTab === "profile" && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold">Profile Information</h3>
                                            <button
                                                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                                                className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                                            >
                                                {isEditing ? "Save" : "Edit"}
                                            </button>
                                        </div>

                                     

                                        <div className="border rounded-lg p-3">
                                            <p className="text-xs">Username</p>
                                            <p>{name|| "Not specified"}</p>
                                        </div>

                                        <div className="border rounded-lg p-3">
                                            <p className="text-xs">Phone Number</p>
                                            <p>{userDetails?.PhoneNo || "Not provided"}</p>
                                        </div>

                                      
                                    </div>
                                )}

                                {/* {activeTab === "settings" && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Change Password</h3>
                                        <div className="space-y-4 border rounded-lg p-4">
                                            <ChangePassword />
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Profile Photo */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
                        <h2 className="text-lg font-semibold mb-4">Change Profile Photo</h2>

                        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border">
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="flex items-center justify-center w-full h-full text-gray-400">
                                    No Image
                                </span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setSelectedImage(URL.createObjectURL(e.target.files[0]))}
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
                                    // TODO: Call API to save image
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserProfile;
