// import React from "react"
// import { Navigate, Outlet } from "react-router-dom"
// import { useAuth } from "@/contexts/AuthContext.jsx"

// const ProtectedRoute = () => {
// 	const { isAuthenticated } = useAuth()

// 	if (!isAuthenticated) {
// 		return <Navigate to="/login" replace />
// 	}
// 	return <Outlet />
// }

// export default ProtectedRoute


import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Check immediately on mount
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      navigate("/superadminlogin");
    }

    // Listen if token removed in another tab or same app
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        navigate("/superadminlogin");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  if (!isAuthenticated) {
    return <Navigate to="/superadminlogin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
