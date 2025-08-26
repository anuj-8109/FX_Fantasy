import React from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import AuthRoute from "./routes/AuthRoute";
import { Toaster } from "react-hot-toast";
import { ThemeProvider, useTheme } from "./components/context/ThemeContext.jsx";

const ThemeToggleButton = () => {
  const { toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-5 right-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition"
    >
      Toggle Theme
    </button>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ThemeToggleButton /> 
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
