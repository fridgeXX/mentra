
import React from 'react';

interface MascotProps {
  isAnalyzing?: boolean;
  isDocked?: boolean;
}

const Mascot: React.FC<MascotProps> = ({ isAnalyzing }) => {
  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-700 ${isAnalyzing ? 'scale-110' : 'animate-float'}`}>
      
      {/* Subtle Grounding Shadow - Narrowed to match body */}
      <div className="absolute bottom-[10%] w-[60%] h-[6%] bg-[#2D4F49]/10 blur-xl rounded-full"></div>

      <svg viewBox="0 0 200 200" className="relative z-10 w-full h-full overflow-visible">
        {/* 
          Squishy Cloud Mascot - Narrower Version:
          - Compact silhouette with a 1.2:1 aspect ratio roughly.
          - Perfectly flat bottom edge.
          - Extremely curvy, bulbous sides pulled inward.
          - Balanced three-hump top structure centered at 100.
          - Premium dark slate outline.
        */}
        <path
          d="M 60,160 
             L 140,160 
             C 165,160 175,145 168,125 
             C 164,110 150,100 135,100 
             C 125,75 75,75 65,100 
             C 50,100 36,110 32,125 
             C 25,145 35,160 60,160 Z"
          fill="#C5EED6"
          stroke="#333C41"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
          className="transition-colors duration-700"
        />

        {/* The Face - Centered and brought closer together for the narrower frame */}
        <g className={isAnalyzing ? 'animate-pulse' : ''} transform="translate(0, 5)">
          {/* Left Eye - Smaller eyes (radius 8.5) positioned closer to center axis (100) */}
          <g transform="translate(90, 125)">
            <circle cx="0" cy="0" r="8.5" fill="#000" />
            {/* Glossy Sparkle Highlights - Adjusted for smaller eye */}
            <circle cx="-2.8" cy="-2.8" r="3.4" fill="#fff" />
            <circle cx="2.8" cy="2.8" r="1.6" fill="#fff" />
          </g>
          
          {/* Right Eye - Smaller eyes (radius 8.5) positioned closer to center axis (100) */}
          <g transform="translate(110, 125)">
            <circle cx="0" cy="0" r="8.5" fill="#000" />
            <circle cx="-2.8" cy="-2.8" r="3.4" fill="#fff" />
            <circle cx="2.8" cy="2.8" r="1.6" fill="#fff" />
          </g>
          
          {/* Small Friendly "u" Smile - Perfectly centered and raised */}
          <path
            d="M 97,138 C 99,140.5 101,140.5 103,138"
            fill="none"
            stroke="#000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <style>{`
        @keyframes floating-cloud-premium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: floating-cloud-premium 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Mascot;
