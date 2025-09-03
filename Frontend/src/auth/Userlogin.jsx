import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UserLoginApi } from "../services/Auth";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const UserLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        UserName: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const validationSchema = Yup.object({
        UserName: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
    });


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };


    const validateForm = async () => {
        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            return true;
        } catch (err) {
            const newErrors = {};
            err.inner.forEach((e) => {
                newErrors[e.path] = e.message;
            });
            setErrors(newErrors);
            return false;
        }
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        if (!(await validateForm())) return;

        setIsLoading(true);

        try {
            const response = await UserLoginApi({
                UserName: formData.UserName,
                password: formData.password,
            });

            if (response.status === true) {
                const user = response.data;
                const roleId = user.Role;

                localStorage.setItem("token", user.tokenjwt);
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("roleId", roleId);
                localStorage.setItem("add_by", user.id);
                localStorage.setItem("userId", user.id);

                toast.success(response.message || "Login successful", {
                    duration: 2000,
                    position: "top-right",
                });

                setTimeout(() => {
                    if (clientRoles.includes(roleId)) {
                        navigate("/client/Clientdashboard");
                    } else {
                        navigate("/");
                    }
                }, 1000);
            } else {
                Swal.fire("Error", response.message || "Invalid credentials", "error");
            }
        } catch (error) {
            Swal.fire(
                "Error",
                error.response?.data?.msg || error.message || "Something went wrong",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-4">
            <div className="flex flex-col lg:flex-row w-full max-w-4xl h-[90vh] shadow-lg rounded-lg overflow-hidden">
                {/* Left Side Design */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-red-700">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-10 w-8 h-8 bg-red-300 rounded transform rotate-45"></div>
                        <div className="absolute top-20 left-32 w-6 h-6 bg-red-400 rounded-full"></div>
                    </div>
                    <div className="relative z-10 flex flex-col justify-center items-start p-8 text-white">
                        <div className="w-12 h-12 bg-white rounded-full mb-8 flex items-center justify-center">
                            <div className="w-6 h-6 bg-red-600 rounded-full"></div>
                        </div>
                        <h1 className="text-2xl font-bold mb-6">Design with us</h1>
                        <p className="text-base leading-relaxed opacity-90">
                            Welcome to our platform. Please login to continue.
                        </p>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sign in</h2>

                        <form onSubmit={onSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="UserName"
                                    placeholder="User name or email address"
                                    value={formData.UserName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.UserName ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.UserName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.UserName}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${errors.password ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 transition-colors font-medium disabled:opacity-50"
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </button>
                        </form>

                        <div className="text-center mt-6">
                            <span className="text-sm text-gray-500">Don't have an account? </span>
                            <button
                                onClick={() => navigate("/register")}
                                className="text-blue-600 hover:text-blue-700 font-medium underline"
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
