import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetUserDetails } from "../../../services/SuperAdmin";

const MyProfile = () => {
  const [userdetails, setUserDetails] = useState(null);
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const response = await GetUserDetails(token, id);
      setUserDetails(response?.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-8">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
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

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-3">
              <span className="text-white font-bold text-xl">FX</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Profile Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your personal details here
            </p>
          </div>

          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{userdetails?.FullName || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">UserName:</span>
              <span>{userdetails?.UserName || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{userdetails?.Email || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">PhoneNo:</span>
              <span>{userdetails?.PhoneNo || ""}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Active Status:</span>
              <span>
                {userdetails?.ActiveStatus === 1 ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => navigate("/superadmin/changepassword")}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:opacity-90 transition"
            >
              Reset Password
            </button>

            <button
              onClick={() =>
                navigate(`/superadmin/EditUsers/${userdetails?.id}`)
              }
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow hover:opacity-90 transition"
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
