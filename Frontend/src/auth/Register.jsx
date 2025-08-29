import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    PhoneNo: "",
    UserName: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    FullName: Yup.string().required("Name is required"),
    Email: Yup.string().email("Invalid email").required("Email is required"),
    PhoneNo: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone No is required"),
    UserName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    setIsLoading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append("FullName", formData.FullName);
      formDataObj.append("Email", formData.Email);
      formDataObj.append("PhoneNo", formData.PhoneNo);
      formDataObj.append("UserName", formData.UserName);
      formDataObj.append("password", formData.password);

      console.log("Registration data:", formData);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Full Wrapper to center */}
      <div className="flex w-full max-w-4xl h-[90vh] shadow-lg rounded-lg overflow-hidden bg-white">
        {/* Left Section */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-8 h-8 bg-blue-300 rounded transform rotate-45"></div>
            <div className="absolute top-20 left-32 w-6 h-6 bg-blue-400 rounded-full"></div>
            <div className="absolute top-32 left-20 w-4 h-4 bg-blue-200 rounded"></div>
            <div className="absolute top-40 left-40 w-12 h-12 bg-blue-500 rounded transform rotate-12"></div>
            <div className="absolute top-60 left-16 w-10 h-10 bg-blue-300 rounded-full"></div>
            <div className="absolute bottom-20 left-12 w-16 h-16 bg-blue-400 rounded transform rotate-45"></div>
            <div className="absolute bottom-40 left-36 w-8 h-8 bg-blue-300 rounded-full"></div>
            <div className="absolute bottom-60 left-24 w-6 h-6 bg-blue-500 rounded"></div>
            <div className="absolute top-24 right-20 w-14 h-14 bg-blue-300 rounded transform rotate-30"></div>
            <div className="absolute top-48 right-32 w-10 h-10 bg-blue-400 rounded-full"></div>
            <div className="absolute top-72 right-16 w-8 h-8 bg-blue-200 rounded"></div>
            <div className="absolute bottom-32 right-24 w-12 h-12 bg-blue-500 rounded transform -rotate-12"></div>
            <div className="absolute bottom-56 right-40 w-6 h-6 bg-blue-300 rounded-full"></div>
          </div>

          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white transform"
                style={{
                  width: `${Math.random() * 30 + 10}px`,
                  height: `${Math.random() * 30 + 10}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 360}deg) scale(${
                    Math.random() * 0.5 + 0.5
                  })`,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
            <div className="w-12 h-12 bg-white rounded-full mb-8 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Join with us</h1>
            <p className="text-lg leading-relaxed opacity-90">
              Create your account and start your <br />
              FX Fantasy journey today. Trade <br />
              smarter, grow faster, and join <br />
              thousands of successful traders <br />
              in our community.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            

            <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign up</h2>

            {/* Social Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </button>

              <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-700 font-medium">Continue with Twitter</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Register Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="FullName"
                    placeholder="Full Name"
                    value={formData.FullName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      errors.FullName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.FullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.FullName}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      errors.Email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.Email && (
                    <p className="mt-1 text-sm text-red-600">{errors.Email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="PhoneNo"
                    placeholder="Phone Number"
                    value={formData.PhoneNo}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      errors.PhoneNo ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.PhoneNo && (
                    <p className="mt-1 text-sm text-red-600">{errors.PhoneNo}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    name="UserName"
                    placeholder="Username"
                    value={formData.UserName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                      errors.UserName ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.UserName && (
                    <p className="mt-1 text-sm text-red-600">{errors.UserName}</p>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-sm text-gray-500">Already have an account? </span>
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
