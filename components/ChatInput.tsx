
import React, { useState, useEffect } from 'react';
import { Icons, COLORS } from '../constants';

interface ChatInputProps {
  onSend: (text: string) => void;
  onUpdate?: (text: string) => void; 
  isLoading?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, onUpdate, isLoading }) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (onUpdate) {
      onUpdate(value);
    }
  }, [value, onUpdate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isLoading) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg px-6 py-4 fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="glass rounded-[2.5rem] p-1.5 flex items-center shadow-2xl transition-all border border-[#99C9B6]/30">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="How are you feeling?"
          className="flex-1 bg-transparent px-6 py-3 text-lg outline-none text-[#1B3022] placeholder-[#4D7C75]/40"
          disabled={isLoading}
        />
        {value.trim() && (
          <button 
            type="submit" 
            className="p-3 bg-[#4D7C75] text-white rounded-full ml-1 hover:bg-[#3A5D58] transition-all shadow-md transform active:scale-95"
          >
            <Icons.Send />
          </button>
        )}
      </div>
    </form>
  );
};

export default ChatInput;
