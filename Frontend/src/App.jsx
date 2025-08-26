import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import AuthRoute from "./routes/AuthRoute";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, useTheme } from "./components/context/ThemeContext.jsx";



function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {AuthRoute()}
          {SuperAdminRoute()}
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </ThemeProvider>
  );
}

export default App;
