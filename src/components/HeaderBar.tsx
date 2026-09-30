import React from 'react';
import { useGame } from '../context/GameContext';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Plus, Award } from 'lucide-react';

interface HeaderBarProps {
  onOpenModerator: () => void;
  onOpenProfile: () => void;
  onOpenTopUp: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onOpenModerator,
  onOpenProfile,
  onOpenTopUp
}) => {
  const {
    playerName,
    level,
    rank,
    diamonds,
    gold,
    badges,
    soundMuted,
    toggleMute,
    serverAnnouncement,
    clearAnnouncement,
    equippedCharacter
  } = useGame();

  return (
    <header className="relative z-30 w-full bg-[#05070c]/95 border-b border-amber-500/20 backdrop-blur-xl px-3 sm:px-6 py-2 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Player Profile Badge */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2.5 bg-[#0b0f19] hover:bg-[#121826] p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-800 hover:border-amber-500/50 transition-all text-left shrink-0 shadow-lg group"
        >
          <div className="relative">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-amber-400 via-red-500 to-amber-600 p-[1.5px] shadow-lg shadow-amber-500/10">
              <div className="w-full h-full bg-[#05070a] rounded-[6px] overflow-hidden flex items-center justify-center font-teko text-xl text-amber-400">
                <img
                  src={equippedCharacter.avatar || '/src/assets/images/realistic_operator_alok_1790533631066.jpg'}
                  alt={playerName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1 rounded font-chakra tracking-tight">
              {level}
            </span>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-chakra font-bold text-sm tracking-wide text-white group-hover:text-amber-300 transition-colors truncate max-w-[130px]">
                {playerName}
              </span>
              <span className="text-[9px] bg-red-600/90 text-white font-chakra font-black px-1.5 py-0.5 rounded tracking-wider uppercase shadow">
                {rank}
              </span>
              {/* Free Fire V-Badge */}
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-black font-black text-[10px] shadow-md shadow-amber-400/40" title="Free Fire Verified Partner / Moderator">
                V
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-teko text-[13px] tracking-wide">
              <span className="text-amber-400 font-bold">CHIEF MODERATOR</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                18ms Asia
              </span>
            </div>
          </div>
        </button>

        {/* Center: Live Server Announcement Ticker */}
        {serverAnnouncement && (
          <div className="hidden md:flex flex-1 items-center justify-between bg-black/60 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-300 overflow-hidden mx-2 shadow-inner">
            <div className="flex items-center gap-2 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span className="font-chakra tracking-wide truncate">{serverAnnouncement}</span>
            </div>
            <button
              onClick={clearAnnouncement}
              className="text-amber-400/60 hover:text-amber-200 ml-2 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Right: Currencies & Moderator Suite Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Diamonds */}
          <div
            onClick={onOpenTopUp}
            className="flex items-center gap-1.5 bg-[#080d16] border border-cyan-500/40 px-2 sm:px-3 py-1 rounded-xl cursor-pointer hover:border-cyan-400 hover:shadow-cyan-500/20 hover:shadow-lg transition-all"
          >
            <span className="text-cyan-400 text-sm filter drop-shadow">💎</span>
            <span className="font-teko text-lg sm:text-xl font-bold tracking-wider text-cyan-200 tabular-nums">
              {diamonds.toLocaleString()}
            </span>
            <button
              aria-label="Add diamonds"
              className="w-4 h-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded flex items-center justify-center font-bold text-xs ml-0.5 shadow active:scale-90"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          {/* Gold */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#080d16] border border-amber-500/30 px-2.5 py-1 rounded-xl">
            <span className="text-amber-400 text-sm">🪙</span>
            <span className="font-teko text-lg sm:text-xl font-bold tracking-wider text-amber-200 tabular-nums">
              {gold.toLocaleString()}
            </span>
          </div>

          {/* Elite Badges */}
          <div className="flex items-center gap-1.5 bg-[#080d16] border border-purple-500/40 px-2 sm:px-2.5 py-1 rounded-xl">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="font-teko text-lg sm:text-xl font-bold tracking-wider text-purple-200 tabular-nums">
              {badges}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            aria-label={soundMuted ? 'Unmute' : 'Mute'}
            className="p-1.5 sm:p-2 bg-[#080d16] hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition-colors"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>

          {/* MODERATOR SUITE BUTTON ("MAIN MODERATOR HU") */}
          <button
            onClick={onOpenModerator}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 text-black px-2.5 sm:px-3.5 py-1.5 rounded-xl font-chakra font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 active:scale-95 transition-all border border-amber-300 animate-pulse-glow"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-black animate-bounce" />
            <span className="hidden sm:inline">MAIN MODERATOR HU</span>
            <span className="sm:hidden font-bold">MOD</span>
          </button>
        </div>
      </div>
    </header>
  );
};
