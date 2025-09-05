import React, { useState, useEffect, useRef } from "react";
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
  const [checked, setChecked] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  const validationSchema = Yup.object({
    UserName: Yup.string().required("Phone number is required"),
    ...(otpSent && {
      otp: Yup.string()
        .required("OTP is required")
        .matches(/^\d{6}$/, "OTP must be 6 digits"),
    }),
  });

  useEffect(() => {
    if (otpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [otpSent, timer]);

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

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const otpArray = formData.otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("");
    setFormData((prev) => ({ ...prev, otp: newOtp }));

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
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
    if (!checked) {
      Swal.fire("Error", "You must certify age above 18 years", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await UserLoginApi({ PhoneNo: formData.UserName  });
      if (response.status === true) {


        localStorage.setItem("token", response?.data?.tokenjwt);
        toast.success(response.message || "OTP sent successfully");
        setOtpSent(true);
        setTimer(30);
        setFormData((prev) => ({ ...prev, otp: "" }));
      } else {
        Swal.fire("Error", response.message);
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
       localStorage.setItem("token", response?.data?.tokenjwt);
      const response = await LoginWithOtpApi({
        PhoneNo: formData.UserName,
        otp: formData.otp,
      });

      console.log("OTP Verify Response:", response);

      if (response.status === true && response.data) {
        const user = response.data;

      
        const token = user.jwtToken;

        if (!token) {
          Swal.fire("Error", "Token missing in response", "error");
          setIsLoading(false);
          return;
        }

     
        const roleId = 3;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("add_by", user.id);
        localStorage.setItem("userId", user.id);

        toast.success(response.message || "Login successful", {
          duration: 2000,
          position: "top-right",
        });

        setTimeout(() => {
          navigate("/userDashboard"); 
        }, 1000);
      } else {
        Swal.fire("Error", response?.message?.message || "Invalid OTP");
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-6">
          {otpSent ? "Almost There!" : "Login / Register"}
        </h2>


        {!otpSent && (
          <>
            <div className="flex items-center border rounded-full px-4 py-3 mb-4">
              <span className="flex items-center mr-2">
                <img
                  src="https://flagcdn.com/w20/in.png"
                  alt="flag"
                  className="w-5 h-5 mr-1"
                />
                +91
              </span>
              <input
                type="text"
                name="UserName"
                placeholder="Enter Your Number"
                value={formData.UserName}
                onChange={handleInputChange}
                className="bg-transparent flex-1 outline-none"
              />
            </div>
            {errors.UserName && (
              <p className="text-sm text-red-600 mb-2">{errors.UserName}</p>
            )}
          </>
        )}


        {otpSent && (
          <div className="mb-4">
            <p className="text-gray-600 mb-4">
              Please enter OTP sent on <b>{formData.UserName}</b>
            </p>
            <div className="flex justify-center gap-3 mb-4">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={formData.otp[index] || ""}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`w-12 h-12 text-center text-xl font-bold border rounded ${formData.otp[index]
                      ? "bg-orange-500 text-white"
                      : "bg-white-100"
                    }`}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
            )}

            {timer > 0 ? (
              <p className="text-sm text-gray-600">
                Didn’t receive OTP? Resend in{" "}
                <span className="font-semibold">{timer} Seconds</span>
              </p>
            ) : (
              <button
                onClick={handleSendOtp}
                className="text-sm text-blue-600 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
        )}

        {/* Checkbox */}
        {!otpSent && (
          <div className="flex items-center justify-start mb-4">
            <input
              type="checkbox"
              id="certify"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="mr-2"
            />
            <label htmlFor="certify" className="text-sm text-gray-700">
              I certify that I am above 18 years
            </label>
          </div>
        )}

        {/* Button */}
        <button
          onClick={otpSent ? handleVerifyOtp : handleSendOtp}
          disabled={isLoading}
          className="w-full bg-orange-500 text-white py-3 rounded-full font-medium hover:bg-orange-600 transition disabled:opacity-50"
        >
          {isLoading
            ? otpSent
              ? "Verifying..."
              : "Sending OTP..."
            : "Continue"}
        </button>


        {!otpSent && (
          <>
            <p className="text-xs text-gray-500 mt-4">
              By continuing, I agree to Dream Trading T&C.
            </p>
            <div className="text-sm mt-2">
              <a href="#" className="text-blue-600 hover:underline">
                Have an Invite Code?
              </a>{" "}
              |{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Other login options
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserLogin;
