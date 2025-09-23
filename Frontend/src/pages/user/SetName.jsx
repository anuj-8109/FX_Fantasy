import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UpdateClient } from "../../services/User"; 

const SetToPlay = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("playerName");
    if (savedName) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSave = async () => {
    if (name.trim() === "") {
      toast.error("Please enter your name!");
      return;
    }

    try {
      // Send only the name to API
      const response = await UpdateClient(token, { FullName: name });

      if (response?.success) {
        localStorage.setItem("playerName", name);
        toast.success(`Welcome ${name}, you're all set to play!`);
        navigate("/dashboard");
      } else {
        toast.error(response?.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Failed to save name");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold mb-2">You're all set to play!</h2>
        <p className="text-gray-600 text-sm mb-6 max-w-xs">
          Start your new innings with Dream Trading App. Tell us your name.
        </p>

        <input
          type="text"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-80 px-4 py-3 mb-6 rounded-full bg-gray-200 text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          onClick={handleSave}
          className="w-40 py-3 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition"
        >
          Save Name
        </button>
      </div>
    </div>
  );
};

export default SetToPlay;
