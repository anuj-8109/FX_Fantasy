import React, { useState } from "react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { LoginApi } from "../services/Auth";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const Login = () => {
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    setIsLoading(true);

    const payload = {
      UserName: formData.UserName,
      password: formData.password,
    };

    try {
      const response = await LoginApi(payload);

      if (response?.status === true) {
        const user = response?.data;
        const roleId = user?.Role;

        localStorage.setItem("token", response?.data?.tokenjwt);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("roleId", roleId);
        localStorage.setItem("add_by", response?.data?.id);
        localStorage.setItem("userId", response?.data?.id);


        toast.success(response?.message || "You have been logged in", {
          duration: 2000,
          position: "top-right",
        });;

        setTimeout(() => {
          if (roleId === 1) {
            navigate("/superadmin/superadmindashboard");
          }
          else if (roleId === 2) {
            navigate("/Staff/Staffdashboard");
          }
          else if (roleId === 3) {
            navigate("/User/Userdashboard");
          }
          else {
            navigate("/");
          }
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response?.message || "Invalid credentials",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text:
          error.response?.data?.msg || error.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>

      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-4">


        <div className="flex flex-col lg:flex-row w-full max-w-4xl h-[90vh]  shadow-lg rounded-lg overflow-hidden">


          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-red-700">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-8 h-8 bg-red-300 rounded transform rotate-45"></div>
              <div className="absolute top-20 left-32 w-6 h-6 bg-red-400 rounded-full"></div>
              <div className="absolute top-32 left-20 w-4 h-4 bg-red-200 rounded"></div>
              <div className="absolute top-40 left-40 w-12 h-12 bg-red-500 rounded transform rotate-12"></div>
              <div className="absolute top-60 left-16 w-10 h-10 bg-red-300 rounded-full"></div>
              <div className="absolute bottom-20 left-12 w-16 h-16 bg-red-400 rounded transform rotate-45"></div>
              <div className="absolute bottom-40 left-36 w-8 h-8 bg-red-300 rounded-full"></div>
              <div className="absolute bottom-60 left-24 w-6 h-6 bg-red-500 rounded"></div>
              <div className="absolute top-24 right-20 w-14 h-14 bg-red-300 rounded transform rotate-30"></div>
              <div className="absolute top-48 right-32 w-10 h-10 bg-red-400 rounded-full"></div>
              <div className="absolute top-72 right-16 w-8 h-8 bg-red-200 rounded"></div>
              <div className="absolute bottom-32 right-24 w-12 h-12 bg-red-500 rounded transform -rotate-12"></div>
              <div className="absolute bottom-56 right-40 w-6 h-6 bg-red-300 rounded-full"></div>
            </div>



            <div className="absolute inset-0 opacity-10">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white transform"
                  style={{
                    width: `${Math.random() * 30 + 10}px`,
                    height: `${Math.random() * 30 + 10}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`,
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-start p-8 text-white">
              <div className="w-12 h-12 bg-white rounded-full mb-8 flex items-center justify-center">
                <div className="w-6 h-6 bg-red-600 rounded-full"></div>
              </div>

              <h1 className="text-2xl font-bold mb-6">Design with us</h1>

              <p className="text-base leading-relaxed opacity-90">
                Lorem ipsum dolor sit amet,<br />
                consectetur adipiscing elit. Morbi<br />
                lobortis maximus nunc, ac rhoncus odio<br />
                congue eu. Sed ut semper orci, eu<br />
                porttitor lacus.
              </p>
            </div>
          </div>


          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
            <div className="w-full max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Sign in</h2>


              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>

                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 mr-3" fill="#1DA1F2" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Twitter</span>
                </button>
              </div>


              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>


              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="UserName"
                    placeholder="User name or email address"
                    value={formData.UserName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${errors.UserName ? 'border-red-500' : 'border-gray-300'
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}

                  <div className="text-right mt-2">
                    <button
                      type="button"
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );

};

export default Login;