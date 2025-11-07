import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import AuthRoute from "./routes/AuthRoute";
import UserRoutes from "./routes/UserRoutes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/context/ThemeContext.jsx";
import SocketToast from "./utils/socket.jsx";

// ✅ This wrapper ensures useNavigate works
const RouteManager = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const roleId = localStorage.getItem("roleId");

    if (!user && window.location.pathname !== "/superadminlogin") {
      navigate("/", { replace: true });
    } 
    // else if (roleId === "1") {
    //   navigate("/superadmin/dashboard", { replace: true });
    // }
  }, []);

  return (
    <Routes>
      {AuthRoute()}       {/* Public routes */}
      {SuperAdminRoute()} {/* Superadmin routes */}
      {UserRoutes()}      {/* User routes */}
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
       <SocketToast/>
      <div className="wrapper">
        <Router>
          <RouteManager />
          <Toaster position="top-right" reverseOrder={false} />
         
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
