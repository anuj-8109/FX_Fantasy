import React from "react";
import * as Yup from "yup";
import ReusableForm from "../extracomponents/ResuableForm";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../services/Auth";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    UserName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    UserName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const fields = [
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

  const onSubmit = async (values) => {
    const payload = {
      UserName: values.UserName,
      password: values.password,
    };

    try {
      const response = await LoginApi(payload);

      if (response?.status === true) {
        const user = response?.data;
        const roleId = user?.Role;

        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("roleId", roleId);

        Swal.fire({
          title: "Login Success",
          text: response?.message || "You have been logged in",
          icon: "success",
          timerProgressBar: true,
        });

        setTimeout(() => {
          if (roleId === 1) {
            navigate("/superadmin/superadmindashboard");
          } else {
            navigate("/");
          }
        }, 1500);
      } else {
        Swal.fire({
          title: "Error",
          text: response.msg || "Invalid credentials",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.msg || error.message || "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white relative overflow-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl"></div>

      {/* Glassmorphism Container */}
      <div className="w-full max-w-md relative z-10 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl p-10 border border-blue-100">
        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text drop-shadow-md">
            FX Fantasy
          </h1>
          <p className="text-gray-600 text-sm mt-2 tracking-wide">
            Trade Smarter. Grow Faster.
          </p>
        </div>

        {/* Form */}
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
        />

        {/* Footer Link */}
        <p className="text-sm text-center mt-8 text-gray-600">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:text-blue-500 font-semibold transition"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
