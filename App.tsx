import React, { useState, useEffect, useRef } from 'react';
import { View as AppView, Message, AnalysisResponse } from './types';
import { Icons, COLORS } from './constants';
import Mascot from './components/Mascot';
import ChatInput from './components/ChatInput';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [hasBookedSession, setHasBookedSession] = useState(false);
  const [bookedSessionTime, setBookedSessionTime] = useState<string | null>(null);
  const [isSessionAccepted, setIsSessionAccepted] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'In' | 'Hold' | 'Out'>('In');
  
  // Payment Form States
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  const generateRandomSession = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const day = days[Math.floor(Math.random() * days.length)];
    const hour = Math.floor(Math.random() * 8) + 9;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${day}, ${displayHour}:00 ${ampm}`;
  };

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
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, view]);

  const startChat = async () => {
    setView(AppView.CHATTING);
    if (messages.length === 0) {
      setIsTyping(true);
      try {
        const aiResponseText = await geminiService.getResponse([{ 
          role: 'user', 
          content: 'Hello Mentra. I am here.' 
        }]);
        setMessages([{ id: Date.now().toString(), role: 'assistant', content: aiResponseText }]);
      } catch (err: any) {
        console.error("Initial Greeting Error:", err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSend = async (text: string) => {
    if (view === AppView.LANDING) setView(AppView.CHATTING);
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    try {
      const aiResponseText = await geminiService.getResponse([...messages, userMsg]);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponseText }]);
    } catch (err: any) {
      console.error("AI Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndChat = async () => {
    if (messages.length < 2) {
      handleReset();
      return;
    }
    
    setView(AppView.ANALYZING);
    try {
      const history = messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const result = await geminiService.analyzeMentalState(history);
      setAnalysis(result);
      setTimeout(() => setView(AppView.TRIAGE), 2500);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setView(AppView.LANDING);
    }
  };

  const handleReserve = async () => {
    if (!analysis) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setBookedSessionTime(generateRandomSession());
    setHasBookedSession(true);
    setView(AppView.CONFIRMED);
  };

  const handleAcceptTime = () => {
    setIsSessionAccepted(true);
    setView(AppView.PAYMENT);
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return v;
  };

  const formatExpiry = (val: string) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || cardNumber.replace(/\s/g, '').length < 16 || !expiry || cvv.length < 3) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsSaving(false);
    setIsPaymentConfirmed(true);
    setView(AppView.CONFIRMED);
  };

  const handleReset = () => {
    setView(AppView.LANDING);
    setMessages([]);
    setAnalysis(null);
    setIsTyping(false);
    setIsBreathing(false);
    setCardName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  const isFormValid = cardName && cardNumber.replace(/\s/g, '').length >= 16 && expiry.length >= 5 && cvv.length >= 3;

  return (
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-transparent">
      
      <header className="sticky top-0 px-6 py-6 flex items-center justify-between z-[60] organic-header">
        <div className="flex items-center gap-4">
          {view !== AppView.LANDING && view !== AppView.CONFIRMED && (
            <button 
              onClick={handleReset}
              className="w-10 h-10 flex items-center justify-center bg-white/60 border border-[#D8E2DC] rounded-full hover:bg-white/80 transition-all shadow-sm"
            >
              <Icons.Back />
            </button>
          )}
          <h1 className="text-sm font-bold tracking-[0.25em] text-[#1B4332]/50">MENTRA</h1>
        </div>

        {view === AppView.CHATTING && messages.length >= 1 && (
          <button 
            onClick={handleEndChat}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B4332] text-[#F4F7F5] text-xs font-bold uppercase tracking-[0.15em] rounded-full hover:bg-[#2D6A4F] transition-all shadow-md animate-in fade-in active:scale-95"
          >
            <Icons.Finish />
            <span>End Session</span>
          </button>
        )}
      </header>

      <main 
        className="relative z-10 flex-1 flex flex-col overflow-y-auto px-6 custom-scrollbar"
      >
        {view === AppView.LANDING && (
          <div className="flex-1 flex flex-col space-y-8 pt-10 pb-12">
            <div className="flex justify-between items-end gap-4 min-h-[100px]">
              <div className="space-y-1">
                <p className="text-[#52796F] text-xs font-bold uppercase tracking-[0.2em]">Ready when you are,</p>
                <h1 className="text-[#1B4332] text-7xl font-serif font-semibold tracking-tight leading-[0.9]">Alex</h1>
              </div>

              <div className="organic-card p-4 flex flex-col space-y-2 min-w-[180px] animate-in fade-in slide-in-from-right-4 duration-700 relative overflow-hidden">
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[9px] font-bold text-[#52796F] uppercase tracking-[0.15em]">🗓️ Status</span>
                  {hasBookedSession && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isPaymentConfirmed ? 'bg-[#2D6A4F]' : 'bg-[#D8E2DC] animate-pulse'}`}></span>
                  )}
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors ${
                    isPaymentConfirmed ? 'bg-[#D8E2DC]/30' : (hasBookedSession ? 'bg-[#2D6A4F]/10' : 'bg-[#1B4332]/5')
                  }`}>
                    {isPaymentConfirmed ? '✅' : (hasBookedSession ? '🧘' : '☁️')}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[13px] font-serif font-semibold text-[#1B4332] leading-none mb-1">
                      {isPaymentConfirmed ? "Confirmed" : (hasBookedSession ? "Proposed" : "Quiet")}
                    </h4>
                    <p className="text-[9px] text-[#52796F]/70 font-bold uppercase tracking-tighter">
                      {bookedSessionTime || "No sessions"}
                    </p>
                  </div>
                </div>

                {hasBookedSession && !isSessionAccepted && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2 relative z-10">
                    <button 
                      onClick={handleAcceptTime}
                      className="w-full py-1.5 bg-[#1B4332] text-[#F4F7F5] text-[9px] font-bold uppercase tracking-widest rounded-md hover:bg-[#2D6A4F] transition-all shadow-sm active:scale-95"
                    >
                      Accept Time
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="organic-card px-8 py-12">
              <p className="text-3xl font-serif font-light leading-snug text-[#1B4332]/85 italic">
                Your presence is your power.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="organic-card p-7 flex flex-col justify-between aspect-square">
                <span className="text-[10px] font-bold text-[#52796F] uppercase tracking-widest">Biometric</span>
                <div>
                  <h4 className="text-2xl font-serif font-semibold text-[#1B4332] leading-tight">
                    {analysis ? analysis.theme : "Balanced"}
                  </h4>
                  <p className="text-[11px] font-bold opacity-30 uppercase tracking-tighter">Current Flow</p>
                </div>
              </div>

              <div className="organic-card p-7 flex flex-col items-center justify-center aspect-square text-center">
                <span className="text-5xl font-serif font-bold text-[#1B4332]">03</span>
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-40 text-[#1B4332] mt-2">Streaks</span>
                <div className="w-full h-[3px] bg-[#1B4332]/10 mt-5 rounded-full">
                  <div className="h-full bg-[#2D6A4F]/60" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div 
                onClick={() => setIsBreathing(!isBreathing)}
                className={`col-span-2 p-10 transition-all duration-700 cursor-pointer flex items-center justify-between rounded-[36px] relative overflow-hidden ${isBreathing ? 'shadow-2xl scale-[1.02]' : 'organic-card'}`}
              >
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isBreathing ? 'opacity-100' : 'opacity-0'} bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#1B4332] bg-[length:400%_400%] animate-flow-bg`}></div>
                <div className="flex items-center gap-8 relative z-10">
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-[4000ms] ${isBreathing ? (breathPhase === 'In' ? 'scale-150 opacity-100 border-[#F4F7F5]' : 'scale-90 opacity-40 border-[#F4F7F5]/50') : 'opacity-10 border-[#1B4332]'}`}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      {isBreathing ? '✨' : '🍃'}
                    </div>
                  </div>
                  <div>
                    <h4 className={`font-serif font-semibold text-xl uppercase tracking-widest transition-colors duration-700 ${isBreathing ? 'text-[#F4F7F5]' : 'text-[#1B4332]'}`}>
                      {isBreathing ? breathPhase : 'Somatic Flow'}
                    </h4>
                    <p className={`text-[11px] font-bold uppercase tracking-tighter transition-colors duration-700 ${isBreathing ? 'text-white/40' : 'opacity-30'}`}>
                      Calibration
                    </p>
                  </div>
                </div>
              </div>

              <div 
                onClick={startChat}
                className="col-span-2 organic-card p-14 flex flex-col items-center hover:bg-white/40 transition-all cursor-pointer group"
              >
                <div className="w-44 h-44 mb-12 transition-transform group-hover:scale-110">
                  <Mascot isDocked />
                </div>
                <button className="w-full py-6 bg-[#2D6A4F] text-[#F4F7F5] font-serif font-semibold text-xl tracking-widest rounded-full shadow-lg active:scale-95 transition-all uppercase">
                  Engage Portal
                </button>
              </div>
            </div>
            <div className="h-24 shrink-0"></div>
          </div>
        )}

        {view === AppView.CHATTING && (
          <div className="flex-1 flex flex-col h-full pt-8">
            <div className="h-[10%] flex items-center justify-center shrink-0 mb-8">
              <div className="w-20 h-20 bg-white/60 backdrop-blur-md rounded-full flex items-center justify-center p-4 border border-[#D8E2DC] shadow-md">
                <Mascot isDocked />
              </div>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-5 pt-2 pb-36 overflow-y-auto custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-flow`}
                >
                  <div className={`max-w-[85%] px-7 py-5 rounded-[30px] text-base leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#1B4332] text-[#F4F7F5] font-medium shadow-md' 
                      : 'bg-white/95 backdrop-blur-md text-[#1B4332] border border-[#D8E2DC]/40 shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-message-flow">
                  <div className="bg-white/60 backdrop-blur-md px-6 py-5 rounded-[30px] flex gap-2 border border-[#D8E2DC]/40 shadow-sm">
                    <div className="w-1.5 h-1.5 bg-[#1B4332] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#1B4332] rounded-full animate-bounce [animation-delay:150ms]"></div>
                    <div className="w-1.5 h-1.5 bg-[#1B4332] rounded-full animate-bounce [animation-delay:300ms]"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {view === AppView.ANALYZING && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
            <div className="w-24 h-24 border-t-2 border-[#1B4332] flex items-center justify-center animate-spin-slow rounded-full opacity-40">
              <span className="text-4xl animate-pulse">🍃</span>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-serif font-semibold text-[#1B4332] tracking-widest uppercase">Deep Triage</h3>
              <p className="text-[11px] font-bold opacity-30 uppercase tracking-widest text-[#52796F]">Synthesis</p>
            </div>
          </div>
        )}

        {view === AppView.TRIAGE && analysis && (
          <div className="flex-1 flex flex-col space-y-8 pt-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="space-y-2">
              <p className="text-[#52796F] text-xs font-bold uppercase tracking-[0.2em]">Match Found</p>
              <h2 className="text-[#1B4332] text-4xl font-serif font-semibold leading-tight">Your Mentra Path</h2>
            </div>

            <div className="organic-card p-8 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-[#D8E2DC]/30 flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-sm">
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#1B4332]">{analysis.groupMatch.therapist.name}</h3>
                  <p className="text-xs font-bold text-[#52796F] uppercase tracking-widest">{analysis.groupMatch.therapist.credentials}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-[#D8E2DC]/30">
                <p className="text-[#1B4332]/80 text-lg leading-relaxed italic font-serif">
                  "{analysis.groupMatch.description}"
                </p>
              </div>
            </div>

            <div className="organic-card p-8 space-y-4">
              <h4 className="text-[10px] font-bold text-[#52796F] uppercase tracking-[0.2em]">Mentra Insight</h4>
              <p className="text-[#1B4332]/75 text-sm leading-relaxed">
                {analysis.insight}
              </p>
            </div>

            <button 
              onClick={handleReserve}
              disabled={isSaving}
              className={`w-full py-6 bg-[#2D6A4F] text-[#F4F7F5] font-serif font-semibold text-xl tracking-widest rounded-full shadow-lg active:scale-95 transition-all uppercase mt-4 flex items-center justify-center ${isSaving ? 'opacity-70 grayscale' : ''}`}
            >
              {isSaving ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin rounded-full"></div>
                  <span>Syncing...</span>
                </div>
              ) : 'Reserve Session'}
            </button>
          </div>
        )}

        {view === AppView.PAYMENT && (
          <div className="flex-1 flex flex-col space-y-8 pt-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <p className="text-[#52796F] text-xs font-bold uppercase tracking-[0.2em]">Secure Checkout</p>
              <h2 className="text-[#1B4332] text-4xl font-serif font-semibold leading-tight">Connection Fee</h2>
            </div>

            <div className="organic-card p-6 space-y-4 bg-white/40">
              <div className="flex justify-between items-center text-[#1B4332]">
                <span className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">Mentra Guidance</span>
                <span className="font-serif font-bold text-2xl">$50.00</span>
              </div>
              <p className="text-[11px] text-[#52796F] leading-relaxed font-medium">
                One hour intensive cycle with {analysis?.groupMatch?.therapist?.name}. 
                Scheduled for <span className="text-[#1B4332] font-bold">{bookedSessionTime}</span>.
              </p>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#52796F] uppercase tracking-widest px-4">Cardholder Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="ALEX MENTRA"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="w-full bg-white/80 border border-[#D8E2DC] rounded-3xl px-6 py-4 text-[#1B4332] font-serif font-bold placeholder-[#D8E2DC] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#52796F] uppercase tracking-widest px-4">Card Number</label>
                  <input 
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full bg-white/80 border border-[#D8E2DC] rounded-3xl px-6 py-4 text-[#1B4332] font-serif font-bold placeholder-[#D8E2DC] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#52796F] uppercase tracking-widest px-4">Expiry</label>
                    <input 
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className="w-full bg-white/80 border border-[#D8E2DC] rounded-3xl px-6 py-4 text-[#1B4332] font-serif font-bold placeholder-[#D8E2DC] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#52796F] uppercase tracking-widest px-4">CVV</label>
                    <input 
                      type="password"
                      required
                      placeholder="***"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white/80 border border-[#D8E2DC] rounded-3xl px-6 py-4 text-[#1B4332] font-serif font-bold placeholder-[#D8E2DC] focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSaving || !isFormValid}
                  className={`w-full py-6 bg-[#1B4332] text-[#F4F7F5] font-serif font-semibold text-xl tracking-widest rounded-full shadow-xl active:scale-95 transition-all uppercase flex items-center justify-center ${isSaving || !isFormValid ? 'opacity-50 grayscale' : ''}`}
                >
                  {isSaving ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-[#F4F7F5]/30 border-t-[#F4F7F5] animate-spin rounded-full"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : 'Confirm and Pay'}
                </button>
              </div>
            </form>
          </div>
        )}

        {view === AppView.CONFIRMED && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
            <div className="w-32 h-32 bg-white/60 rounded-full flex items-center justify-center text-6xl shadow-inner border border-[#D8E2DC]">
              {isPaymentConfirmed ? '🌿' : '🍃'}
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-serif font-bold text-[#1B4332]">
                {isPaymentConfirmed ? "Cycle Secured" : "Path Reserved"}
              </h2>
              <p className="text-[#52796F] max-w-xs mx-auto text-lg leading-relaxed">
                {isPaymentConfirmed 
                  ? "Your session is fully confirmed. We've synchronized your digital calendar for this cycle." 
                  : "Your presence has been noted. You will be notified when your session cycle begins."}
              </p>
            </div>
            <button 
              onClick={handleReset}
              className="px-10 py-4 border-2 border-[#1B4332]/20 text-[#1B4332] font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white/40 transition-all"
            >
              Return Home
            </button>
          </div>
        )}
      </main>

      {view === AppView.CHATTING && (
        <ChatInput onSend={handleSend} isLoading={isTyping} />
      )}

      <style>{`
        @keyframes flow-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-flow-bg {
          animation: flow-bg 8s ease infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 0px; }
        @keyframes message-flow-in {
          0% { opacity: 0; transform: translateY(24px) scale(0.95); filter: blur(4px); }
          60% { transform: translateY(-2px) scale(1.02); filter: blur(0px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .animate-message-flow {
          animation: message-flow-in 0.65s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-in { animation-duration: 0.7s; animation-fill-mode: both; }
        .fade-in { animation-name: fade-in-kf; }
        @keyframes fade-in-kf { from { opacity: 0; } to { opacity: 1; } }
        .slide-in-from-bottom-4 { animation-name: slide-in-bottom-kf; }
        .slide-in-from-right-4 { animation-name: slide-in-right-kf; }
        .slide-in-from-top-2 { animation-name: slide-in-top-kf; }
        @keyframes slide-in-top-kf { from { transform: translateY(-0.5rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slide-in-right-kf { from { transform: translateX(1rem); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slide-in-bottom-kf { from { transform: translateY(1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .zoom-in-95 { animation-name: zoom-in-kf; }
        @keyframes zoom-in-kf { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
};

export default App;