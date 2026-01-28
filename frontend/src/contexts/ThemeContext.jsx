import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

// Define available themes with their color configurations
export const THEMES = {
  light: {
    name: "Light",
    bg: "bg-white",
    bgSecondary: "bg-gray-50",
    text: "text-gray-900",
    textSecondary: "text-gray-600",
    border: "border-gray-200",
    hover: "hover:bg-gray-100",
    primary: "bg-blue-500",
    primaryHover: "hover:bg-blue-600",
    sidebar: "bg-white",
    header: "bg-white",
    sentMessage: "bg-blue-500 text-white",
    receivedMessage: "bg-gray-200 text-gray-900",
  },
  dark: {
    name: "Dark",
    bg: "bg-gray-900",
    bgSecondary: "bg-gray-800",
    text: "text-white",
    textSecondary: "text-gray-400",
    border: "border-gray-700",
    hover: "hover:bg-gray-800",
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    sidebar: "bg-gray-800",
    header: "bg-gray-800",
    sentMessage: "bg-blue-600 text-white",
    receivedMessage: "bg-gray-700 text-white",
  },
  blue: {
    name: "Blue",
    bg: "bg-blue-50",
    bgSecondary: "bg-blue-100",
    text: "text-blue-900",
    textSecondary: "text-blue-700",
    border: "border-blue-200",
    hover: "hover:bg-blue-200",
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    sidebar: "bg-blue-50",
    header: "bg-blue-100",
    sentMessage: "bg-blue-600 text-white",
    receivedMessage: "bg-blue-200 text-blue-900",
  },
  green: {
    name: "Green",
    bg: "bg-emerald-50",
    bgSecondary: "bg-emerald-100",
    text: "text-emerald-900",
    textSecondary: "text-emerald-700",
    border: "border-emerald-200",
    hover: "hover:bg-emerald-200",
    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    sidebar: "bg-emerald-50",
    header: "bg-emerald-100",
    sentMessage: "bg-emerald-600 text-white",
    receivedMessage: "bg-emerald-200 text-emerald-900",
  },
  purple: {
    name: "Purple",
    bg: "bg-purple-50",
    bgSecondary: "bg-purple-100",
    text: "text-purple-900",
    textSecondary: "text-purple-700",
    border: "border-purple-200",
    hover: "hover:bg-purple-200",
    primary: "bg-purple-600",
    primaryHover: "hover:bg-purple-700",
    sidebar: "bg-purple-50",
    header: "bg-purple-100",
    sentMessage: "bg-purple-600 text-white",
    receivedMessage: "bg-purple-200 text-purple-900",
  },
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("app-theme");
    return saved || "light";
  });

  useEffect(() => {
    localStorage.setItem("app-theme", theme);
  }, [theme]);

  const switchTheme = (themeName) => {
    if (THEMES[themeName]) {
      setTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, switchTheme, themeConfig: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
