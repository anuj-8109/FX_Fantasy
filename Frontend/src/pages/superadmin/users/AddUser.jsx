import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { AddUser } from "../../../services/SuperAdmin";

const User = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    FullName: "",
    Email: "",
    PhoneNo: "",
    UserName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    FullName: Yup.string().required("Name is required"),
    Email: Yup.string().email("Invalid email").required("Email is required"),
    PhoneNo: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone No is required"),
    UserName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const fields = [
    { name: "FullName", label: "Full Name*", type: "text", className: "w-full" },
    { name: "Email", label: "Email*", type: "email", className: "w-full" },
    { name: "PhoneNo", label: "Phone No*", type: "text", className: "w-full" },
    { name: "UserName", label: "Username*", type: "text", className: "w-full" },
    { name: "password", label: "Password*", type: "password", className: "w-full", colClass: "col-span-2" },
  ];

  const onSubmit = async (values) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const add_by = localStorage.getItem("add_by");

    const data = { ...values, add_by };

    try {
      const res = await AddUser(data, token);
      console.log("API Response:", res);
      Swal.fire("Success!", "User added successfully", "success");
      // navigate("/users");
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error!", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full max-w-2xl-lg bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">Add User</h2>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitButton={{
            label: loading ? "Adding..." : "Add User",
            className:
              "col-span-2 mt-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50",
            disabled: loading,
          }}
        />
      </div>
    </div>
  );
};

export default User;
