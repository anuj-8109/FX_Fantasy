import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, appTypes } from '@/data/themes';

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Load from localStorage or use defaults
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('adminTheme');
    if (savedTheme) {
      const themeId = JSON.parse(savedTheme);
      return themes.find(t => t.id === themeId) || themes[0];
    }
    return themes[0];
  });

  const [currentAppType, setCurrentAppType] = useState(() => {
    const savedAppType = localStorage.getItem('adminAppType');
    if (savedAppType) {
      const appTypeId = JSON.parse(savedAppType);
      return appTypes.find(a => a.id === appTypeId) || appTypes[0];
    }
    return appTypes[0];
  });

  // Mock admin user with full permissions
  const adminUser = {
    id: '1',
    name: 'Game Master',
    email: 'admin@dreamtrading.com',
    role: 'super-admin',
    permissions: {
      canChangeTheme: true,
      canManageUsers: true,
      canManageContent: true,
      canViewAnalytics: true,
      canManageSettings: true
    }
  };

  const setTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem('adminTheme', JSON.stringify(theme.id));
    document.documentElement.className = theme.className;
  };

  const setAppType = (appType) => {
    setCurrentAppType(appType);
    localStorage.setItem('adminAppType', JSON.stringify(appType.id));
    // Find matching theme for app type or use current theme
    const matchingTheme = themes.find(t => t.appType.id === appType.id) || currentTheme;
    if (matchingTheme.id !== currentTheme.id) {
      setTheme(matchingTheme);
    }
  };

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.className = currentTheme.className;
  }, []);

  return (
    <ThemeContext.Provider 
      value={{
        currentTheme,
        currentAppType,
        adminUser,
        setTheme,
        setAppType,
        canChangeTheme: adminUser.permissions.canChangeTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
