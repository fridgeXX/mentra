import React from 'react';

interface MascotProps {
  isAnalyzing?: boolean;
  isDocked?: boolean;
  lookOffset?: number; 
  lookVerticalOffset?: number; 
}

const Mascot: React.FC<MascotProps> = ({ isAnalyzing, isDocked, lookOffset = 0, lookVerticalOffset = 0 }) => {
  // Clamping for radial containment within the 9-unit radius sockets
  const maxRadius = 6;
  const currentRadius = Math.sqrt(lookOffset ** 2 + lookVerticalOffset ** 2);
  
  let clampedX = lookOffset;
  let clampedY = lookVerticalOffset;

  if (currentRadius > maxRadius) {
    const scale = maxRadius / currentRadius;
    clampedX *= scale;
    clampedY *= scale;
  }

  // Choose animation based on state
  const animationClass = isAnalyzing 
    ? 'animate-bounce-gentle' 
    : isDocked 
      ? 'animate-docked-idle' 
      : 'animate-float-soft';

  return (
    <div className={`relative flex items-center justify-center w-full h-full mx-auto ${animationClass}`}>
      
      {/* Dynamic Ground Shadow: Dissolves as mascot glides up */}
      <div className={`absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-[70%] h-[8%] bg-black/5 blur-xl rounded-full transition-opacity duration-700 ${isDocked ? 'opacity-0' : 'opacity-100'}`}></div>

      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm overflow-visible">
        {/* Mascot Body: Fluid Green Cloud */}
        <path
          d="M50,150 
             L150,150 
             C175,150 185,135 185,115 
             C185,90 165,75 145,75 
             C145,50 125,35 100,35 
             C75,35 55,50 55,75 
             C35,75 15,90 15,115 
             C15,135 25,150 50,150 Z"
          fill="#99C9B6"
          stroke="#4D7C75"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Mascot Face */}
        <g className={isAnalyzing ? 'animate-pulse' : ''}>
          {/* Eyes with Blink */}
          <g className="animate-blink">
            {/* Left Eye */}
            <circle cx="80" cy="105" r="9" fill="black" />
            <circle 
              cx="80" cy="105" r="3" fill="white" 
              style={{ 
                transform: `translate(${clampedX}px, ${clampedY}px)`,
                transition: 'transform 0.12s cubic-bezier(0.2, 1, 0.4, 1)' 
              }}
            />
            
            {/* Right Eye */}
            <circle cx="120" cy="105" r="9" fill="black" />
            <circle 
              cx="120" cy="105" r="3" fill="white" 
              style={{ 
                transform: `translate(${clampedX}px, ${clampedY}px)`,
                transition: 'transform 0.12s cubic-bezier(0.2, 1, 0.4, 1)' 
              }}
            />
          </g>

          {/* Simple Smile */}
          <path
            d="M88,122 Q100,132 112,122"
            fill="none"
            stroke="black"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <style>{`
        @keyframes float-soft {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.03); }
        }
        @keyframes blink {
          0%, 45%, 55%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.1); }
        }
        .animate-blink {
          transform-origin: 100px 105px;
          animation: blink 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Mascot;