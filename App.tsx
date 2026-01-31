import React, { useState, useEffect, useRef } from 'react';
import { View, Message, AnalysisResponse } from './types';
import { Icons, COLORS } from './constants';
import Mascot from './components/Mascot';
import ChatInput from './components/ChatInput';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.LANDING);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Gaze tracking for mascot eyes
  const [typingXOffset, setTypingXOffset] = useState(2); 
  const [typingYOffset, setTypingYOffset] = useState(-3.5); 
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleUpdate = (text: string) => {
    if (text.length === 0) {
      setTypingXOffset(2);
      setTypingYOffset(-3.5);
      return;
    }

    const maxChars = 40;
    const progress = Math.min(text.length / maxChars, 1);
    const startX = -4.5;
    const endX = 4.5;
    
    setTypingYOffset(4.5); 
    setTypingXOffset(startX + (progress * (endX - startX)));
  };

  const handleSend = async (text: string) => {
    setError(null);
    if (view === View.LANDING) {
      setView(View.CHATTING);
    }

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    setTypingXOffset(0); 
    setTypingYOffset(0);

    try {
      // Trigger analysis after 7-8 messages
      if (messages.length >= 7) {
        setView(View.ANALYZING);
        const history = [...messages, userMsg].map(m => `${m.role}: ${m.content}`).join('\n');
        const result = await geminiService.analyzeMentalState(history);
        setAnalysis(result);
        setView(View.RESULTS);
      } else {
        const aiResponseText = await geminiService.getResponse([...messages, userMsg]);
        const aiMsg: Message = { 
          id: (Date.now() + 1).toString(), 
          role: 'assistant', 
          content: aiResponseText
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsTyping(false);
      }
    } catch (err: any) {
      setIsTyping(false);
      console.error(err);
      
      const errorMessage = err.message || '';
      if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        setError("I'm experiencing a bit of a rush right now. Could you wait a moment and try sending that again?");
      } else {
        setError("Something went wrong on my end. Let's try that again.");
      }
    }
  };

  const reset = () => {
    setView(View.LANDING);
    setMessages([]);
    setAnalysis(null);
    setError(null);
    setTypingXOffset(2);
    setTypingYOffset(-3.5);
  };

  return (
    <div className="relative h-screen w-full flex flex-col bg-[#F2F8F5] overflow-hidden text-[#1B3022]">
      
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 bg-pattern pointer-events-none opacity-50"></div>
      <div className="absolute inset-0 z-1 pointer-events-none noise-texture"></div>
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#99C9B6] opacity-[0.15] blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-[#4D7C75] opacity-[0.1] blur-[100px] rounded-full"></div>

      {/* Persistent Header */}
      <header className="relative p-4 flex items-center justify-between z-[60] bg-[#F2F8F5]/60 backdrop-blur-lg border-b border-[#D8EAE2]/50">
        <div className="flex items-center gap-3">
          {view !== View.LANDING && (
            <button onClick={reset} className="p-2 -ml-2 text-[#4D7C75] hover:bg-[#4D7C75]/10 rounded-full transition-colors">
              <Icons.Back />
            </button>
          )}
          <span className="font-bold text-xl tracking-tight text-[#4D7C75] select-none">
            Mentra
          </span>
        </div>
        
        <div className="w-9 h-9 rounded-full bg-[#4D7C75] shadow-sm flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#D8EAE2]/80">
          RP
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        
        {/* THE MASCOT CONTAINER */}
        <div className={`flex flex-col items-center justify-center transition-all duration-700 ease-in-out px-6 ${view === View.LANDING ? 'flex-1 -mt-16' : 'h-[18%] pt-6 pb-2'}`}>
           <div className={`transition-all duration-700 ease-in-out ${view === View.LANDING ? 'w-48 h-48' : 'w-24 h-24'}`}>
              <Mascot 
                isDocked={view !== View.LANDING} 
                isAnalyzing={view === View.ANALYZING}
                lookOffset={typingXOffset} 
                lookVerticalOffset={typingYOffset} 
              />
           </div>
           
           {view === View.LANDING && (
             <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
               <p className="text-[#4D7C75] font-semibold text-lg mb-1 tracking-wide opacity-80">Hello Robin</p>
               <h1 className="text-3xl font-extrabold text-[#2D4F49] tracking-tight leading-tight max-w-[280px] mx-auto">
                 How can I help <span className="text-[#4D7C75]">you</span> today?
               </h1>
             </div>
           )}
        </div>

        {/* Content Area */}
        <div className={`flex-1 px-6 overflow-hidden flex flex-col ${view === View.LANDING ? 'hidden' : ''}`}>
          {(view === View.CHATTING || view === View.ANALYZING) && (
            <div className="flex-1 flex flex-col pb-36 h-full">
               {view === View.CHATTING ? (
                 <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pt-2 pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {messages.map(msg => (
                      <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in zoom-in-95 duration-300`}>
                        <div className={`max-w-[85%] px-6 py-4 rounded-[28px] text-lg leading-relaxed shadow-lg transition-all ${
                          msg.role === 'user' 
                          ? 'bg-[#4D7C75] text-white rounded-tr-none shadow-[#4D7C75]/20' 
                          : 'bg-[#FFFFFF] text-[#2D4F49] rounded-tl-none border border-[#D8EAE2] shadow-[#1B3022]/5'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="bg-[#FFFFFF] px-6 py-4 rounded-[28px] rounded-tl-none border border-[#D8EAE2] shadow-lg shadow-[#1B3022]/5 flex gap-2 items-center">
                          <div className="w-2 h-2 bg-[#4D7C75]/40 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-[#4D7C75]/40 rounded-full animate-bounce [animation-delay:150ms]"></div>
                          <div className="w-2 h-2 bg-[#4D7C75]/40 rounded-full animate-bounce [animation-delay:300ms]"></div>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="flex justify-center mt-4 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-800 px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
                          <span className="text-lg">☁️</span>
                          <p className="text-sm font-medium">{error}</p>
                          <button onClick={() => setError(null)} className="ml-2 text-red-300 hover:text-red-500 transition-colors">
                            <span className="font-bold text-lg">×</span>
                          </button>
                        </div>
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                   <div className="text-center max-w-sm">
                      <h2 className="text-2xl font-extrabold mb-3 text-[#2D4F49]">Looking into it...</h2>
                      <p className="text-[#4D7C75] leading-relaxed text-base">
                        Processing our conversation with care.
                      </p>
                    </div>
                 </div>
               )}
            </div>
          )}

          {view === View.RESULTS && analysis && (
            <div className="flex-1 pb-10 pt-4 overflow-y-auto custom-scrollbar animate-in slide-in-from-bottom-4 duration-500">
              <div className="mb-10">
                <div className="inline-block px-3 py-1 bg-[#4D7C75]/10 text-[#4D7C75] rounded-full text-[10px] font-bold tracking-widest uppercase mb-4">Discovery</div>
                <h2 className="text-3xl font-extrabold mb-6 tracking-tight text-[#2D4F49]">Your Path Forward</h2>
                <div className="p-8 bg-white/95 backdrop-blur-md rounded-[32px] border border-[#D8EAE2]/80 relative shadow-xl shadow-[#1B3022]/5">
                  <p className="text-[#2D4F49] text-xl leading-relaxed italic mb-8 font-medium">"{analysis.summary}"</p>
                  <div className="flex items-start gap-4 text-white bg-[#4D7C75] p-5 rounded-2xl shadow-lg shadow-[#4D7C75]/20">
                    <div className="text-2xl">✨</div>
                    <p className="font-bold text-sm leading-relaxed">{analysis.suggestedAction}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-extrabold text-xl text-[#2D4F49]">Recommended Specialists</h3>
                {analysis.matches.map((therapist, idx) => (
                  <div key={idx} className="bg-white/95 backdrop-blur-md border border-[#D8EAE2]/80 shadow-lg shadow-[#1B3022]/5 rounded-[32px] p-8">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-center gap-5">
                        <img src={therapist.imageUrl} alt={therapist.name} className="w-20 h-20 rounded-[24px] object-cover bg-[#F2F8F5] shadow-sm" />
                        <div>
                          <h4 className="font-extrabold text-xl text-[#2D4F49]">{therapist.name}</h4>
                          <p className="text-[#4D7C75] text-[11px] font-bold tracking-wider uppercase mt-1">{therapist.specialty}</p>
                        </div>
                      </div>
                      <p className="text-[#4D7C75]/90 text-base leading-relaxed">{therapist.description}</p>
                      <button className="w-full py-4 bg-[#4D7C75] text-white font-bold rounded-2xl hover:bg-[#3A5D58] transition-all shadow-lg shadow-[#4D7C75]/20 active:scale-[0.98]">
                        Connect with {therapist.name.split(' ')[0]}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={reset}
                className="w-full mt-10 py-5 border-2 border-[#D8EAE2] text-[#4D7C75] font-bold rounded-2xl hover:bg-white transition-all active:scale-[0.98]"
              >
                Start New Session
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Persistent Input Bar */}
      {view !== View.ANALYZING && view !== View.RESULTS && (
        <ChatInput 
          onSend={handleSend} 
          onUpdate={handleUpdate} 
          isLoading={isTyping} 
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(77, 124, 117, 0.15);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default App;