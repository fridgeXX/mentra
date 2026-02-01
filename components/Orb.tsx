import React, { useMemo } from 'react';

interface OrbProps {
  isAnalyzing?: boolean;
}

const Orb: React.FC<OrbProps> = ({ isAnalyzing }) => {
  const filamentCount = 120;

  const filaments = useMemo(() => {
    return Array.from({ length: filamentCount }).map((_, i) => {
      const side = i % 2 === 0 ? 1 : -1;
      const progress = i / filamentCount;
      const peakY = 100 + (side * progress * 95); 
      const duration = 4 + Math.random() * 6;
      const delay = Math.random() * -20;
      const strokeWidth = 0.4 + Math.random() * 0.8;
      const xStart = 5 + Math.random() * 15;
      const xEnd = 195 - Math.random() * 15;

      return { peakY, duration, delay, strokeWidth, xStart, xEnd, i };
    });
  }, [filamentCount]);

  return (
    <div className={`relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96 mx-auto transition-all duration-[1500ms] ${isAnalyzing ? 'scale-110' : 'animate-float-ethereal'}`}>
      
      {/* Ambient Bloom - Forest Canopy and Iced Matcha tones */}
      <div className={`absolute inset-0 rounded-full transition-all duration-[2000ms] blur-[120px] pointer-events-none ${isAnalyzing ? 'bg-[#2D6A4F]/40 scale-150' : 'bg-[#D8E2DC]/10 scale-110'}`}></div>
      
      <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden flex items-center justify-center shadow-[0_25px_80px_-15px_rgba(27,67,50,0.3),inset_0_0_60px_rgba(216,226,220,0.1)] bg-[#050A08]">
        
        {/* Deep Internal Core */}
        <div className={`absolute w-[80%] h-[80%] rounded-full bg-[#D8E2DC] blur-[60px] opacity-10 transition-all duration-1000 ${isAnalyzing ? 'scale-150 opacity-30' : ''}`}></div>

        <div className={`absolute inset-0 z-20 transition-all duration-[5000ms] ease-in-out ${isAnalyzing ? 'rotate-[720deg] scale-105' : 'animate-slow-rotate'}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="natural-plasma" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1B4332" stopOpacity="0.2" />
                <stop offset="25%" stopColor="#2D6A4F" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#D8E2DC" stopOpacity="1" />
                <stop offset="75%" stopColor="#2D6A4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1B4332" stopOpacity="0.2" />
              </linearGradient>
              <filter id="natural-glow">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            <g filter="url(#natural-glow)">
              {filaments.map((f) => (
                <path
                  key={`fil-${f.i}`}
                  d={`M ${f.xStart},100 Q 100,${f.peakY} ${f.xEnd},100`}
                  fill="none"
                  stroke="url(#natural-plasma)"
                  strokeWidth={f.strokeWidth}
                  className="orb-solid-anim"
                  style={{
                    animationDuration: `${f.duration}s`,
                    animationDelay: `${f.delay}s`,
                    opacity: isAnalyzing ? 1 : 0.7,
                    strokeLinecap: 'round'
                  }}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* Equatorial Energy Band */}
        <div className="absolute w-full h-[25%] top-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className={`absolute inset-x-0 h-full bg-gradient-to-r from-transparent via-[#D8E2DC] to-transparent opacity-40 blur-[20px] transition-all duration-500 ${isAnalyzing ? 'scale-y-150 brightness-150' : 'animate-pulse'}`}></div>
          <div className="absolute inset-x-0 h-[4px] top-1/2 -translate-y-1/2 bg-white/90 shadow-[0_0_20px_#D8E2DC]"></div>
        </div>

        {/* Glass Polish */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute top-[2%] left-[10%] w-[80%] h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-[50%] rotate-[-15deg] blur-[2px]"></div>
          <div className="absolute inset-[2px] rounded-full border border-white/[0.05] mix-blend-overlay"></div>
        </div>
      </div>

      <style>{`
        @keyframes solid-sway {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.03, 0.97); }
        }
        .orb-solid-anim {
          animation: solid-sway ease-in-out infinite alternate;
          transform-origin: center;
        }
        @keyframes slow-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-rotate {
          animation: slow-rotate 50s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Orb;