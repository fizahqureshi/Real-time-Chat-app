import { Smile } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

const EMOJI_CATEGORIES = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😌", "😔", "😑", "😐", "😕", "🙁", "☹️", "😲", "😞", "😖", "😢", "😭", "😱", "😨", "😰", "😥", "😢", "😤", "😠", "😡", "🤬", "😈", "👿", "💀", "😳", "😵", "🤐", "🤢", "🤮"],
  animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🪂", "🐢", "🐍", "🦎", "🦖", "🦕"],
  food: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥑", "🍆", "🍅", "🍄", "🥒", "🥬", "🥦", "🌶️", "🌽", "🥕", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🥓", "🥩", "🍗", "🍖", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮"],
  sports: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎳", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "⛸️", "🎣", "🎽", "🎿", "⛷️", "🏂", "🪂", "🛼", "🛹", "🛷", "🥌", "🎯", "🪀", "🪃"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🏎️", "🛵", "🦯", "🦽", "🦼", "🛺", "🚲", "🛴", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬"],
  objects: ["🎈", "🎏", "🎀", "🎁", "🏆", "🏅", "🎖️", "🏵️", "🎗️", "🎫", "🎖️", "🔔", "🔕", "🎶", "🎵", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🎻", "🎲", "🎯", "🎳", "🎮", "🎰", "🧩", "🚗", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👍", "👎", "☝️", "👆", "👇", "☚", "👈", "👉", "👌", "🙌", "👏", "🙏"],
};

export default function EmojiPicker({ onEmojiSelect }) {
  const { themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("smileys");

  const handleEmojiClick = (emoji) => {
    onEmojiSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all duration-200 ${themeConfig.hover} border ${themeConfig.border}`}
        title="Add emoji"
      >
        <Smile size={20} className={themeConfig.text} />
      </button>

      {isOpen && (
        <div
          className={`absolute left-0 bottom-full mb-2 w-80 ${themeConfig.bgSecondary} border ${themeConfig.border} rounded-lg shadow-lg z-50`}
        >
          {/* Category tabs */}
          <div className={`flex gap-1 p-2 border-b ${themeConfig.border} overflow-x-auto`}>
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? `${themeConfig.primary} text-white`
                    : `${themeConfig.text} ${themeConfig.hover}`
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Emoji grid */}
          <div className="p-3 grid grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {EMOJI_CATEGORIES[selectedCategory].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className={`text-2xl ${themeConfig.hover} rounded p-1 transition-all duration-150 hover:scale-110`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Close hint */}
          <div className={`px-3 py-2 text-xs ${themeConfig.textSecondary} text-center border-t ${themeConfig.border}`}>
            Click to insert emoji
          </div>
        </div>
      )}
    </div>
  );
}
