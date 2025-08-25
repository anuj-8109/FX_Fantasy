import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReusableForm from "../../../extracomponents/ResuableForm";
import { AddUser } from "../../../services/SuperAdmin"

const User = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    FullName: "",
    Email: "",
    PhoneNo: "",
    UserName: "",
    password: "",
  };

  const validationSchema = Yup.object({
    FullName: Yup.string().required("Name is required"),
    Email: Yup.string().email("Invalid email").required("Email is required"),
    PhoneNo: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone No is required"),
    UserName: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const fields = [
    { name: "FullName", label: "Full Name*", type: "text" },
    { name: "Email", label: "Email*", type: "email" },
    { name: "PhoneNo", label: "Phone No*", type: "text" },
    { name: "UserName", label: "Username*", type: "text" },
    { name: "password", label: "Password*", type: "password" },
  ];

  const onSubmit = async (values) => {
    setLoading(true);

    const data = {
      FullName: values.FullName,
      Email: values.Email,
      PhoneNo: values.PhoneNo,
      UserName: values.UserName,
      password: values.password,
      add_by : add_by
    };

   const token = localStorage.getItem("token");
   const add_by = localStorage.getItem("add_by");


    try {
      const res = await AddUser(data,token);
      console.log("API Response:", res);
      Swal.fire("Success!", "User added successfully", "success");
      // navigate("/users");
    } catch (error) {
      console.error("API Error:", error);
      Swal.fire("Error!", "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-center text-2xl font-bold mb-4">Add User</h2>

        <ReusableForm
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          fields={fields}
          submitButton={{
            label: loading ? "Adding..." : "Add User",
            className:
              "w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50",
            disabled: loading,
          }}
        />
      </div>
    </div>
  );
};

export default User;
