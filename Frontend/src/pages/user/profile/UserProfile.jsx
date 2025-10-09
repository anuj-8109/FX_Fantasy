import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../pages/user/Backbutton";
import { GetUserDetails, updateClientImage, getBankdetalis, deletebank, EditUser } from "../../../services/User";
import toast from "react-hot-toast";
import * as config from "../../../utils/config";
import Swal from "sweetalert2";


const UserProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [name, setName] = useState(localStorage.getItem("playerName") || "");
    const [bankdetail, setBankDetail] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [edituser, setEdituser] = ([]);
    const [isEditingName, setIsEditingName] = useState(false);
    const [updatedName, setUpdatedName] = useState(name);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await GetUserDetails(token, id);
                setUserDetails(response?.data);
                setName(response?.data?.FullName || "");

                if (response?.data?.image) {
                    setSelectedImage(response?.data?.image);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUserDetails();
    }, [token, id]);

    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const res = await getBankdetalis(token, id); // pass userId
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
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const hendledelete = async (bankId) => {
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
            console.log(res);
            if (res?.status === true) {
                toast.success("Profile photo updated!");
                setIsModalOpen(false);
                setUserDetails((prev) => ({ ...prev, image: res.data.image }));
                setSelectedImage(`${config.image_url}uploads/basicsetting/${res.data.image}?t=${Date.now()}`);

            } else {
                toast.error(res?.message || "Failed to update image");
            }
        } catch (error) {
            toast.error("Error uploading image");
        }
    };



    // const handleSaveName = async () => {
    //     if (!updatedName.trim()) {
    //         toast.error("Name cannot be empty");
    //         return;
    //     }

    //     try {
    //         // Send PUT request with updated name
    //         const res = await EditUser(token, {
    //             id,
    //             FullName: updatedName,
    //             Email: userDetails?.Email, // keep current email
    //             PhoneNo: userDetails?.PhoneNo // keep current phone
    //         });

    //         if (res?.status) {
    //             setUserDetails((prev) => ({ ...prev, FullName: updatedName }));
    //             setName(updatedName);
    //             setIsEditingName(false);
    //             toast.success("Name updated successfully!");
    //         } else {
    //             toast.error(res?.message || "Failed to update name");
    //         }
    //     } catch (error) {
    //         toast.error("Error updating name");
    //     }
    // };


    const handleupdateuser = async () => {
        const response = await EditUser(token);
        if (response?.status) {
            setEdituser(response?.data);
        }
        else {
            toast.error("can't fatch data")
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center bg-gray-100 justify-between border border-gray-200 rounded-lg p-4  shadow-sm">
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
                    className="mt-0 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-semibold shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-orange-600 hover:to-orange-500"
                >
                    Update Profile
                </button>
            </div>

            {/* Top Section: Profile Card */}
            <div className="grid lg:grid-cols-5 gap-8 mt-4">
                <div className="lg:col-span-2 bg-white shadow rounded-xl p-6 text-center">
                    <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border border-gray-200 relative flex items-center justify-center text-4xl font-bold bg-gray-100 cursor-pointer">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onClick={() => setIsPreviewOpen(true)}
                            />
                        ) : (
                            <span onClick={() => setIsPreviewOpen(true)}>
                                {userDetails?.FullName?.charAt(0) || "U"}
                            </span>
                        )}

                        {/* Edit overlay */}
                        <label className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-opacity-70">
                            Edit
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => setSelectedImage(reader.result);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </label>
                    </div>



                    <h2 className="text-xl font-semibold mb-2">{userDetails?.FullName || "User"}</h2>
                    <p className="text-sm text-gray-500">{userDetails?.Email || "Email not provided"}</p>


                </div>

                {/* Tabs Section */}
                <div className="lg:col-span-3 bg-white shadow rounded-xl overflow-hidden">
                    <div className="flex border-b">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex-1 p-3 text-sm font-medium ${activeTab === "profile"
                                ? "border-b-2 border-orange-600 text-orange-600"
                                : "text-gray-500"
                                }`}
                        >
                            Profile Info
                        </button>
                        <button
                            onClick={() => setActiveTab("management")}
                            className={`flex-1 p-3 text-sm font-medium ${activeTab === "management"
                                ? "border-b-2 border-orange-600 text-orange-600"
                                : "text-gray-500"
                                }`}
                        >
                            Profile Management
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {activeTab === "profile" && (
                            <div className="space-y-4">
                                <div className="border p-3 rounded-lg bg-gray-50">
                                    <p className="text-xs text-gray-500">Username</p>
                                    {isEditingName ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={updatedName}
                                                onChange={(e) => setUpdatedName(e.target.value)}
                                                className="border rounded-lg p-1 flex-1"
                                            />
                                            {/* <button
                                                onClick={handleSaveName}
                                                className="px-3 py-1 bg-orange-600 text-orange-500 rounded-lg"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => { setIsEditingName(false); setUpdatedName(name); }}
                                                className="px-3 py-1 bg-gray-300 rounded-lg"
                                            >
                                                Cancel
                                            </button> */}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <span>{userDetails?.FullName || "Not provided"}</span>
                                            {/* <button
                                                onClick={() => setIsEditingName(true)}
                                                className="text-blue-600 text-sm font-medium"
                                            >
                                                Edit
                                            </button> */}
                                        </div>
                                    )}
                                </div>

                                <div className="border p-3 rounded-lg bg-gray-50">
                                    <p className="text-xs text-gray-500">Phone Number</p>
                                    <p>{userDetails?.PhoneNo || "Not provided"}</p>
                                </div>
                            </div>
                        )}



                        {activeTab === "management" && (
                            <div className="space-y-4">




                                <div className="border p-4 rounded-lg bg-gray-50">
                                    <p className="font-medium mb-2">KYC Verification</p>
                                    <p className="text-sm text-gray-600">Required for withdrawals.</p>

                                    {userDetails?.kyc_verification === 1 ? (
                                        <button
                                            disabled
                                            className="mt-2 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed text-sm"
                                        >
                                            Completed
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => navigate("/kycdetail")}
                                            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                        >
                                            Complete KYC
                                        </button>
                                    )}
                                </div>


                                <div className="border p-4 rounded-lg bg-gray-50">
                                    <p className="font-medium mb-2">Bank / UPI Details</p>
                                    <p className="text-sm text-gray-600">Required for payouts.</p>
                                    <button
                                        onClick={() => navigate("/bankdetail")}
                                        className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                                    >
                                        Add Bank
                                    </button>
                                    <button
                                        onClick={() => navigate("/bankdetail")}
                                        className="mt-2 ms-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm"
                                    >
                                        Add UPI
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bank Details Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Bank Details</h2>
                {bankdetail.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bankdetail.map((bank) => (
                            <div
                                key={bank._id}
                                className="border rounded-xl p-4 shadow hover:shadow-lg transition duration-300 bg-white relative"
                            >
                                <h3 className="text-lg font-semibold mb-2 text-gray-700">{bank.name}</h3>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Account No:</span> {bank.accountno}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">IFSC:</span> {bank.ifsc}
                                </p>
                                <p className="text-sm font-semibold text-gray-700">{bank.branch}</p>

                                {/* Delete Button */}
                                <button
                                    onClick={() => hendledelete(bank._id)}
                                    className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                                >
                                    Delete
                                </button>

                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-6 border rounded-lg bg-gray-50">
                        No bank details available
                    </p>
                )}
            </div>
            {isPreviewOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <img
                        src={selectedImage || "https://via.placeholder.com/150"}
                        alt="Preview"
                        className="w-80 h-58 object-cover rounded-full shadow-lg" // pill shape
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
                    />
                </div>
            )}


            {isEditProfileModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setIsEditProfileModalOpen(false)} // Close when clicking outside
                >
                    <div
                        className="bg-white rounded-xl shadow-lg w-[700px] p-6 relative"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <h2 className="text-xl font-semibold mb-5 text-center">Update Profile</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={editProfileData.FullName}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, FullName: e.target.value })
                                    }
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={editProfileData.Email}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, Email: e.target.value })
                                    }
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            {/* State */}
                            <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <input
                                    type="text"
                                    value={editProfileData.state}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, state: e.target.value })
                                    }
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            {/* City */}
                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    type="text"
                                    value={editProfileData.city}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, city: e.target.value })
                                    }
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>

                            {/* DOB */}
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    value={editProfileData.dob}
                                    onChange={(e) =>
                                        setEditProfileData({ ...editProfileData, dob: e.target.value })
                                    }
                                    className="w-full border rounded-lg p-2"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsEditProfileModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
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
                                        } else {
                                            toast.error(res?.message || "Failed to update profile");
                                        }
                                    } catch (error) {
                                        toast.error("Error updating profile");
                                    }
                                }}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* Profile Photo Modal */}
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
        </div>
    );
};

export default UserProfile;
