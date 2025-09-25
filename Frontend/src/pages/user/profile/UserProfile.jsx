import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Content from "../../../components/superadmin/Content";
import ChangePassword from "../../superadmin/profile/ChangePassword";
import { GetUserDetails, updateClientImage } from "../../../services/User";
import BackButton from "../../../pages/user/Backbutton";
import toast from "react-hot-toast";
import * as config from "../../../utils/config";
const UserProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [formData, setFormData] = useState({ fullName: "" });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadFile, setUploadFile] = useState(null); // actual file for API
    const [name, setName] = useState(localStorage.getItem("playerName") || "");

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

    useEffect(() => {
        if (userDetails?.FullName) {
            setName(userDetails.FullName);
            localStorage.setItem("playerName", userDetails.FullName);
        }
    }, [userDetails]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        console.log("Saving profile data:", formData);
        setIsEditing(false);
        // TODO: Add API call to update profile
    };

    // when file chosen
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file); // keep original file for API
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleUploadImage = async () => {
        if (!uploadFile) {
            toast.error("Please select an image first.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("id", id);             // must match req.body.id
            formData.append("image", uploadFile);  // must match multer field name "image"

            const res = await updateClientImage(token, formData);
            if (res?.status === true) {
                toast.success("Profile photo updated!");
                setIsModalOpen(false);

                // ✅ Update state with backend image
                setUserDetails((prev) => ({
                    ...prev,
                    image: res.data.image
                }));

                // ✅ Set preview also from backend
                setSelectedImage(`${config.image_url}uploads/clients/${res.data.image}`);
            } else {
                toast.error(res?.message || "Failed to update image");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            toast.error("Error uploading image");
        }
    };



    return (
        <>
            <div className="p-6">
                <BackButton />

                <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8 mt-4">
                    {/* Left Section: Profile Image */}
                    <div className="lg:col-span-2">
                        <div className="border rounded-xl p-6 text-center shadow-sm">
                            <div className="w-32 h-32 border rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 overflow-hidden">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
                                )  : (
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

                    {/* Right Section: Tabs */}
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
                                    onClick={() => setActiveTab("management")}
                                    className={`flex-1 p-3 text-sm font-medium ${activeTab === "management"
                                        ? "border-b-2 border-blue-600 text-blue-600"
                                        : "text-gray-500"
                                        }`}
                                >
                                    Profile Management
                                </button>
                            </div>

                            <div className="p-4">
                                {/* Profile Info Tab */}
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
                                            <p>{name || "Not specified"}</p>
                                        </div>

                                        <div className="border rounded-lg p-3">
                                            <p className="text-xs">Phone Number</p>
                                            <p>{userDetails?.PhoneNo || "Not provided"}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Management Tab */}
                                {activeTab === "management" && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Profile Management</h3>

                                        {/* Edit Profile */}
                                        <div className="border rounded-lg p-4">
                                            <p className="font-medium mb-2">Edit Profile Details</p>
                                            <p className="text-sm text-gray-600">Update your name, email, and other details.</p>
                                            <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                                                Edit Now
                                            </button>
                                        </div>

                                        {/* KYC Section */}
                                        <div className="border rounded-lg p-4">
                                            <p className="font-medium mb-2">KYC Verification</p>
                                            <p className="text-sm text-gray-600">KYC is mandatory for withdrawals.</p>
                                            <button onClick={()=>navigate("/kycdetail")}  
                                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                                                Complete KYC
                                            </button>
                                        </div>

                                        {/* Bank/UPI Section */}
                                        <div className="border rounded-lg p-4">
                                            <p className="font-medium mb-2">Bank / UPI Details</p>
                                            <p className="text-sm text-gray-600">Required for payouts and withdrawals.</p>
                                            <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                                                Add Bank/UPI
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                                onClick={handleUploadImage}
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
