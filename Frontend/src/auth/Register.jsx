import React, { useState } from "react";
import * as Yup from "yup";
import ReusableForm from "../extracomponents/ResuableForm";

const Register = () => {
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

//   const onSubmit = (values) => {
//     const formData = new FormData();

//     formData.append("FullName", values.FullName);
//     formData.append("Email", values.Email);
//     formData.append("PhoneNo", values.PhoneNo);
//     formData.append("UserName", values.UserName);
//     formData.append("password", values.password);
//   };


  const onSubmit = (values) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    existingUsers.push(values);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Registration successful! Data saved in localStorage ✅");
    console.log("Saved Data:", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
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

export default Register;
