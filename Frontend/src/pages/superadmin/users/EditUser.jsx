import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { EditUser, GetUserDetails } from "../../../services/SuperAdmin";
import toast from "react-hot-toast";

const EditUsers = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        FullName: "",
        Email: "",
        PhoneNo: "",
        UserName: "",
        password: "",
    });

    const validationSchema = Yup.object({
        FullName: Yup.string().required("Full Name is required").min(3, "Min 3 characters"),
        Email: Yup.string().email("Invalid email format").required("Email is required"),
        PhoneNo: Yup.string().matches(/^\d{10}$/, "Must be 10 digits").required("Phone number is required"),
        UserName: Yup.string().min(3, "Min 3 characters").required("Username is required"),
        password: Yup.string()
            .min(8, "Min 8 characters")
            .matches(/[A-Z]/, "At least one uppercase")
            .matches(/[a-z]/, "At least one lowercase")
            .matches(/\d/, "At least one number")
            .matches(/[@$!%*?&#]/, "At least one special character")
            .notRequired(),
    });

    const fields = [
        { name: "FullName", label: "Full Name*", type: "text", className: "w-full" },
        { name: "Email", label: "Email*", type: "email", className: "w-full" },
        { name: "PhoneNo", label: "Phone No*", type: "text", className: "w-full" },
        { name: "UserName", label: "Username*", type: "text", className: "w-full" },
        { name: "password", label: "Password (Leave blank if unchanged)", type: "password", className: "w-full col-span-2" },
    ];

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await GetUserDetails(token, id);
                if (response?.data) {
                    setInitialValues({
                        FullName: response.data.FullName || "",
                        Email: response.data.Email || "",
                        PhoneNo: response.data.PhoneNo || "",
                        UserName: response.data.UserName || "",
                        password: "",
                    });
                }
            } catch (err) {
                toast.error("Failed to load user details");
            }
        };
        fetchUserDetails();
    }, [id]);

    const onSubmit = async (values) => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            const res = await EditUser(token, id, values);
            if (res?.status === true) {
                toast.success("User updated successfully!");
                navigate("/superadmin/alluser");
            } else {
                toast.error(res?.message || "Failed to update user");
            }
        } catch (error) {
            toast.error("Something went wrong while editing");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h2 className="text-left ms-3 text-2xl font-bold mb-6 text-gray-700">Edit User</h2>
            <div className="w-full max-w-2xl-lg bg-white rounded-2xl shadow-xl p-8">
                <ReusableForm
                    initialValues={initialValues}
                    enableReinitialize={true} // Ensures form updates when data loads
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                    fields={fields}
                    submitButton={{
                        label: loading ? "Updating..." : "Update User",
                        className:
                            "col-span-2 mt-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50",
                        disabled: loading,
                    }}
                />
            </div>
        </div>
    );
};

export default EditUsers;
