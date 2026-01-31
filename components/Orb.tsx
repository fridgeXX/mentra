
import React, { useMemo } from 'react';

interface OrbProps {
  isAnalyzing?: boolean;
}

const Orb: React.FC<OrbProps> = ({ isAnalyzing }) => {
  // Creating a hyper-dense network of solid lines to completely fill the orb.
  // We use a much higher count (120) for a rich, solid-looking texture.
  const filamentCount = 120;

  const filaments = useMemo(() => {
    return Array.from({ length: filamentCount }).map((_, i) => {
      // Alternate hemispheres and distribute heights very densely
      const side = i % 2 === 0 ? 1 : -1;
      // Using a sine-based distribution to concentrate lines towards the poles and equator
      const progress = i / filamentCount;
      const peakY = 100 + (side * progress * 95); 
      
      const duration = 4 + Math.random() * 6;
      const delay = Math.random() * -20;
      const strokeWidth = 0.4 + Math.random() * 0.8;
      
      // Control points for curvature to make them look more like a sphere
      // We vary the start and end points slightly to prevent a perfect convergence
      const xStart = 5 + Math.random() * 15;
      const xEnd = 195 - Math.random() * 15;

      return { peakY, duration, delay, strokeWidth, xStart, xEnd, i };
    });
  }, [filamentCount]);

  return (
    <div className={`relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96 mx-auto transition-all duration-[1500ms] ${isAnalyzing ? 'scale-110' : 'animate-float-ethereal'}`}>
      
      {/* 1. Ambient Bloom - Intense green glow aura */}
      <div className={`absolute inset-0 rounded-full transition-all duration-[2000ms] blur-[120px] pointer-events-none ${isAnalyzing ? 'bg-[#00FF6A]/50 scale-150' : 'bg-[#00702F]/20 scale-110'}`}></div>
      
      {/* 2. The Sphere Shell */}
      <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden flex items-center justify-center shadow-[0_25px_80px_-15px_rgba(0,112,47,0.4),inset_0_0_60px_rgba(0,255,106,0.1)] bg-[#010101]">
        
        {/* Deep Internal Core Glow */}
        <div className={`absolute w-[80%] h-[80%] rounded-full bg-[#00FF6A] blur-[60px] opacity-20 transition-all duration-1000 ${isAnalyzing ? 'scale-150 opacity-40' : ''}`}></div>

        {/* 3. Hyper-Dense Solid Filaments */}
        <div className={`absolute inset-0 z-20 transition-all duration-[5000ms] ease-in-out ${isAnalyzing ? 'rotate-[720deg] scale-105' : 'animate-slow-rotate'}`}>
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="solid-green-plasma" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#004d20" stopOpacity="0.2" />
                <stop offset="25%" stopColor="#00702F" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#00FF6A" stopOpacity="1" />
                <stop offset="75%" stopColor="#00702F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#004d20" stopOpacity="0.2" />
              </linearGradient>
              <filter id="hyper-plasma-glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            <g filter="url(#hyper-plasma-glow)">
              {filaments.map((f) => (
                <path
                  key={`solid-fil-${f.i}`}
                  d={`M ${f.xStart},100 Q 100,${f.peakY} ${f.xEnd},100`}
                  fill="none"
                  stroke="url(#solid-green-plasma)"
                  strokeWidth={f.strokeWidth}
                  className="orb-solid-anim"
                  style={{
                    animationDuration: `${f.duration}s`,
                    animationDelay: `${f.delay}s`,
                    opacity: isAnalyzing ? 1 : 0.8,
                    strokeLinecap: 'round'
                  }}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* 4. Thick Equatorial Energy Band */}
        <div className="absolute w-full h-[28%] top-1/2 -translate-y-1/2 z-30 pointer-events-none">
          {/* Broad Band Glow */}
          <div className={`absolute inset-x-0 h-full bg-gradient-to-r from-transparent via-[#00FF6A] to-transparent opacity-50 blur-[20px] transition-all duration-500 ${isAnalyzing ? 'scale-y-150 brightness-200 opacity-90' : 'animate-pulse'}`}></div>
          
          {/* Intense Glow Layer */}
          <div className="absolute inset-x-0 h-[60%] top-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[#00FF6A] to-transparent opacity-90 blur-[6px]"></div>
          
          {/* White Hot Core */}
          <div className={`absolute inset-x-0 h-[4px] top-1/2 -translate-y-1/2 bg-white shadow-[0_0_25px_#00FF6A,0_0_50px_rgba(255,255,255,1)] transition-all duration-700 ${isAnalyzing ? 'h-[6px] scale-y-150' : ''}`}></div>
        </div>

        {/* 5. High-End Glass Polish */}
        <div className="absolute inset-0 z-50 pointer-events-none">
          {/* Top Glare */}
          <div className="absolute top-[2%] left-[10%] w-[80%] h-[40%] bg-gradient-to-b from-white/30 to-transparent rounded-[50%] rotate-[-15deg] blur-[3px]"></div>
          
          {/* Secondary Shine */}
          <div className="absolute top-[6%] left-[20%] w-[50%] h-[15%] bg-white/10 rounded-[50%] rotate-[-10deg] blur-[1px]"></div>

          {/* Bottom Rim Light */}
          <div className="absolute bottom-[4%] left-[15%] w-[70%] h-[20%] border-b-[3px] border-white/5 rounded-[50%] blur-[6px]"></div>
          
          {/* Inner Rim */}
          <div className="absolute inset-[2px] rounded-full border border-white/[0.1] mix-blend-overlay"></div>
        </div>

        {/* Texture Overlay */}
        <div className="absolute inset-0 z-40 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] pointer-events-none mix-blend-screen"></div>
      </div>

      <style>{`
        @keyframes solid-sway {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.05, 0.95); }
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
          animation: slow-rotate 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Orb;
