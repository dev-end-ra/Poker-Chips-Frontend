import React, { useState } from 'react';
import { Plus, LogIn, Swords, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = ({ onCreate, onJoin, initialRoomId }) => {
  const [isCreating, setIsCreating] = useState(!initialRoomId);
  const [roomId, setRoomId] = useState(initialRoomId || '');
  const [playerName, setPlayerName] = useState('');
  const [initialChips, setInitialChips] = useState('1000');

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanRoomId = roomId.trim();
    const cleanPlayerName = playerName.trim();
    
    if (!cleanRoomId || !cleanPlayerName) return;
    
    if (isCreating) {
      onCreate(cleanRoomId, parseInt(initialChips), cleanPlayerName);
    } else {
      onJoin(cleanRoomId, cleanPlayerName);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 font-['Outfit']">
      <div className="w-full max-w-md flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 mb-4">
            <Zap size={12} className="text-indigo-400" />
            <span className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">Beta v1.0</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Poker <span className="text-indigo-400">Master</span>
            <br /> Tracker
          </h1>
        </div>

        {/* Action Card */}
        <div className="bg-zinc-900/40 rounded-[2rem] p-6 border border-white/[0.05] shadow-2xl backdrop-blur-sm">
          <div className="flex gap-3 mb-6">
            <button 
              onClick={() => setIsCreating(true)}
              className={`tab-btn ${isCreating ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800/50 text-slate-500 hover:bg-zinc-800'}`}
            >
              Create
            </button>
            <button 
              onClick={() => setIsCreating(false)}
              className={`tab-btn ${!isCreating ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-zinc-800/50 text-slate-500 hover:bg-zinc-800'}`}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Room ID</label>
              <input 
                className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
                placeholder="friday-night-poker" 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Name</label>
              <input 
                className="bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
                placeholder="Alex Mercer" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
            </div>

            {isCreating && (
              <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Initial Chips</label>
                <div className="relative">
                  <input 
                    type="number"
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                    value={initialChips}
                    onChange={(e) => setInitialChips(e.target.value)}
                    required
                  />
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500/50" size={18} />
                </div>
              </div>
            )}

            <button type="submit" className="bg-indigo-600 rounded-2xl py-4 mt-2 font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
              {isCreating ? <><Plus size={20} /> Create Session</> : <><LogIn size={20} /> Enter Room</>}
            </button>
          </form>
        </div>

        {/* Compact Features */}
        <div className="flex items-center justify-center gap-4 text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-xs font-medium">Real-time Sync</span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <Swords size={14} className="text-indigo-400" />
            <span className="text-xs font-medium">Instant Join</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
