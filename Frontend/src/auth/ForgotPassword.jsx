import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { ForgotPassword } from "../services/SuperAdmin";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!(await validateForm())) return;

        setIsLoading(true);

        try {
            console.log("Sending email:", formData.email);
            const forgotResponse = await ForgotPassword("", { Email: formData.email }); // Note capital 'E'
            if (forgotResponse?.status === true) {
                toast.success(forgotResponse?.message || "Check your email for reset link");
                setTimeout(() => navigate("/superadminlogin"), 2000);
            } else {
                Swal.fire("Error", forgotResponse?.message || "Something went wrong", "error");
            }
        } catch (error) {
            Swal.fire("Error", error?.message || "Something went wrong", "error");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-center">Forgot Password</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Processing..." : "Send Reset Link"}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <span className="text-sm text-gray-500">Remembered your password? </span>
                    <button
                        onClick={() => navigate("/superadminlogin")}
                        className="text-blue-600 hover:text-blue-700 font-medium underline"
                    >
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
