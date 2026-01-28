import { Palette } from "lucide-react";
import { useTheme, THEMES } from "../contexts/ThemeContext";
import { useState } from "react";

export default function ThemeSwitcher() {
  const { theme, switchTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${themeConfig.hover} border ${themeConfig.border}`}
        title="Switch theme"
      >
        <Palette size={20} className={themeConfig.text} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute right-0 top-full mt-2 w-56 ${themeConfig.bgSecondary} border ${themeConfig.border} rounded-lg shadow-xl z-50`}
          >
            <div className={`px-4 py-3 border-b ${themeConfig.border}`}>
              <p className={`text-sm font-semibold ${themeConfig.text}`}>Select Theme</p>
            </div>

            <div className="p-2 space-y-1">
              {Object.entries(THEMES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    switchTheme(key);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 flex items-center gap-3 ${
                    theme === key
                      ? `${value.bg} ${value.text}`
                      : `${themeConfig.hover} ${themeConfig.text}`
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex-shrink-0 ${
                      key === "dark" ? "bg-gray-800" : value.primary
                    }`}
                  />
                  <span className="text-sm font-medium flex-1">{value.name}</span>
                  {theme === key && <span className="text-lg">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
