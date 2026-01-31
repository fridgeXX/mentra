import React, { useState, useEffect, useRef } from 'react';
import { View as AppView, Message, AnalysisResponse } from './types';
import { Icons } from './constants';
import Mascot from './components/Mascot';
import ChatInput from './components/ChatInput';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isQueueActive, setIsQueueActive] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Breathing Cycle Logic for Somatic Reset
  useEffect(() => {
    let interval: any;
    if (isBreathing) {
      let step = 0;
      const phases: { p: 'In' | 'Hold' | 'Out', d: number }[] = [
        { p: 'In', d: 4000 },
        { p: 'Hold', d: 7000 },
        { p: 'Out', d: 8000 }
      ];
      
      const run = () => {
        setBreathPhase(phases[step].p);
        interval = setTimeout(() => {
          step = (step + 1) % phases.length;
          run();
        }, phases[step].d);
      };
      run();
    }
    return () => clearTimeout(interval);
  }, [isBreathing]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (view === AppView.LANDING) setView(AppView.CHATTING);

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Trigger analysis after a meaningful exchange
      if (messages.length >= 6) {
        setView(AppView.ANALYZING);
        const history = [...messages, userMsg].map(m => `${m.role}: ${m.content}`).join('\n');
        const result = await geminiService.analyzeMentalState(history);
        setAnalysis(result);
        setTimeout(() => setView(AppView.TRIAGE), 1800);
      } else {
        const aiResponseText = await geminiService.getResponse([...messages, userMsg]);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponseText }]);
        setIsTyping(false);
      }
    } catch (err: any) {
      setIsTyping(false);
      console.error(err);
    }
  };

  const startQueue = () => {
    setIsQueueActive(true);
    setView(AppView.WAITING);
    setTimeout(() => {
      if (analysis) {
        setAnalysis({
          ...analysis,
          groupMatch: {
            ...analysis.groupMatch,
            details: { dateTime: "Tomorrow at 7:00 PM", price: "$25.00" }
          }
        });
        setView(AppView.PROPOSAL);
      }
    }, 4500);
  };

  const moods = [
    { label: 'Peace', icon: '🌿' },
    { label: 'Calm', icon: '☁️' },
    { label: 'Grounded', icon: '🪵' },
    { label: 'Flow', icon: '✨' },
    { label: 'Rest', icon: '🕯️' },
  ];

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-[#F3F0FF]">
      
      {/* Aurora Pastel Harmony - Layered Ethereal Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-[#F3F0FF]/40 to-[#EFFFF8]/20"></div>
        
        {/* Floating Aurora Blobs */}
        <div className="absolute top-[-10%] left-[-15%] w-[80%] h-[70%] bg-[#E6E6FA]/30 blur-[150px] rounded-full animate-aurora"></div>
        <div className="absolute top-[15%] right-[-20%] w-[70%] h-[80%] bg-[#F0F8FF]/40 blur-[180px] rounded-full animate-aurora [animation-delay:-5s]"></div>
        <div className="absolute bottom-[-20%] left-[10%] w-[90%] h-[60%] bg-[#DFF9F2]/20 blur-[160px] rounded-full animate-aurora [animation-delay:-10s]"></div>
        
        {/* Fine texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#316263_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      {/* Modern Translucent Header */}
      <header className="relative px-8 py-6 flex items-center justify-between z-[60] backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          {view !== AppView.LANDING && view !== AppView.CONFIRMED && (
            <button 
              onClick={() => setView(AppView.LANDING)}
              className="w-10 h-10 flex items-center justify-center bg-white/60 border border-white/40 rounded-2xl ios-active-scale shadow-sm transition-all hover:bg-white"
            >
              <Icons.Back />
            </button>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-[#316263]">Mentra</h1>
        </div>
        <div className="group relative">
          <div className="w-11 h-11 rounded-2xl bg-white/80 border border-white shadow-md flex items-center justify-center font-bold text-[#6AA495] ring-4 ring-white/20 transition-transform group-hover:scale-110">AX</div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col overflow-hidden px-6">
        
        {/* DASHBOARD VIEW */}
        {view === AppView.LANDING && (
          <div className="flex-1 flex flex-col space-y-6 pt-4 pb-12 overflow-y-auto custom-scrollbar scroll-smooth">
            
            {/* Greeting Section - Requested Colors */}
            <div className="animate-[scale-in_0.6s_ease-out]">
              <p className="text-xl font-bold tracking-tight">
                <span className="text-[#6AA495]">Good morning, </span>
                <span className="text-[#316263] text-4xl block mt-1">Alex</span>
              </p>
            </div>

            {/* Daily Bloom Affirmation - 50% Opacity Liquid Glass */}
            <div className="glass-liquid p-8 rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="text-7xl italic serif">"</span>
              </div>
              <p className="text-2xl serif leading-tight text-[#316263] relative z-10">Your presence is your power. Everything else can wait for a moment.</p>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6AA495] opacity-70">Daily Bloom</span>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="bento-grid">
              
              {/* Active Match Tile */}
              {isQueueActive && (
                <div 
                  onClick={() => setView(AppView.WAITING)}
                  className="bento-wide p-8 bg-gradient-to-br from-[#316263] to-[#2D4F49] text-white rounded-[2.5rem] shadow-xl transition-all duration-500 hover:scale-[1.01] cursor-pointer ios-active-scale"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Matching Queue</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Finding Synergy</h3>
                  <p className="text-sm opacity-70 font-medium">Almost there...</p>
                </div>
              )}

              {/* Growth Tile */}
              <div className="glass-liquid p-6 rounded-[2.5rem] flex flex-col justify-between aspect-square">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6AA495]">Growth</span>
                <div>
                  <h4 className="text-lg font-bold mb-1 leading-snug text-[#316263]">
                    {analysis ? analysis.theme : "New Path"}
                  </h4>
                  <p className="text-[10px] font-bold opacity-40 leading-relaxed italic text-[#316263]">
                    {analysis ? "Synthesizing your journey." : "Start sharing to grow."}
                  </p>
                </div>
              </div>

              {/* Streak Tile */}
              <div className="glass-liquid p-6 rounded-[2.5rem] flex flex-col items-center justify-center aspect-square text-center">
                <span className="text-3xl mb-1">🔥</span>
                <span className="text-2xl font-black text-[#316263]">3</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-30 text-[#316263]">Days</span>
              </div>

              {/* Breathing Tile - Interactive Flow */}
              <div 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`bento-wide p-8 rounded-[3rem] transition-all duration-700 cursor-pointer flex items-center gap-6 ${isBreathing ? 'bg-[#316263] text-white shadow-2xl scale-[1.02]' : 'glass-liquid'}`}
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className={`absolute inset-0 rounded-full border-2 border-current transition-all duration-[4000ms] ${isBreathing ? (breathPhase === 'In' ? 'scale-125 opacity-100' : breathPhase === 'Out' ? 'scale-75 opacity-40' : 'scale-110 opacity-80') : 'scale-100 opacity-20'}`}></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xl">✨</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg">{isBreathing ? breathPhase : 'Somatic Reset'}</h4>
                  <p className="text-xs opacity-50 font-bold">{isBreathing ? 'Let the rhythm guide you.' : 'A 1-minute calming flow.'}</p>
                </div>
              </div>

              {/* Mood Tracking Tile */}
              <div className="bento-wide glass-liquid p-7 rounded-[2.5rem] space-y-5">
                <p className="text-sm font-black opacity-30 text-[#316263] uppercase tracking-widest">Energy Pulse</p>
                <div className="flex justify-between px-2">
                  {moods.map(m => (
                    <button 
                      key={m.label}
                      onClick={() => setSelectedMood(m.label)}
                      className={`flex flex-col items-center gap-3 transition-all duration-300 ${selectedMood === m.label ? 'scale-110 opacity-100' : 'opacity-20 hover:opacity-80 grayscale'}`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-[9px] font-black uppercase tracking-tighter text-[#316263]">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Session CTA - Mascot Hero */}
              <div 
                onClick={() => setView(AppView.CHATTING)}
                className="bento-wide bg-white/70 backdrop-blur-2xl p-10 rounded-[3.5rem] flex flex-col items-center border border-white hover:border-[#6AA495]/20 transition-all duration-500 shadow-xl group cursor-pointer ios-active-scale"
              >
                <div className="w-40 h-40 mb-4 relative">
                  <div className="absolute inset-0 bg-[#DFF9F2] blur-3xl rounded-full scale-150 animate-pulse opacity-40"></div>
                  <Mascot isDocked />
                </div>
                <p className="text-[11px] font-black text-[#6AA495] uppercase tracking-[0.3em] mb-4">Mental Check-in</p>
                <h3 className="text-3xl font-bold text-[#316263]">Open Session</h3>
              </div>
            </div>

            <div className="h-24 shrink-0"></div>
          </div>
        )}

        {/* CHAT INTERFACE */}
        {(view === AppView.CHATTING || view === AppView.ANALYZING) && (
          <div className="flex-1 flex flex-col h-full animate-in slide-in-from-bottom-8 duration-500 ease-[var(--spring-ease)]">
            <div className="h-[15%] flex items-center justify-center shrink-0 mb-4">
              <div className="w-24 h-24 bg-white/80 backdrop-blur-xl rounded-full p-2 border-4 border-white/60 shadow-lg">
                <Mascot isDocked isAnalyzing={view === AppView.ANALYZING} />
              </div>
            </div>

            {view === AppView.CHATTING ? (
              <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pt-4 pb-32 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4 duration-500`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-lg font-medium leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#316263] text-white rounded-tr-none shadow-xl' 
                        : 'glass-liquid text-[#316263] rounded-tl-none border-white shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="glass-liquid px-6 py-4 rounded-[2rem] rounded-tl-none border border-white flex gap-2">
                      <div className="w-2 h-2 bg-[#6AA495]/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#6AA495]/60 rounded-full animate-bounce [animation-delay:150ms]"></div>
                      <div className="w-2 h-2 bg-[#6AA495]/60 rounded-full animate-bounce [animation-delay:300ms]"></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                <div className="w-28 h-28 glass-liquid rounded-[3rem] flex items-center justify-center shadow-xl border border-white animate-pulse">
                  <span className="text-5xl">🌌</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-[#316263]">Deep Reflection</h3>
                  <p className="text-sm font-bold opacity-50 max-w-[220px] mx-auto text-[#316263]">Mentra is weaving your thoughts into a clearer picture.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRIAGE / INSIGHTS VIEW */}
        {view === AppView.TRIAGE && analysis && (
          <div className="flex-1 pb-12 pt-4 overflow-y-auto animate-in slide-in-from-bottom-8 duration-700">
            <div className="glass-liquid p-10 rounded-[4rem] space-y-12 shadow-2xl border border-white/60">
              <div className="space-y-5">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#6AA495]">The Core Theme</span>
                <h2 className="text-4xl font-black text-[#316263] tracking-tighter">{analysis.theme}</h2>
                <p className="text-2xl serif italic font-medium leading-relaxed text-[#316263]">"{analysis.insight}"</p>
              </div>
              <div className="p-8 bg-white/50 rounded-[3rem] border border-white/80 shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6AA495] mb-5 opacity-80">Support Circle Recommendation</p>
                <p className="text-lg font-bold leading-relaxed text-[#316263]">{analysis.groupMatch.description}</p>
              </div>
              <button 
                onClick={startQueue}
                className="w-full py-7 bg-gradient-to-r from-[#316263] to-[#2D4F49] text-white font-bold text-xl rounded-[2.5rem] shadow-2xl hover:brightness-110 active:scale-95 transition-all"
              >
                Join Support Circle
              </button>
            </div>
          </div>
        )}

        {/* QUEUE / WAITING VIEW */}
        {view === AppView.WAITING && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in">
            <div className="w-44 h-44 relative">
              <div className="absolute inset-0 rounded-full bg-white/40 animate-ping"></div>
              <div className="absolute inset-6 rounded-full border-4 border-t-[#316263] border-white/60 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl">🕯️</div>
            </div>
            <div className="space-y-5 max-w-xs">
              <h2 className="text-3xl font-black text-[#316263] tracking-tight">Curating Your Circle</h2>
              <p className="text-[#316263] font-bold leading-relaxed opacity-50">We're finding peers and a specialist who resonate with your current path.</p>
            </div>
            <button 
              onClick={() => setView(AppView.LANDING)}
              className="w-full py-5 border-2 border-white text-[#316263] font-black rounded-[2.5rem] bg-white/40 hover:bg-white/90 transition-all"
            >
              Cancel Queue
            </button>
          </div>
        )}

        {/* PROPOSAL VIEW */}
        {view === AppView.PROPOSAL && analysis && analysis.groupMatch.details && (
          <div className="flex-1 pb-12 pt-4 animate-in slide-in-from-bottom-12 duration-700">
            <div className="glass-liquid p-10 rounded-[4rem] space-y-10 shadow-2xl border border-white/60">
              <div className="flex items-center gap-6">
                <img src={analysis.groupMatch.therapist.imageUrl} className="w-24 h-24 rounded-[2.5rem] object-cover border-2 border-white shadow-xl" />
                <div>
                  <h4 className="text-2xl font-black text-[#316263]">{analysis.groupMatch.therapist.name}</h4>
                  <p className="text-xs font-black text-[#6AA495] uppercase tracking-widest">{analysis.groupMatch.therapist.credentials}</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-[#316263] tracking-tighter">{analysis.groupMatch.theme} Session</h3>
                <div className="flex items-center gap-2 text-[#316263] font-bold opacity-60">
                  <span className="text-xl">📅</span>
                  <span>{analysis.groupMatch.details.dateTime}</span>
                </div>
              </div>
              <div className="p-7 bg-white/60 rounded-[2.5rem] flex justify-between items-center border border-white shadow-sm">
                <span className="text-[#316263] font-black opacity-60">Co-payment</span>
                <span className="text-2xl font-black text-[#316263]">{analysis.groupMatch.details.price}</span>
              </div>
              <button 
                onClick={() => setView(AppView.PAYMENT)}
                className="w-full py-7 bg-[#316263] text-white font-bold text-xl rounded-[2.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                Reserve Seat
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT VIEW */}
        {view === AppView.PAYMENT && (
          <div className="flex-1 flex flex-col pt-8 space-y-8 animate-in fade-in">
            <div className="glass-liquid p-10 rounded-[4rem] space-y-10 shadow-2xl border border-white/60">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-black text-[#316263]">Secure Checkout</h3>
                <p className="text-sm font-bold opacity-40 text-[#316263]">Encrypted transaction via Mentra Pay</p>
              </div>
              <div className="p-7 bg-white/70 border border-white rounded-[2.5rem] flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-9 bg-[#635BFF] rounded-xl shadow-md"></div>
                  <span className="font-black text-xl text-[#316263]">•••• 4242</span>
                </div>
                <button className="text-[10px] font-black text-[#6AA495] tracking-widest bg-white/50 px-3 py-1.5 rounded-full border border-white/50">CHANGE</button>
              </div>
              <button 
                onClick={() => setView(AppView.CONFIRMED)}
                className="w-full py-7 bg-black text-white font-bold text-xl rounded-[3rem] shadow-2xl active:scale-95 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}

        {/* CONFIRMATION VIEW */}
        {view === AppView.CONFIRMED && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in zoom-in-95">
            <div className="w-40 h-40 bg-white/60 backdrop-blur-3xl text-[#6AA495] rounded-[4rem] flex items-center justify-center text-6xl shadow-2xl border-4 border-white">✓</div>
            <div className="space-y-5">
              <h2 className="text-4xl font-black text-[#316263] tracking-tighter">Confirmed.</h2>
              <p className="text-xl text-[#316263] font-bold max-w-xs mx-auto opacity-50">Your seat is reserved in the circle. Check your inbox for details.</p>
            </div>
            <button 
              onClick={() => setView(AppView.LANDING)}
              className="px-20 py-7 bg-[#316263] text-white font-bold text-xl rounded-[3rem] shadow-2xl ios-active-scale"
            >
              Return Home
            </button>
          </div>
        )}

      </main>

      {/* FLOATING CHAT INPUT */}
      {view === AppView.CHATTING && (
        <ChatInput onSend={handleSend} isLoading={isTyping} />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

export default App;