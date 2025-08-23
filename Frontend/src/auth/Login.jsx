import React from "react";
import * as Yup from "yup";
import ReusableForm from "../extracomponents/ResuableForm";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate=useNavigate();

  const initialValues = {
    UserName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    UserName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const fields = [
    {
      name: "UserName",
      label: "UserName*",
      type: "text",
    },
    {
      name: "password",
      label: "Password*",
      type: "password",
    },
  ];

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("UserName", values.UserName);
    formData.append("password", values.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
        />
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
       <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
