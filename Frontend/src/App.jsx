import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import AuthRoute from "./routes/AuthRoute";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, useTheme } from "./components/context/ThemeContext.jsx";
import UserRoutes from "./routes/UserRoutes.jsx";



function App() {
  return (
    <ThemeProvider>
      <div className="wrapper">
      <Router>
        <Routes>
          {AuthRoute()}
          {SuperAdminRoute()}
          {UserRoutes()}
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />

</div>
    </ThemeProvider>
  );
}

export default App;
