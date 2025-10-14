import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import ReusableForm from "../../../extracomponents/ResuableForm";
import Content from "../../../components/superadmin/Content";
import { AddUser, EditUser, GetUserDetails } from "../../../services/SuperAdmin";

export default function User() {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || null;

  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    FullName: "",
    Email: "",
    PhoneNo: "",
    UserName: "",
    password: "",
    confirmPassword: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const token = localStorage.getItem("token");
  const add_by = localStorage.getItem("add_by");


  const validationSchema = Yup.object({
    FullName: Yup.string()
      .required("Full Name is required")
      .min(3, "Full Name must be at least 3 characters")
      .matches(/^[A-Za-z\s]+$/, "Full Name must contain only alphabets and spaces"),
    Email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    PhoneNo: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .length(10, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    UserName: Yup.string()
      .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .min(3, "Username must be at least 3 characters long")
      .max(20, "Username cannot exceed 20 characters")
      .required("Username is required"),
    ...(userId
      ? {} // edit mode: no password required
      : {
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .matches(/[A-Z]/, "Password must have at least one uppercase letter")
          .matches(/[a-z]/, "Password must have at least one lowercase letter")
          .matches(/\d/, "Password must have at least one number")
          .matches(/[@$!%*?&#]/, "Password must have at least one special character")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required"),
      }),
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const res = await GetUserDetails(token, userId);
        if (res?.data) {
          const user = res.data;
          setInitialValues({
            FullName: user.FullName || "",
            Email: user.Email || "",
            PhoneNo: user.PhoneNo || "",
            UserName: user.UserName || "",
            password: "",
            confirmPassword: "",
          });
          setOriginalData({
            FullName: user.FullName,
            Email: user.Email,
            PhoneNo: user.PhoneNo,
            UserName: user.UserName,
          });
        } else toast.error("Failed to load user details");
      } catch (err) {
        toast.error("Error fetching user details");
        navigate("/superadmin/alluser");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // ✅ Form fields
  const fields = [
    {
      name: "FullName",
      label: "Full Name",
      type: "text",
      className: "w-full",
      required: true,
      fieldProps: {
        onKeyPress: (e) => {
          if (!/^[A-Za-z\s]$/.test(e.key)) e.preventDefault();
        },
      },
    },
    {
      name: "UserName",
      label: "Username",
      type: "text",
      className: "w-full",
      required: true,
      disabled: !!userId,
      fieldProps: {
        onKeyPress: (e) => {
          if (!/^[a-zA-Z0-9_]$/.test(e.key)) e.preventDefault();
        },
      },
    },
    {
      name: "Email", label: "Email", type: "email", className: "w-full",
      required: true,

    },
    {
      name: "PhoneNo",
      label: "Phone No",
      type: "text",
      required: true,
      className: "w-full",
      fieldProps: {
        onKeyPress: (e) => {
          if (!/[0-9]/.test(e.key)) e.preventDefault();
        },
        maxLength: 10,
      },
    },
    ...(!userId
      ? [
        {
          name: "password",
          label: "Password",
          type: "password",
          className: "w-full",
          required: true,

        },
        {
          name: "confirmPassword",
          label: "Confirm Password",
          type: "password",
          className: "w-full",
          required: true,


        },
      ]
      : []),
  ];

  // ✅ Check if user edited something
  const isFormChanged = (values) => {
    if (!originalData) return true;
    return (
      values.FullName !== originalData.FullName ||
      values.Email !== originalData.Email ||
      values.PhoneNo !== originalData.PhoneNo
    );
  };

  // ✅ Submit handler
  const handleSubmit = async (values) => {
    if (userId && !isFormChanged(values)) {
      Swal.fire("No changes made", "You haven't modified any details.", "info");
      return;
    }

    const confirm = await Swal.fire({
      title: userId ? "Update User?" : "Add User?",
      text: userId ? "Do you want to update this user?" : "Do you want to add this user?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        htmlContainer: "custom-swal-text",
        confirmButton: "custom-swal-confirm",
        cancelButton: "custom-swal-cancel",

      },
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const { confirmPassword, ...data } = values;
      data.add_by = add_by;

      let res;
      if (userId) {
        data.id = userId;
        if (!data.password) delete data.password;
        res = await EditUser(token, data);
      } else {
        res = await AddUser(data, token);
      }

      if (res?.status) {
        toast.success(userId ? "User updated successfully!" : "User added successfully!");
        navigate("/superadmin/alluser");
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error!", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content
      Page_title={userId ? "Edit User" : "Add User"}
      button_status={true}
      button_title="Back"
      route={"/superadmin/alluser"}
    >
      <div className="Form-style">
        <ReusableForm
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          fields={fields}
          submitButton={{
            label: loading
              ? userId
                ? "Updating..."
                : "Adding..."
              : userId
                ? "Update User"
                : "Add User",
            className:
              "col-span-6 mt-4 py-2 rounded-lg font-semibold shadow-lg transition disabled:opacity-50 w-1/3 mx-auto block",
            disabled: loading,
          }}
        />
      </div>
    </Content>
  );
}
