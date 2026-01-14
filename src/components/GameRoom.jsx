import React, { useState } from 'react';
import { Users, Coins, Share2, LogOut, Trophy, History, Wallet, UserCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const GameRoom = ({ room, socket, playerName }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [showQR, setShowQR] = useState(false);
  
  const currentPlayer = room.players.find(p => p.name === playerName);
  const shareUrl = window.location.origin + '?room=' + room.id;

  const handleBet = (amount) => {
    if (currentPlayer && currentPlayer.chips >= amount) {
      socket.emit('place-bet', { roomId: room.id, amount });
    }
  };

  const handleWin = (winnerId) => {
    socket.emit('win-pot', { roomId: room.id, winnerId });
  };

  const handleReset = () => {
    if (confirm('Reset everyone\'s chips back to initial amount?')) {
      socket.emit('reset-game', room.id);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto p-3 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* Navbar Section */}
      <nav className="flex items-center justify-between p-1 md:p-2">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="bg-indigo-600 p-2 md:p-3 rounded-xl md:rounded-2xl shadow-lg shadow-indigo-500/20">
            <Coins className="text-white" size={20} md={24} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">Room: {room.id}</h2>
            <p className="text-[10px] md:text-xs font-semibold text-slate-500 tracking-widest uppercase">Syncing Live ⚡</p>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button 
            onClick={() => setShowQR(!showQR)} 
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-colors text-slate-300"
          >
            <Share2 size={18} md={20} />
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-colors"
          >
            <LogOut size={18} md={20} />
          </button>
        </div>
      </nav>

      {showQR && (
        <div className="bento-card flex flex-col items-center gap-4 md:gap-6 animate-in zoom-in-95 duration-300 border-indigo-500/30">
          <h3 className="text-lg md:text-xl font-bold">Invite Players</h3>
          <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl">
            <QRCodeSVG value={shareUrl} size={150} md={180} />
          </div>
          <p className="text-xs md:text-sm text-slate-400 font-medium text-center">Scan code or share URL below</p>
          <div className="flex w-full max-w-md gap-2 md:gap-3">
            <input readOnly value={shareUrl} className="input-vibrant text-[10px] md:text-xs py-2 md:py-3 bg-zinc-900" />
            <button className="btn-primary-vibrant py-2 md:py-3 px-4 md:px-6 text-xs md:text-sm" onClick={() => navigator.clipboard.writeText(shareUrl)}>
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* Left Column: Pot & Betting */}
        <div className="lg:col-span-8 flex flex-col gap-4 md:gap-6">
          
          {/* TOTAL POT CARD - HIGHLIGHTED */}
          <div className="bento-card overflow-hidden relative group min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center text-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-amber-500/10 blur-[100px] group-hover:bg-amber-500/20 transition-all duration-700" />
            
            <div className="relative z-10 space-y-2 md:space-y-4">
              <span className="bg-amber-500/10 text-amber-500 px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-bold tracking-[3px] md:tracking-[4px] uppercase border border-amber-500/20 shadow-glow-gold mb-2 md:mb-4 inline-block">
                CENTRAL POT
              </span>
              <div className="flex items-center justify-center gap-2 md:gap-4">
                <Trophy size={40} md={64} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                <h1 className="text-6xl md:text-9xl font-bold text-gradient-gold">
                  {room.pot}
                </h1>
              </div>
              <p className="text-slate-500 font-semibold uppercase tracking-widest text-[10px] md:text-sm">Waiting for winner...</p>
            </div>
          </div>

          {/* PLAYER CONTROLS CARD */}
          <div className="bento-card bg-indigo-600/[0.03] border-indigo-500/10 p-4 md:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="space-y-1">
                <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <UserCircle className="text-indigo-400" size={20} /> {playerName}
                </h3>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Active Connection</p>
              </div>
              <div className="w-full sm:w-auto bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl flex items-center justify-between sm:justify-start gap-3">
                <div className="flex items-center gap-2">
                  <Wallet className="text-emerald-500" size={18} md={20} />
                  <span className="text-sm md:text-xs font-bold text-slate-500 uppercase">My Chips</span>
                </div>
                <span className="text-xl md:text-2xl font-bold text-emerald-400">{currentPlayer?.chips || 0}</span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-widest">Select Bet Amount</span>
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-indigo-500/20">
                  MAX: {currentPlayer?.chips || 0}
                </span>
              </div>
              <input 
                type="range"
                min="0"
                max={currentPlayer?.chips || 0}
                step="1"
                className="w-full h-2 md:h-3 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all border border-white/5"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
              />
              <div className="flex justify-between text-[8px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">
                <span>0</span>
                <span>{Math.floor((currentPlayer?.chips || 0) / 2)}</span>
                <span>{currentPlayer?.chips || 0}</span>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <div className="relative flex-1">
                <input 
                  type="number" 
                  className="input-vibrant px-4 md:px-8 text-xl md:text-2xl font-bold w-full" 
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.min(Number(e.target.value), currentPlayer?.chips || 0))}
                />
                <span className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-500">CHIPS</span>
              </div>
              <button 
                onClick={() => handleBet(betAmount)}
                disabled={!currentPlayer || currentPlayer.chips < betAmount || betAmount <= 0}
                className="btn-primary-vibrant w-full sm:w-auto px-8 md:px-12 text-sm md:text-xl py-3 md:py-5"
              >
                PLACE BET
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Player List & Logs */}
        <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
          
          {/* PLAYER LIST CARD */}
          <div className="bento-card">
            <h3 className="text-[10px] font-semibold text-slate-500 tracking-[2px] md:tracking-[3px] uppercase mb-4 md:mb-6 flex items-center gap-2">
              <Users size={12} md={14} /> LIVE PLAYERS
            </h3>
            <div className="space-y-3 md:space-y-4 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
              {room.players.map(player => (
                <div key={player.id} className="flex items-center justify-between p-3 md:p-4 rounded-2xl md:rounded-3xl bg-zinc-950/50 border border-white/5 group hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${player.chips > 0 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                    <div>
                      <div className="font-bold text-xs md:text-sm tracking-tight">{player.name}</div>
                      <div className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Wallet size={8} md={10} /> {player.chips}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {player.bet > 0 && (
                      <span className="text-[8px] md:text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2 py-0.5 md:px-3 md:py-1 rounded-full border border-indigo-500/10">
                        BET: {player.bet}
                      </span>
                    )}
                    {room.pot > 0 && (
                      <button 
                        onClick={() => handleWin(player.id)}
                        className="p-2 md:p-3 bg-amber-500/10 text-amber-500 rounded-lg md:rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-glow-gold sm:opacity-0 group-hover:opacity-100"
                        title="Award Pot"
                      >
                        <Trophy size={14} md={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVITY FEED CARD */}
          <div className="bento-card flex-1 min-h-[200px] md:min-h-[250px] flex flex-col">
            <h3 className="text-[10px] font-semibold text-slate-500 tracking-[2px] md:tracking-[3px] uppercase mb-4 md:mb-6 flex items-center gap-2">
              <History size={12} md={14} /> ACTIVITY FEED
            </h3>
            <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto pr-1 md:pr-2 custom-scrollbar text-[10px] md:text-xs">
              {room.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-xl md:rounded-2xl bg-zinc-950/30 text-slate-400 border-l-[2px] md:border-l-[3px] border-indigo-500/30">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 mt-1" />
                  <span className="font-medium leading-relaxed">{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RESET ACTION */}
          <button 
            onClick={handleReset}
            className="w-full py-4 md:py-5 rounded-2xl md:rounded-3xl bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white font-bold tracking-widest uppercase text-[9px] md:text-[10px] transition-all duration-300"
          >
            RESET ALL CHIPS
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
