import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import SuperAdminRoute from "./routes/SuperAdminRoute";
import AuthRoute from "./routes/AuthRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {AuthRoute()}
          {/* {SuperAdminRoute()} */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
