import React, { useState } from 'react';
import { Plus, LogIn, Swords, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = ({ onCreate, onJoin, initialRoomId }) => {
  const [isCreating, setIsCreating] = useState(!initialRoomId);
  const [roomId, setRoomId] = useState(initialRoomId || '');
  const [playerName, setPlayerName] = useState('');
  const [initialChips, setInitialChips] = useState(1000);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId || !playerName) return;
    if (isCreating) {
      onCreate(roomId, initialChips, playerName);
    } else {
      onJoin(roomId, playerName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        {/* Left Side: Branding/Intro */}
        <div className="flex flex-col justify-center space-y-6 md:space-y-8 p-2 md:p-4 text-center lg:text-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/20 mx-auto lg:mx-0">
              <Zap size={14} /> Beta v1.0
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
              Poker <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-500">Master</span>
              <br /> Tracker
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-sm mx-auto lg:mx-0">
              Level up your physical poker nights with real-time chip management.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 items-center lg:items-start">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="bg-emerald-500/20 p-2 rounded-lg"><ShieldCheck size={18} className="text-emerald-500" /></div>
              <span className="text-sm md:text-base font-medium">Secure & Real-time Sync</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="bg-indigo-500/20 p-2 rounded-lg"><Swords size={18} className="text-indigo-400" /></div>
              <span className="text-sm md:text-base font-medium">Join via Link or SMS</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Card */}
        <div className="bento-card relative">
          <div className="flex gap-2 md:gap-4 mb-6 md:mb-8">
            <button 
              onClick={() => setIsCreating(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${isCreating ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-800/50 text-slate-500 hover:bg-zinc-800'}`}
            >
              Create
            </button>
            <button 
              onClick={() => setIsCreating(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${!isCreating ? 'bg-indigo-600 text-white shadow-lg' : 'bg-zinc-800/50 text-slate-500 hover:bg-zinc-800'}`}
            >
              Join
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 ml-1 text-slate-500 uppercase tracking-wider">Room ID</label>
              <input 
                className="input-vibrant" 
                placeholder="friday-night-poker" 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 ml-1 text-slate-500 uppercase tracking-wider">Your Name</label>
              <input 
                className="input-vibrant" 
                placeholder="Alex Mercer" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
              />
            </div>

            {isCreating && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                <label className="block text-xs font-semibold mb-2 ml-1 text-slate-500 uppercase tracking-wider">Initial Chips</label>
                <div className="relative">
                  <input 
                    type="number"
                    className="input-vibrant pl-10 md:pl-12" 
                    value={initialChips}
                    onChange={(e) => setInitialChips(Number(e.target.value))}
                    required
                  />
                  <ShieldCheck className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-emerald-500/50" size={18} />
                </div>
              </div>
            )}

            <button type="submit" className="w-full btn-primary-vibrant text-base md:text-lg py-4 md:py-5 mt-2">
              {isCreating ? <><Plus size={20} /> Create Session</> : <><LogIn size={20} /> Enter Room</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
