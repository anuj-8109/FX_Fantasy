import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 


const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // jab user type kare to error hatao
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match!");
      return;
    }

    // 🔗 Call your API to reset password here
    console.log("Password reset data:", formData);
    alert("Password reset successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8">
      {/* Background Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Grid Overlay */}
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

      {/* Reset Password Card */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-3">
              <span className="text-white font-bold text-xl">FX</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm">
              Enter your old and new password to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Old Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.oldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => togglePassword("oldPassword")}
                >
                  {showPassword.oldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => togglePassword("newPassword")}
                >
                  {showPassword.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => togglePassword("confirmPassword")}
                >
                  {showPassword.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg shadow hover:opacity-90 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
