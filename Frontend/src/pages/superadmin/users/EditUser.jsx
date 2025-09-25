import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { EditUser, GetUserDetails } from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";
const EditUsers = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location?.state?.userId;

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [initialValues, setInitialValues] = useState({
        FullName: "",
        Email: "",
        PhoneNo: "",
        UserName: "",
        password: "",
    });


    const validationSchema = Yup.object({
        FullName: Yup.string()
            .required("Full Name is required")
            .min(3, "Minimum 3 characters required")
            .max(50, "Maximum 50 characters allowed")
            .matches(/^[a-zA-Z\s]+$/, "Only letters and spaces are allowed"),

        Email: Yup.string()
            .email("Invalid email format")
            .required("Email is required")
            .max(100, "Email too long"),

        PhoneNo: Yup.string()
            .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
            .required("Phone number is required"),

        UserName: Yup.string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username cannot exceed 20 characters")
            .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
            .required("Username is required"),


    });

    // Form fields configuration
    const fields = [

        {
            name: "FullName",
            label: "Full Name*",
            type: "text",
            className: "w-full",
            placeholder: "Enter full name"
        },
         {
            name: "UserName",
            label: "Username*",
            type: "text",
            className: "w-full",
            placeholder: "Enter username",
            disabled:true
        },
        {
            name: "Email",
            label: "Email Address*",
            type: "email",
            className: "w-full",
            placeholder: "Enter email address"
        },
        {
            name: "PhoneNo",
            label: "Phone Number*",
            type: "text",
            className: "w-full",
            placeholder: "Enter 10-digit phone number"
        },
       
     
    ];

    // Fetch user details on component mount
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!id) {
                toast.error("User ID not provided");
                navigate("/superadmin/alluser");
                return;
            }

            try {
                setDataLoading(true);
                const token = localStorage.getItem("token");

                if (!token) {
                    toast.error("Authentication required");
                    navigate("/login");
                    return;
                }

                const response = await GetUserDetails(token, id);

                if (response?.data) {
                    setInitialValues({
                        FullName: response.data.FullName || "",
                        Email: response.data.Email || "",
                        PhoneNo: response.data.PhoneNo || "",
                        UserName: response.data.UserName || "",
                        password: "", // Always empty for security
                    });
                } else {
                    toast.error("Failed to load user details");
                }
            } catch (err) {
                console.error("Error fetching user details:", err);
                toast.error("Failed to load user details");
                navigate("/superadmin/alluser");
            } finally {
                setDataLoading(false);
            }
        };

        fetchUserDetails();
    }, [id, navigate]);

    // Handle form submission
    const onSubmit = async (values) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Authentication required");
                navigate("/login");
                return;
            }

            // Clean up values - remove empty password
            const submitValues = { ...values, id: id };
            if (!submitValues.password || submitValues.password.trim() === "") {
                delete submitValues.password;
            }

            const response = await EditUser(token, submitValues);

            if (response?.status === true) {
                toast.success("User updated successfully!");
                navigate("/superadmin/alluser");
            } else {
                toast.error(response?.message || "Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error(error?.response?.data?.message || "Something went wrong while updating user");
        } finally {
            setLoading(false);
        }
    };


    if (dataLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading user details...</p>
                </div>
            </div>
        );
    }

    return (
     <Content Page_title="Edit User" button_status={true} button_title="Back" route={"/superadmin/alluser"} >
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                    <ReusableForm
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        fields={fields}
                        submitButton={{
                            label: loading ? "Updating User..." : "Update User",
                            className: "w-full md:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                            disabled: loading,
                        }}
                        className="space-y-6"
                    />
                </div>


                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Leave the password field empty if you don't want to change the current password.
                                All fields marked with * are required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Content>
    );
};

export default EditUsers;