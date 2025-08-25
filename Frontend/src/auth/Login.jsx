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
      label: "Username*",
      type: "text",
      fullWidth: true,
    },
    {
      name: "password",
      label: "Password*",
      type: "password",
      fullWidth: true,
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

        localStorage.setItem("token", response?.data?.tokenjwt);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("add_by", response?.data?.id);
        localStorage.setItem("userId", response?.data?.id);

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-500/30 to-teal-500/30 rounded-full blur-3xl animate-pulse delay-3000"></div>

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-2xl"></div>

        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white/5 rounded-lg rotate-45"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-white/5 rounded-lg rotate-12"></div>
      </div>

      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-2">
              <span className="text-white font-bold text-xl">FX</span>{" "}
              {/* text-xl = chhota font */}
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              FX Fantasy
            </h1>{" "}
            {/* text-2xl = chhota heading */}
            <p className="text-gray-600 text-sm">
              Trade Smarter. Grow Faster.
            </p>{" "}
            {/* text-sm = chhota text */}
          </div>

          {/* Form */}
          <ReusableForm
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            fields={fields}
            singleColumn={true}
          />

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs mb-2">Don't have an account?</p>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-200 border border-gray-300"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
