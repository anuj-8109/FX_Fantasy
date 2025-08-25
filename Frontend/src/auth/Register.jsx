import React, { useState } from "react";
import * as Yup from "yup";
import ReusableForm from "../extracomponents/ResuableForm";
import { useNavigate } from "react-router-dom";

const Register = () => {
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
      label: "Full Name*",
      type: "text",
      className: "w-full",
    },
    {
      name: "Email",
      label: "Email*",
      type: "email",
      className: "w-full",
    },
    {
      name: "PhoneNo",
      label: "Phone No*",
      type: "text",
      className: "w-full",
    },
    {
      name: "UserName",
      label: "Username*",
      type: "text",
      className: "w-full",
    },
    {
      name: "password",
      label: "Password*",
      type: "password",
      className: "w-full",
      colClass: "col-span-2"
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-500/30 to-teal-500/30 rounded-full blur-3xl animate-pulse delay-3000"></div>

      
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-2xl"></div>

        {/* Small decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-lg rotate-45"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/5 rounded-lg rotate-12"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Register Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">  {/* width zyada karne ke liye max-w-lg */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6"> {/* height kam karne ke liye p-6 */}
          {/* Header */}
          <div className="text-center mb-6"> 
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-3">
              <span className="text-white font-bold text-xl">FX</span> {/* text-xl = chhota font */}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">FX Fantasy</h1> {/* text-2xl = chhota heading */}
            <p className="text-gray-600 text-sm">Create your account and start your journey</p> {/* text-sm = chhota text */}
          </div>

          {/* Form */}
          <ReusableForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            fields={fields}
          />

          {/* Login Link */}
          <div className="mt-6 text-center"> {/* mt-6 = kam gap */}
            <p className="text-gray-600 text-xs mb-2">Already have an account?</p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold text-sm py-2 px-3 rounded-lg transition-all duration-200 border border-gray-300"
            >
              Login Here
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Register;