import React, { useState } from "react";
import * as Yup from "yup";
import ReusableForm from "../extracomponents/ResuableForm";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddUser = () => {
  const navigate = useNavigate();

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
    {
      name: "FullName",
      label: "FullName*",
      type: "text",
    },
    {
      name: "Email",
      label: "Email*",
      type: "email",
    },
    {
      name: "PhoneNo",
      label: "Phone No*",
      type: "text",
    },
    {
      name: "UserName",
      label: "UserName*",
      type: "text",
    },
    {
      name: "password",
      label: "Password*",
      type: "password",
    },
  ];

  const onSubmit = (values) => {
    const formData = new FormData();

    formData.append("FullName", values.FullName);
    formData.append("Email", values.Email);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("UserName", values.UserName);
    formData.append("password", values.password);




  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg relative z-10 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-10 border border-blue-100">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text drop-shadow-md">
            FX Fantasy
          </h1>
          <p className="text-gray-600 text-sm mt-2 tracking-wide">Add User</p>
        </div>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
        />
      </div>
    </div>
  );
};

export default AddUser;
