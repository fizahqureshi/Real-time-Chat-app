import { MessageCircle } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-purple-900 font-bold text-xl">
      <MessageCircle size={32} />
      <span className="text-purple-900 ">Convo App</span>
    </div>
  );
}
