import { MessageCircle } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Icon with blue gradient & subtle shadow */}
      <div className="p-2 bg-gradient-to-tr from-blue-500 to-blue-700 rounded-full shadow-md">
        <MessageCircle size={28} className="text-white" />
      </div>

      {/* App name with blue gradient text */}
      <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700">
        Convo App
      </span>
    </div>
  );
}

