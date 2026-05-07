
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Cpu, Network, Terminal, Server, Bot, 
  Search, ChevronRight, Github, Instagram, Twitter, Menu, X 
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-black/70 backdrop-blur-2xl py-4 border-b border-white/10' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
            <Bot size={26} color="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">TKJ AI</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-gray-400">
          <a href="#home" className="hover:text-pink-400 transition-colors">Home</a>
          <a href="#features" className="hover:text-pink-400 transition-colors">Features</a>
          <a href="#chat" className="hover:text-pink-400 transition-colors">AI Chat</a>
          <a href="#about" className="hover:text-pink-400 transition-colors">About</a>
          <button className="bg-white text-black px-6 py-2.5 rounded-full hover:scale-105 transition-all active:scale-95 font-bold shadow-xl shadow-white/10">
            CONTACT
          </button>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

const ChatSection = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Halo Expert TKJ! Saya asisten AI SMKN 1 Mojokerto. Tanyakan apa saja tentang MikroTik, Cisco, atau Server.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text || 'Gagal terhubung.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Koneksi error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="chat" className="py-24 px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl flex flex-col h-[650px]">
          <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <div>
                <h3 className="font-bold text-sm tracking-widest uppercase">TKJ AI Assistant</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Engine: Gemini 2.5 Flash</p>
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8">
            {messages.map((msg, idx) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 border border-white/10 text-gray-200'}`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isLoading && <div className="text-xs text-pink-400 font-bold animate-pulse p-4">AI sedang berpikir...</div>}
          </div>

          <div className="p-8 bg-black/40 border-t border-white/10">
            <div className="relative flex items-center">
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Tanyakan konfigurasi VLAN atau routing..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-7 pr-20 focus:outline-none focus:border-pink-500/50 transition-all text-white"
              />
              <button onClick={handleSend} className="absolute right-3 w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-pink-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <Navbar />

      <main className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center pt-32 px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 px-5 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-pink-500">
            SMKN 1 MOJOKERTO • TKJ
          </motion.div>
          <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85]">
            FUTURE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">NETWORK.</span>
          </motion.h1>
          <p className="text-gray-500 max-w-xl text-sm md:text-base mb-12 font-medium tracking-wide">
            Eksplorasi dunia jaringan dan server lebih cerdas dengan AI khusus kurikulum Teknik Komputer dan Jaringan.
          </p>
          <div className="flex gap-5">
            <a href="#chat" className="bg-white text-black px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:invert transition-all">Start Assistant</a>
          </div>
          
          <div className="mt-24 w-full max-w-5xl aspect-video bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[3rem] p-3 relative shadow-2xl">
            <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden flex items-center justify-center opacity-60">
              <Cpu size={100} className="text-white/5 animate-pulse" />
            </div>
          </div>
        </section>

        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Network, t: 'MikroTik Expert', d: 'Panduan lengkap konfigurasi RouterOS.' },
              { icon: Server, t: 'Linux Admin', d: 'Bantuan setup server Debian & Ubuntu.' },
              { icon: Terminal, t: 'Code Network', d: 'Otomasi jaringan dengan Python.' }
            ].map((f, i) => (
              <div key={i} className="p-10 bg-white/[0.02] border border-white/10 rounded-[2.5rem] hover:bg-white/[0.05] transition-all">
                <f.icon className="text-pink-500 mb-6" size={32} />
                <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">{f.t}</h4>
                <p className="text-gray-500 text-sm">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <ChatSection />
      </main>

      <footer className="py-20 border-t border-white/10 text-center text-[10px] font-bold text-gray-600 tracking-[0.4em] uppercase">
        © 2024 SMKN 1 MOJOKERTO • TKJ TEAM
      </footer>
    </div>
  );
};

export default App;
