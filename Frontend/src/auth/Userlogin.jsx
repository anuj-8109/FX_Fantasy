import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UserLoginApi, LoginWithOtpApi } from "../services/Auth"; 
import Swal from "sweetalert2";
import toast from "react-hot-toast";


const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserName: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const validationSchema = Yup.object({
    UserName: Yup.string().required("Username or Phone number is required"),
    ...(otpSent && {
      otp: Yup.string()
        .required("OTP is required")
        .matches(/^\d{6}$/, "OTP must be 6 digits"),
    }),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };


  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    setIsLoading(true);
    try {
      const response = await UserLoginApi({ PhoneNo: formData.UserName });
      if (response.status === true) {
        toast.success(response.message || "OTP sent successfully");
        setOtpSent(true);
      } else {
        Swal.fire("Error", response.message || "Failed to send OTP", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || error.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    setIsLoading(true);
    try {
      const response = await LoginWithOtpApi({
        PhoneNo: formData.UserName,
        otp: formData.otp,
      });

      if (response.status === true) {
        const user = response.data;
        const roleId = user.Role;

        localStorage.setItem("token", user.tokenjwt);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("add_by", user.id);
        localStorage.setItem("userId", user.id);

        toast.success(response.message || "Login successful", {
          duration: 2000,
          position: "top-right",
        });

        setTimeout(() => {
          navigate("/user/userDashboard");
        }, 1000);
      } else {
        Swal.fire("Error", response.message || "Invalid OTP", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || error.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl h-[90vh] shadow-lg rounded-lg overflow-hidden">
      
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-red-700">
          <div className="relative z-10 flex flex-col justify-center items-start p-8 text-white">
            <h1 className="text-2xl font-bold mb-6">OTP Login</h1>
            <p className="text-base leading-relaxed opacity-90">
              Enter your phone/email to receive an OTP and login securely.
            </p>
          </div>
        </div>

 
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Sign in with OTP
            </h2>

            <form
              onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
              className="space-y-4"
            >
       
              <div>
                <input
                  type="text"
                  name="UserName"
                  placeholder="Enter phone/email"
                  value={formData.UserName}
                  onChange={handleInputChange}
                  disabled={otpSent}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none 
                  }`}
                />
                {errors.UserName && (
                  <p className="mt-1 text-sm text-red-600">{errors.UserName}</p>
                )}
              </div>

      
              {otpSent && (
                <div>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none 
                    }`}
                  />
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 transition-colors font-medium disabled:opacity-50"
              >
                {isLoading
                  ? otpSent
                    ? "Verifying..."
                    : "Sending OTP..."
                  : otpSent
                  ? "Verify OTP"
                  : "Send OTP"}
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
              </span>
              <button
                onClick={() => navigate("/register")}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
