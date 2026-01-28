import { LogOut as LogOutIcon, MessageCircle, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeSidebar() {
  const navigate = useNavigate();
  const { themeConfig } = useTheme();

  const handleLogout = () => {
    socket.disconnect();
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { icon: MessageCircle, label: "Chats", id: "chats" },
    { icon: Users, label: "Groups", id: "groups" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div className={`w-16 ${themeConfig.bgSecondary} border-r ${themeConfig.border} flex flex-col items-center py-4 gap-4`}>
      {/* Navigation Icons */}
      <div className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`p-2 rounded-lg transition-all duration-200 ${themeConfig.hover} border ${themeConfig.border}`}
            title={item.label}
          >
            <item.icon size={20} className={themeConfig.text} />
          </button>
        ))}
      </div>

      {/* Logout - Bottom */}
      <div className="flex-1 flex items-end">
        <button
          onClick={handleLogout}
          className={`p-2 rounded-lg transition-all duration-200 ${themeConfig.hover} border ${themeConfig.border}`}
          title="Logout"
        >
          <LogOutIcon size={20} className={themeConfig.text} />
        </button>
      </div>
    </div>
  );
}
