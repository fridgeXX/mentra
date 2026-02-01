import React from 'react';

interface MascotProps {
  isAnalyzing?: boolean;
  isDocked?: boolean;
}

const Mascot: React.FC<MascotProps> = ({ isAnalyzing }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ${isAnalyzing ? 'scale-110' : ''}`}>
      
      {/* Soft Grounding Aura - Forest Canopy shadow */}
      <div className={`absolute bottom-[10%] w-[50%] h-[3%] blur-lg rounded-full transition-all duration-1000 ${isAnalyzing ? 'bg-[#2D6A4F]/20' : 'bg-[#52796F]/5'}`}></div>

      <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full overflow-visible">
        {/* Mascot Body - Organic Look */}
        <path
          d="M 60,160 L 140,160 C 165,160 175,145 168,125 C 164,110 150,100 135,100 C 125,75 75,75 65,100 C 50,100 36,110 32,125 C 25,145 35,160 60,160 Z"
          fill="#FFFFFF"
          stroke={isAnalyzing ? "#2D6A4F" : "#1B4332"}
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="transition-all duration-700"
        />

        {/* The Face */}
        <g className={isAnalyzing ? 'animate-pulse' : ''} transform="translate(0, 5)">
          <g transform="translate(90, 125)">
            <circle cx="0" cy="0" r="7" fill="#1B4332" />
            <circle cx="-1.5" cy="-1.5" r="2.5" fill="#FFFFFF" opacity="0.3" />
          </g>
          
          <g transform="translate(110, 125)">
            <circle cx="0" cy="0" r="7" fill="#1B4332" />
            <circle cx="-1.5" cy="-1.5" r="2.5" fill="#FFFFFF" opacity="0.3" />
          </g>
          
          <path
            d="M 98,138 C 99,140 101,140 102,138"
            fill="none"
            stroke="#1B4332"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default Mascot;