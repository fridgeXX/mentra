import React, { useState } from 'react';
import { Icons } from '../constants';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-[100] transition-all duration-500 ${isFocused ? 'bottom-10' : 'bottom-8'}`}>
      <form 
        onSubmit={handleSubmit} 
        className={`bg-white/95 rounded-full p-2 flex items-center transition-all duration-300 border border-[#D8E2DC] shadow-xl ${isFocused ? 'border-[#2D6A4F]/40 ring-4 ring-[#2D6A4F]/5' : ''}`}
      >
        <input
          type="text"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Transmit signal..."
          className="flex-1 bg-transparent px-6 py-4 text-sm outline-none text-[#1B4332] placeholder-[#1B4332]/25 font-medium"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={!value.trim() || isLoading}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${
            value.trim() && !isLoading 
              ? 'bg-[#1B4332] text-[#F4F7F5] scale-100 shadow-md active:scale-90' 
              : 'bg-[#D8E2DC]/40 text-[#52796F] scale-90 opacity-40'
          }`}
        >
          <Icons.Send />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;