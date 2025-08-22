import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import Login from "./auth/Login";
import AuthRoute from "./routes/AuthRoute";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <>
    <ThemeProvider>
        <Router>
        <Routes>
        {AuthRoute()}
        {SuperAdminRoute()}
        </Routes>
      </Router>
    </ThemeProvider>
    </>
  );
}

export default App;
