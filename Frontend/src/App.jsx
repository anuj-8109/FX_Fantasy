import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import AuthRoute from "./routes/AuthRoute";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Router>
        <Routes>
          {AuthRoute()}
          {SuperAdminRoute()}
        </Routes>
      </Router>
       <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
