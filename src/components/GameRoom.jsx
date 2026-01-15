import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Coins, 
  Share2, 
  LogOut, 
  Trophy, 
  History, 
  Wallet, 
  UserCircle, 
  Volume2, 
  VolumeX,
  RotateCcw,
  X 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const GameRoom = ({ room, socket, playerName }) => {
  const [betAmount, setBetAmount] = useState('10');
  const [showQR, setShowQR] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectingWinner, setSelectingWinner] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  
  const lastLogRef = useRef(room.logs[0]);
  const audioRefs = useRef({
    bet: new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_c352c858c2.mp3'),
    win: new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_338a06558e.mp3'),
    reset: new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_783ef2875b.mp3')
  });

  // Pre-load sounds and handle interaction unlock
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.load();
      audio.volume = 0.5;
    });

    const unlockAudio = () => {
      if (!audioUnlocked) {
        Object.values(audioRefs.current).forEach(audio => {
          audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
          }).catch(() => {});
        });
        setAudioUnlocked(true);
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
      }
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, [audioUnlocked]);

  useEffect(() => {
    if (isMuted) return;

    const newLog = room.logs[0];
    if (newLog && newLog !== lastLogRef.current) {
      if (newLog.includes('bet')) {
        audioRefs.current.bet.currentTime = 0;
        audioRefs.current.bet.play().catch(() => {});
      } else if (newLog.includes('won the pot')) {
        audioRefs.current.win.currentTime = 0;
        audioRefs.current.win.play().catch(() => {});
      } else if (newLog.includes('Reset') || newLog.includes('Game reset')) {
        audioRefs.current.reset.currentTime = 0;
        audioRefs.current.reset.play().catch(() => {});
      }
      lastLogRef.current = newLog;
    }
  }, [room.logs, isMuted]);

  const currentPlayer = room.players.find(p => p.name === playerName);
  const isHost = room.hostId === socket.id;
  const shareUrl = window.location.origin + '?room=' + room.id;

  const handleBet = () => {
    const amount = parseInt(betAmount);
    if (currentPlayer && currentPlayer.chips >= amount) {
      socket.emit('place-bet', { roomId: room.id, amount });
    }
  };

  const handleWin = (winnerId) => {
    socket.emit('win-pot', { roomId: room.id, winnerId });
    setSelectingWinner(false);
  };

  const handleReset = () => {
    if (confirm("Reset everyone's chips back to initial amount?")) {
      socket.emit('reset-game', room.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen bg-[#09090b] text-white flex flex-col font-['Outfit']">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Coins size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold uppercase">Room: {room.id}</h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1">
              Syncing Live <span className="animate-pulse">⚡</span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border transition-all ${isMuted ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-zinc-900 border-white/5 text-slate-400'}`}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button 
            onClick={() => setShowQR(!showQR)}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-slate-400 hover:bg-zinc-800 transition-all"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="flex-1 p-4 flex flex-col gap-4 relative">
        {/* Modals/Overlays */}
        {showQR && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-zinc-900 border border-indigo-500/30 rounded-[2rem] p-6 w-full max-w-sm flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between w-full items-center">
                <h3 className="text-lg font-bold">Invite Players</h3>
                <button onClick={() => setShowQR(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-2xl">
                <QRCodeSVG value={shareUrl} size={150} />
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all active:scale-95"
              >
                Copy Join Link
              </button>
            </div>
          </div>
        )}

        {selectingWinner && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-zinc-900 border border-indigo-500/30 rounded-[2rem] p-6 w-full max-w-sm flex flex-col gap-4 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">Who Won?</h3>
                <button onClick={() => setSelectingWinner(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {room.players.map(player => (
                  <button 
                    key={player.id} 
                    onClick={() => handleWin(player.id)}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <UserCircle size={20} className="text-indigo-400" />
                      <span className="font-bold">{player.name}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">{player.chips}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Top Half: Pot and Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-12 lg:col-span-5 bg-zinc-900/40 rounded-[1.5rem] border border-white/5 p-6 flex flex-col items-center justify-center relative overflow-hidden group min-h-[140px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/5 blur-3xl group-hover:bg-amber-500/10 transition-all duration-700" />
            <div className="bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/20 mb-2">
              <span className="text-amber-500 text-[9px] font-bold tracking-widest uppercase">Central Pot</span>
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <Trophy size={40} className="text-amber-500 drop-shadow-glow-gold" />
              <h1 className="text-6xl font-bold text-gradient-gold leading-none">{room.pot}</h1>
            </div>
            {room.pot > 0 && isHost && (
              <button 
                onClick={() => setSelectingWinner(true)}
                className="mt-3 bg-amber-500 text-black text-[10px] font-bold px-4 py-1.5 rounded-lg hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                AWARD POT
              </button>
            )}
          </div>

          <div className="sm:col-span-12 lg:col-span-7 bg-indigo-600/[0.03] rounded-[1.5rem] border border-indigo-500/10 p-6 flex flex-col justify-center min-h-[140px]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <UserCircle size={20} className="text-indigo-400" />
                <span className="font-bold text-base">{playerName}</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/10">
                <Wallet size={14} className="text-emerald-500" />
                <span className="text-emerald-400 font-bold text-xl leading-none">{currentPlayer?.chips || 0}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                type="number" 
                className="flex-1 min-w-[100px] bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-indigo-500/30 text-lg"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
              />
              <button 
                onClick={handleBet}
                disabled={!currentPlayer || currentPlayer.chips < parseInt(betAmount) || parseInt(betAmount) <= 0}
                className="bg-indigo-600 px-8 rounded-xl font-bold text-base shadow-lg hover:bg-indigo-500 disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap"
              >
                BET
              </button>
            </div>
          </div>
        </div>

        {/* Players Section */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[10px] font-bold text-slate-500 tracking-[2px] uppercase flex items-center gap-2 ml-1">
            <Users size={12} /> Live Players
          </h3>
          <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar no-scrollbar">
            {room.players.map(player => (
              <div key={player.id} className="flex-shrink-0 flex items-center bg-zinc-800/40 px-3 py-2 rounded-xl gap-2 border border-white/5 relative group">
                <div className={`w-2 h-2 rounded-full ${player.chips > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none max-w-[80px] truncate">{player.name}</span>
                  <span className="text-[10px] font-bold text-emerald-400">{player.chips}</span>
                </div>
                {player.id === room.hostId && <span className="text-[8px] font-bold text-indigo-400 border border-indigo-400/20 px-1 rounded">H</span>}
                {room.pot > 0 && isHost && (
                  <button 
                    onClick={() => handleWin(player.id)}
                    className="ml-1 p-1 bg-amber-500/10 text-amber-500 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-black"
                  >
                    <Trophy size={10} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 bg-zinc-900/20 border border-white/[0.03] rounded-[1.5rem] p-4 flex flex-col gap-3 min-h-[200px] overflow-hidden">
          <h3 className="text-[10px] font-bold text-slate-500 tracking-[2px] uppercase flex items-center gap-2">
            <History size={12} /> Activity
          </h3>
          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
            {room.logs.map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-zinc-950/30 border-l-2 border-indigo-500/30 text-slate-400 animate-in slide-in-from-left-1 duration-300">
                <span className="text-[11px] leading-relaxed italic">{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Reset */}
        {isHost && (
          <button 
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 py-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all group active:scale-95 mb-2"
          >
            <RotateCcw size={14} className="group-hover:rotate-[-45deg] transition-all" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Reset Game Data</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default GameRoom;
