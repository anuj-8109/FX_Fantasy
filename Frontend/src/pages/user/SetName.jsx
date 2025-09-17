import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const SetToPlay = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [name, setName] = useState("");

    const handleSave = () => {
        if (name.trim() === "") {
            toast.error("Please enter your name!");
            return;
        }
        toast.success(`Welcome ${name}, you're all set to play!`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="flex flex-col items-center text-center">
                {/*      
        <img
          src="https://i.ibb.co/6PpC7Hw/profile.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full mb-6"
        /> */}

                {/* Heading */}
                <h2 className="text-2xl font-semibold mb-2">You're all set to play!</h2>
                <p className="text-gray-600 text-sm mb-6 max-w-xs">
                    Start your new innings with Dream Trading App. Tell us your name.
                </p>

                {/* Input */}
                <input
                    type="text"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-80 px-4 py-3 mb-6 rounded-full bg-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                {/* Button */}
                <button
                    onClick={() => {
                        handleSave();
                        if (token) {
                            navigate("/dashboard");
                        }
                    }}
                    className="w-40 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition"
                >
                    Save Name
                </button>
            </div>
        </div>
    );
};

export default SetToPlay;
