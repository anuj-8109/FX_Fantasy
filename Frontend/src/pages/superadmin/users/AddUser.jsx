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

  const validationSchema = Yup.object({
    FullName: Yup.string()
      .required("Full Name is required")
      .min(3, "Full Name must be at least 3 characters")
      .matches(
        /^[A-Za-z\s]+$/,
        "Full Name must contain only alphabets and spaces"
      ),

    Email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    PhoneNo: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .length(10, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),

    UserName: Yup.string()
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username cannot exceed 20 characters")
      .required("Username is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must have at least one uppercase letter")
      .matches(/[a-z]/, "Password must have at least one lowercase letter")
      .matches(/\d/, "Password must have at least one number")
      .matches(
        /[@$!%*?&#]/,
        "Password must have at least one special character (@$!%*?&#)"
      )
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const fields = [
    {
      name: "FullName",
      label: "Full Name*",
      type: "text",
      className: "w-full",
      autoComplete: "off",
      fieldProps: {
        onKeyPress: (e) => {
          if (!/^[A-Za-z\s]$/.test(e.key)) {
            e.preventDefault(); // block numbers/special chars
          }
        },
      },
    },
    {
      name: "UserName",
      label: "Username*",
      type: "text",
      className: "w-full",
      autoComplete: "new-username",
      fieldProps: {
        onKeyPress: (e) => {
          if (!/^[a-zA-Z0-9_]$/.test(e.key)) {
            e.preventDefault(); // block invalid chars
          }
        },
      },
    },
    {
      name: "Email",
      label: "Email*",
      type: "email",
      className: "w-full",
      autoComplete: "off",
    },
    {
      name: "PhoneNo",
      label: "Phone No*",
      type: "text",
      className: "w-full",
      autoComplete: "off",
      fieldProps: {
        onKeyPress: (e) => {
          if (!/[0-9]/.test(e.key)) {
            e.preventDefault(); // block alphabets & symbols
          }
        },
        maxLength: 10, // restrict to 10 digits
      },
    },
    {
      name: "password",
      label: "Password*",
      type: "password",
      className: "w-full",
      colClass: "col-span-2",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password*",
      type: "password",
      className: "w-full",
      autoComplete: "new-password",
    },
  ];

  const onSubmit = async (values) => {
    const { confirmPassword, ...rest } = values;
    const token = localStorage.getItem("token");
    const add_by = localStorage.getItem("add_by");
    const data = { ...rest, add_by };

    // Confirmation popup
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add user!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return; // agar user cancel kare to API call na ho
    }

    setLoading(true);
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
    <Content
      Page_title="Add User"
      button_status={true}
      button_title="Back"
      route={"/superadmin/alluser"}
    >
      <div className="Form-style">
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitButton={{
            label: loading ? "Adding..." : "Add User",
            className:
              "col-span-6 mt-4 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-50 w-1/3 mx-auto block",
            disabled: loading,
          }}
        />
      </div>
    </Content>
  );
};

export default User;
