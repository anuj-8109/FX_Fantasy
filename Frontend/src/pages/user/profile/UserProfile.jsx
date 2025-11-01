import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, HelpCircle, Ticket, FileQuestion, BookOpen, FileText, LogOut, ChevronRight } from "lucide-react";
import BackButton from "../../../pages/user/Backbutton";
import { GetUserDetails, updateClientImage, getBankdetalis, deletebank, EditUser } from "../../../services/User";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const UserProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [bankdetail, setBankDetail] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);

    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [editProfileData, setEditProfileData] = useState({
        FullName: "",
        Email: "",
        state: "",
        city: "",
        dob: "",
    });

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const fetchUserDetails = async () => {
        try {
            const response = await GetUserDetails(token, id);
            if (response?.status) {
                setUserDetails(response.data);

                // Set image from backend with full URL
                if (response.data.image) {
                    const imageUrl = `${response?.data?.image}`;
                    console.log("Setting image URL:", imageUrl);
                    setSelectedImage(imageUrl);
                } else {
                    setSelectedImage(null);
                }
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            toast.error("Failed to fetch user details");
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [token, id]);

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const res = await getBankdetalis(token, id);
                if (res?.status) setBankDetail(res.data || []);
            } catch (error) {
                toast.error("Failed to fetch bank details");
            }
        };
        fetchBankDetails();
    }, [token, id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFile(file);
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
        }
    };

    const handleUploadImage = async () => {
        if (!uploadFile) {
            toast.error("Please select an image first.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("id", id);
            formData.append("image", uploadFile);

            const res = await updateClientImage(token, formData);
            console.log("Upload response:", res);

            if (res?.status === true) {
                toast.success("Profile photo updated!");
                setIsModalOpen(false);

                // Update with backend image URL
                const newImageUrl = `${res.data.image}`;
                console.log("New image URL:", newImageUrl);

                setUserDetails(prev => ({ ...prev, image: res.data.image }));
                setSelectedImage(newImageUrl);
                setPreviewImage(null);
                setUploadFile(null);

                // Refresh user details to ensure sync
                await fetchUserDetails();
            } else {
                toast.error(res?.message || "Failed to update image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Error uploading image");
        }
    };

    const handleDeleteBank = async (bankId) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this bank account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            customClass: "custom-swal-popup1"
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const res = await deletebank(token, bankId);
            if (res?.status) {
                toast.success("Bank account deleted successfully");
                setBankDetail((prev) => prev.filter((bank) => bank._id !== bankId));
            } else {
                toast.error(res?.message || "Failed to delete bank account");
            }
        } catch (error) {
            toast.error("Error deleting account");
        }
    };

    const handleLogout = async () => {
        const confirm = await Swal.fire({
            title: "Logout Confirmation",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            localStorage.clear();
            toast.success("Logged out successfully");
            navigate("/");
        }
    };

    const displayImage = previewImage || selectedImage;

    // Menu items with icons
    const menuItems = [
        // { label: "Profile Management", path: "/profile", icon: Home, active: true },
        { label: "Help Desk", path: "/helpdesk", icon: HelpCircle },
        { label: "Coupons", path: "/coupon", icon: Ticket },
        { label: "FAQ", path: "/faq", icon: FileQuestion },
        { label: "Blog", path: "/blog", icon: BookOpen },
        { label: "Content", path: "/content", icon: FileText },
        { label: "Bank Details", icon: FileText, action: () => setIsBankModalOpen(true) },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm mb-6">
                    <BackButton />

                    <button
                        onClick={() => {
                            setEditProfileData({
                                FullName: userDetails?.FullName || "",
                                Email: userDetails?.Email || "",
                                state: userDetails?.state || "",
                                city: userDetails?.city || "",
                                dob: userDetails?.dob ? userDetails.dob.split("T")[0] : "",
                            });
                            setIsEditProfileModalOpen(true);
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        Update Profile
                    </button>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Sidebar - Profile Card */}
                    <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-2 text-center">
                        <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-gray-100 relative flex items-center justify-center text-4xl font-bold bg-gradient-to-br from-blue-500 to-cyan-400 text-white">
                            <div
                                className="w-full h-full cursor-pointer"
                                onClick={() => displayImage && setIsPreviewOpen(true)}
                            >
                                {displayImage ? (
                                    <img
                                        src={displayImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{userDetails?.FullName?.charAt(0) || "U"}</span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full hover:bg-opacity-80 transition"
                            >
                                Edit
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{userDetails?.FullName || "User"}</h2>
                        <p className="text-sm text-gray-500 mb-6">{userDetails?.Email || "Email not provided"}</p>

                        {/* Menu Items */}
                        <div className="space-y-1 text-left">
                            {menuItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => item.action ? item.action() : navigate(item.path)}

                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${item.active
                                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                                        : "hover:bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5" />
                                        <span className="font-medium text-sm">{item.label}</span>
                                    </div>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            ))}

                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <LogOut className="h-5 w-5" />
                                    <span className="font-medium text-sm">Log Out</span>
                                </div>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Tabs */}
                    <div className="lg:col-span-3 bg-white shadow-md rounded-xl overflow-hidden">
                        <div className="flex border-b">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`flex-1 p-4 text-sm font-semibold transition ${activeTab === "profile"
                                    ? "border-b-3 border-orange-600 text-orange-600 bg-orange-50"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                Profile Info
                            </button>
                            <button
                                onClick={() => setActiveTab("management")}
                                className={`flex-1 p-4 text-sm font-semibold transition ${activeTab === "management"
                                    ? "border-b-3 border-orange-600 text-orange-600 bg-orange-50"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                Profile Management
                            </button>
                        </div>

                        <div className="p-2 space-y-4">
                            {activeTab === "profile" && (
                                <div className="space-y-4">
                                    <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition">
                                        <p className="text-xs text-gray-500 mb-1">Username</p>
                                        <p className="font-medium">{userDetails?.FullName || "Not provided"}</p>
                                    </div>

                                    <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition">
                                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                                        <p className="font-medium">{userDetails?.PhoneNo || "Not provided"}</p>
                                    </div>

                                    <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition">
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="font-medium">{userDetails?.Email || "Not provided"}</p>
                                    </div>

                                    <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-sm transition">
                                        <p className="text-xs text-gray-500 mb-1">Location</p>
                                        <p className="font-medium">{userDetails?.city}, {userDetails?.state}</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === "management" && (
                                <div className="space-y-4">
                                    <div className="border rounded-lg p-5 bg-gradient-to-r from-green-50 to-emerald-50 hover:shadow-md transition">
                                        <p className="font-semibold text-lg mb-2 text-gray-800">KYC Verification</p>
                                        <p className="text-sm text-gray-600 mb-3">Required for withdrawals and payouts.</p>

                                        {userDetails?.kyc_verification === 1 ? (
                                            <button
                                                disabled
                                                className="px-5 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm font-medium"
                                            >
                                                ✓ Completed
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate("/kycdetail")}
                                                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium shadow-md hover:shadow-lg transition"
                                            >
                                                Complete KYC
                                            </button>
                                        )}
                                    </div>

                                    <div className="border rounded-lg p-5 bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-md transition">
                                        <p className="font-semibold text-lg mb-2 text-gray-800">Bank / UPI Details</p>
                                        <p className="text-sm text-gray-600 mb-3">Add your bank account or UPI for payouts.</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => {
                                                    if (bankdetail.length > 0) {
                                                        toast.error("Please delete your previous bank before adding a new one.");
                                                    } else {
                                                        navigate("/bankdetail");
                                                    }
                                                }}
                                                className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium shadow-md hover:shadow-lg transition"
                                            >
                                                Add Bank
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (bankdetail.length > 0) {
                                                        toast.error("Please delete your previous bank before adding a new one.");
                                                    } else {
                                                        navigate("/bankdetail");
                                                    }
                                                }}
                                                className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium shadow-md hover:shadow-lg transition"
                                            >
                                                Add UPI
                                            </button>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bank Details Section */}
                {/* <div className="mt-8 bg-white shadow-md rounded-xl p-2">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Bank Details</h2>
                    {bankdetail.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bankdetail.map((bank) => (
                                <div
                                    key={bank._id}
                                    className="border-2 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-cyan-50 relative"
                                >
                                    <h3 className="text-lg font-bold mb-3 text-gray-800">{bank.name}</h3>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Account:</span> {bank.accountno}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">IFSC:</span> {bank.ifsc}
                                        </p>
                                        <p className="text-gray-700">
                                            <span className="font-semibold">Branch:</span> {bank.branch}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleDeleteBank(bank._id)}
                                        className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 shadow-md transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
                            <p className="text-gray-500 text-lg">No bank details available</p>
                            <button
                                onClick={() => navigate("/bankdetail")}
                                className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Add Bank Details
                            </button>
                        </div>
                    )}
                </div> */}


            </div>

            {/* Image Preview Modal */}
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <img
                        src={displayImage}
                        alt="Preview"
                        className="max-w-md max-h-96 object-cover rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}



            {/* Edit Profile Modal */}
            {isEditProfileModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsEditProfileModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Update Profile</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={editProfileData.FullName}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, FullName: e.target.value })
                                    }
                                    className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editProfileData.Email}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, Email: e.target.value })
                                    }
                                    className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">State</label>
                                <input
                                    type="text"
                                    value={editProfileData.state}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, state: e.target.value })
                                    }
                                    className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">City</label>
                                <input
                                    type="text"
                                    value={editProfileData.city}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, city: e.target.value })
                                    }
                                    className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Date of Birth</label>
                                <input
                                    type="date"
                                    value={editProfileData.dob}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, dob: e.target.value })
                                    }
                                    className="w-full border-2 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsEditProfileModalOpen(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await EditUser(token, {
                                            id,
                                            ...editProfileData,
                                        });

                                        if (res?.status) {
                                            toast.success("Profile updated successfully!");
                                            setUserDetails((prev) => ({
                                                ...prev,
                                                ...editProfileData,
                                            }));
                                            setIsEditProfileModalOpen(false);
                                            await fetchUserDetails();
                                        } else {
                                            toast.error(res?.message || "Failed to update profile");
                                        }
                                    } catch (error) {
                                        toast.error("Error updating profile");
                                    }
                                }}
                                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-md hover:shadow-lg transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Photo Upload Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4 text-center">Change Profile Photo</h2>

                        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-gray-200 flex items-center justify-center bg-gray-100">
                            {previewImage ? (
                                <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-600 border-2 border-gray-300 rounded-lg cursor-pointer mb-6 p-2 focus:ring-2 focus:ring-orange-500"
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setPreviewImage(null);
                                    setUploadFile(null);
                                }}
                                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadImage}
                                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition"
                            >
                                Save Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* 🏦 Bank Details Modal */}
            {isBankModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsBankModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Bank Details</h2>
                            <button
                                onClick={() => setIsBankModalOpen(false)}
                                className="text-gray-500 hover:text-red-500 font-semibold text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        {bankdetail.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {bankdetail.map((bank) => (
                                    <div
                                        key={bank._id}
                                        className="border-2 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-cyan-50 relative"
                                    >
                                        <h3 className="text-lg font-bold mb-3 text-gray-800">{bank.name}</h3>
                                        <div className="space-y-2 text-sm">
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Account:</span> {bank.accountno}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-semibold">IFSC:</span> {bank.ifsc}
                                            </p>
                                            <p className="text-gray-700">
                                                <span className="font-semibold">Branch:</span> {bank.branch}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteBank(bank._id)}
                                            className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 shadow-md transition"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed rounded-lg bg-gray-50">
                                <p className="text-gray-500 text-lg">No bank details available</p>
                                <button
                                    onClick={() => {
                                        setIsBankModalOpen(false);
                                        navigate("/bankdetail");
                                    }}
                                    className="mt-4 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                >
                                    Add Bank Details
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;