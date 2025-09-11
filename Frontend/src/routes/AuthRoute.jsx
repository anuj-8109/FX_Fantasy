
import React from "react";
import { Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../auth/Login";
import Register from "../auth/Register";
import UserLogin from "../auth/Userlogin";
import SetToPlay from "../pages/user/SetName";
import ForgotPasswordPage from "../auth/ForgotPassword";

const AuthRoute = () => {
  return (
    <>
      <Route element={<AuthLayout />}>
        <Route path="/superadminlogin" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<UserLogin/>}/>
        <Route path="/setname" element={<SetToPlay/>}/>
        <Route path="/forgetpassword" element={<ForgotPasswordPage/>}/>
      </Route>
      
    </>
  );
};

export default AuthRoute;


// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import AuthLayout from "../layouts/AuthLayout";

// import Login from "../auth/Login";
// import Register from "../auth/Register";

// const AuthRoute = () => {
//   return (
//     <>
//     <Route  element={<AuthLayout/>}>
//       <Route path="/" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//     </Route>
//     </>
//   );
// };

// export default AuthRoute;
