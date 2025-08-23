import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

import Login from "../auth/Login";
import Register from "../auth/Register";

const AuthRoute = () => {
  return (
    <>
    <Route  element={<AuthLayout/>}>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
    </>
  );
};

export default AuthRoute;
