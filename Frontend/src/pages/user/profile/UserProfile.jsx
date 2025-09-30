import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../pages/user/Backbutton";
import { GetUserDetails, updateClientImage, getBankdetalis, deletebank } from "../../../services/User";
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
    console.log("selectedImage", selectedImage)

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

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <BackButton />

            {/* Top Section: Profile Card */}
            <div className="grid lg:grid-cols-5 gap-8 mt-4">
                <div className="lg:col-span-2 bg-white shadow rounded-xl p-6 text-center">
                    <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border border-gray-200 flex items-center justify-center text-4xl font-bold bg-gray-100">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            userDetails?.FullName?.charAt(0) || "U"
                        )}
                    </div>

                    <h2 className="text-xl font-semibold mb-2">{userDetails?.FullName || "User"}</h2>
                    <p className="text-sm text-gray-500">{userDetails?.Email || "Email not provided"}</p>

                    <div className="flex justify-center gap-4 mt-4">
                        <span className={`px-4 py-2 rounded-lg text-sm font-medium ${userDetails?.ActiveStatus === 1
                            ? "bg-green-500 text-white"
                            : "bg-red-100 text-red-600"
                            }`}>
                            {userDetails?.ActiveStatus === 1 ? "Active" : "DeActive"}
                        </span>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Change Photo
                        </button>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="lg:col-span-3 bg-white shadow rounded-xl overflow-hidden">
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

                    <div className="p-4 space-y-4">
                        {activeTab === "profile" && (
                            <div className="space-y-4">
                                <div className="border p-3 rounded-lg bg-gray-50">
                                    <p className="text-xs text-gray-500">Username</p>
                                    <p>{name}</p>
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
                                        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                                    >
                                        Add Bank/UPI
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
