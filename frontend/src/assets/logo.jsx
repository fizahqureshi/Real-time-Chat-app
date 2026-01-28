import { MessageCircle } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function Logo() {
  const { theme } = useTheme();

  // Color mappings for each theme
  const themeColors = {
    light: { bg: "from-blue-500 to-blue-700", text: "from-blue-600 via-blue-500 to-blue-700" },
    dark: { bg: "from-blue-400 to-blue-600", text: "from-blue-400 via-blue-300 to-blue-500" },
    blue: { bg: "from-blue-600 to-blue-800", text: "from-blue-700 via-blue-600 to-blue-800" },
    green: { bg: "from-emerald-500 to-emerald-700", text: "from-emerald-600 via-emerald-500 to-emerald-700" },
    purple: { bg: "from-purple-500 to-purple-700", text: "from-purple-600 via-purple-500 to-purple-700" },
  };

  const colors = themeColors[theme] || themeColors.light;

  return (
    <div className="flex items-center gap-3">
      {/* Icon with gradient & subtle shadow */}
      <div className={`p-2 bg-gradient-to-tr ${colors.bg} rounded-full shadow-md transition-all duration-300`}>
        <MessageCircle size={28} className="text-white" />
      </div>

      {/* App name with gradient text */}
      <span className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${colors.text} transition-all duration-300`}>
        Convo App
      </span>
    </div>
  );
}


