import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BackButton = ({
  fallback = "/",
  showIcon = true,   // condition to show/hide icon
  showText = true,   // condition to show/hide text
  label = "Back",    // customizable text
  className = "",    // extra classes if needed
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
    flex items-center gap-2
    bg-orange-500
    text-white
    hover:bg-black-600
    hover:text-white-800
    font-medium
    px-4 py-2
    rounded-lg
    shadow-md
    transition-all
    duration-200
    focus:outline-none
    focus:ring-2
    focus:ring-blue-300
    ${className}
  `}
    >



      {showIcon && <ChevronLeft size={20} />}
      {showText && <span>{label}</span>}
    </button>
  );
};

export default BackButton;
