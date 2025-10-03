import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { EditUser, GetUserDetails } from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";
import Swal from "sweetalert2";


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
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .required("Username is required"),
  });

  // Form fields configuration
  const fields = [
    {
      name: "FullName",
      label: "Full Name*",
      type: "text",
      className: "w-full",
      placeholder: "Enter full name",
    },
    {
      name: "UserName",
      label: "Username*",
      type: "text",
      className: "w-full",
      placeholder: "Enter username",
      disabled: true,
    },
    {
      name: "Email",
      label: "Email Address*",
      type: "email",
      className: "w-full",
      placeholder: "Enter email address",
    },
    {
      name: "PhoneNo",
      label: "Phone Number*",
      type: "text",
      className: "w-full",
      placeholder: "Enter 10-digit phone number",
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
  // Compare current values with initialValues
  const currentValues = { ...values };
  const initialClean = { ...initialValues };

  // password ko ignore karein kyunki hamesha empty hota hai
  delete currentValues.password;
  delete initialClean.password;

  // Simple comparison
  const isSame = Object.keys(currentValues).every(
    (key) => currentValues[key] === initialClean[key]
  );

  if (isSame) {
    Swal.fire({
      icon: "info",
      title: "No changes made",
      text: "You haven't modified any details.",
      confirmButtonColor: "#3085d6",
      customClass: {
        popup: "custom-swal-popup",
        title: "text-xl font-semibold text-white-800",
        confirmButton:
          "px-2 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition",
        cancelButton:
          "px-2 py-2 rounded-lg text-white bg-gray-500 hover:bg-gray-600 transition",
      },
    });
    return; // Stop submit
  }

  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Required",
        text: "Please login again.",
      });
      navigate("/login");
      return;
    }

    const submitValues = { ...values, id: id };
    if (!submitValues.password || submitValues.password.trim() === "") {
      delete submitValues.password;
    }

    const response = await EditUser(token, submitValues);

    if (response?.status === true) {
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "User updated successfully!",
      });
      navigate("/superadmin/alluser");
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: response?.message || "Failed to update user",
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error?.response?.data?.message ||
        "Something went wrong while updating user",
    });
  } finally {
    setLoading(false);
  }
};


  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Content
      Page_title="Edit Employee"
      button_status={true}
      button_title="Back"
      route={"/superadmin/alluser"}
    >
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
                className:
                  "w-full md:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                disabled: loading,
              }}
              className="space-y-6"
            />
          </div>
        </div>
      </div>
    </Content>
  );
};

export default EditUsers;
