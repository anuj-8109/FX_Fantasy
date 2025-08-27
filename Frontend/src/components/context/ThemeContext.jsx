import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("theme-trading-light");

  useEffect(() => {
    document.documentElement.className = theme; 
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "theme-trading-pro" ? "theme-trading-pro" : "theme-trading-pro");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
