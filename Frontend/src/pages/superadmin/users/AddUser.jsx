import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { AddUser } from "../../../services/SuperAdmin";
import toast from "react-hot-toast";
import Content from "../../../components/superadmin/Content";

const User = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    FullName: "",
    Email: "",
    PhoneNo: "",
    UserName: "",
    password: "",
    confirmPassword: "",
  };

  // ✅ Same validation as backend
  const validationSchema = Yup.object({
    FullName: Yup.string()
      .required("Full Name is required")
      .min(3, "Full Name must be at least 3 characters"),
    Email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    PhoneNo: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    UserName: Yup.string()
      .min(3, "Username must be at least 3 characters long")
      .required("Username is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[a-z]/, "Password must have at least one lowercase letter")
      .matches(/\d/, "Password must have at least one number")
      .matches(/[@$!%*?&#]/, "Password must have at least one special character (@$!%*?&#)")
      .required("Password is required"),
       confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  });

  const fields = [
    { name: "FullName", label: "Full Name*", type: "text", className: "w-full" },
    { name: "Email", label: "Email*", type: "email", className: "w-full"  },
    { name: "PhoneNo", label: "Phone No*", type: "text", className: "w-full" },
    { name: "UserName", label: "Username*", type: "text", className: "w-full" },
    { name: "password", label: "Password*", type: "password", className: "w-full", colClass: "col-span-2" },
    { name: "confirmPassword", label: "Confirm Password*", type: "password", className: "w-full" },
  ];

  const onSubmit = async (values) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const add_by = localStorage.getItem("add_by");

      const { confirmPassword, ...rest } = values;
  const data = { ...rest, add_by };
    try {
      const res = await AddUser(data, token);

     
      if (res?.status === false && res?.message?.includes("exists")) {
        toast.error(res.message);
        return;
      }

      if (res?.status === true) {
        toast.success("User added successfully!");
        navigate("/superadmin/alluser");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error!", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content Page_title="Add User" button_status={true}  >

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitButton={{
            label: loading ? "Adding..." : "Add User",
            className:
              "col-span-2 mt-4 py-2 rounded-lg  from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50",
            disabled: loading,
          }}
        />
      
  </Content>
  );
};

export default User;
