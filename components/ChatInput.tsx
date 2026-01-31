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
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-[100] transition-all duration-700 ${isFocused ? 'bottom-10' : 'bottom-8'}`}>
      <form 
        onSubmit={handleSubmit} 
        className={`glass-deep rounded-[3rem] p-2 flex items-center transition-all duration-500 shadow-[0_25px_60px_-15px_rgba(49,98,99,0.15)] ${isFocused ? 'ring-4 ring-[#6AA495]/20 scale-[1.02]' : 'border-white/80'}`}
      >
        <input
          type="text"
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setValue(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 bg-transparent px-8 py-4 text-xl outline-none text-[#316263] placeholder-[#316263]/20 font-medium"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={!value.trim() || isLoading}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 transform ${
            value.trim() && !isLoading 
              ? 'bg-[#316263] text-white scale-100 shadow-xl active:scale-90 hover:brightness-110' 
              : 'bg-gray-100 text-gray-300 scale-75 opacity-0'
          }`}
        >
          <Icons.Send />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;