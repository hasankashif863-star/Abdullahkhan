import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import { User, Award, Shield, Target, Plus, Check, X } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'topup';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'profile'
}) => {
  const {
    playerName,
    setPlayerName,
    level,
    rank,
    diamonds,
    gold,
    badges,
    equippedCharacter,
    addDiamonds
  } = useGame();

  const [activeTab, setActiveTab] = useState<'profile' | 'topup'>(defaultTab);
  const [editingName, setEditingName] = useState<string>(playerName);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      setPlayerName(editingName.trim());
      setIsEditing(false);
      soundManager.playClick();
    }
  };

  const handleQuickTopUp = (amt: number) => {
    addDiamonds(amt);
    soundManager.playDiamondClink();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-2xl bg-[#06080f] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 px-4 sm:px-6 py-3 flex items-center justify-between text-black">
          <div className="flex items-center gap-2.5">
            <User className="w-6 h-6 text-black" />
            <div>
              <h2 className="font-chakra font-black text-lg sm:text-xl tracking-wider uppercase">
                {activeTab === 'profile' ? 'PLAYER PROFILE & BATTLE STATS' : 'DIAMOND TOP-UP CENTER'}
              </h2>
              <p className="text-xs text-black/90 font-bold">
                Free Fire Official Server Profile ID: 887162534
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-black/30 hover:bg-black/50 text-black flex items-center justify-center font-bold text-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 p-2.5 bg-[#04060a] border-b border-slate-800 text-xs font-chakra">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Battle Profile & Stats
          </button>
          <button
            onClick={() => setActiveTab('topup')}
            className={`px-4 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'topup'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            💎 Diamond Top-Up & Special Crates
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* Profile Card Banner */}
              <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-slate-700 rounded-xl flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                  <img
                    src="/src/assets/images/ff_alok_hero_1790532645545.jpg"
                    alt={playerName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>

                <div className="flex-1">
                  {isEditing ? (
                    <form onSubmit={handleSaveName} className="flex gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-slate-950 border border-amber-400 rounded px-2 py-1 text-sm text-white font-chakra"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2 py-1 bg-amber-500 text-slate-950 rounded text-xs font-chakra font-bold"
                      >
                        SAVE
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-chakra font-bold text-lg text-white">
                        {playerName}
                      </span>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[11px] text-amber-400 hover:underline font-chakra"
                      >
                        [Edit Name]
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-chakra">
                    <span className="text-amber-400">UID: 887162534</span>
                    <span>·</span>
                    <span className="text-red-400 font-bold uppercase">{rank} 4-Star</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">Lv. {level}</span>
                  </div>
                </div>
              </div>

              {/* Combat Performance Stats */}
              <div>
                <h4 className="font-chakra font-bold text-sm text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Season 64 Battle Royale Career Stats
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block font-chakra">Matches Played</span>
                    <span className="font-teko text-2xl text-white font-bold">428</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block font-chakra">Booyah Rate</span>
                    <span className="font-teko text-2xl text-yellow-400 font-bold">68.4%</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block font-chakra">K/D Ratio</span>
                    <span className="font-teko text-2xl text-red-400 font-bold">5.82</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block font-chakra">Headshot Rate</span>
                    <span className="font-teko text-2xl text-cyan-300 font-bold">74.1%</span>
                  </div>
                </div>
              </div>

              {/* Badges & Guild */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-chakra">
                <div>
                  <span className="text-slate-400 block">Elite Pass Badges Collected:</span>
                  <span className="text-purple-300 font-teko text-2xl font-bold">
                    {badges} 🎖️
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Guild:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    [MODSQUAD] - Level 4 Elite
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-chakra font-bold text-sm text-amber-400 uppercase tracking-wider mb-2">
                Instant Diamond Top-Up Packages
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { dia: 500, bonus: 50, price: '$0.99' },
                  { dia: 1200, bonus: 200, price: '$2.99' },
                  { dia: 2500, bonus: 500, price: '$4.99' },
                  { dia: 6000, bonus: 1500, price: '$9.99' },
                  { dia: 15000, bonus: 5000, price: '$19.99' },
                  { dia: 50000, bonus: 20000, price: '$49.99' }
                ].map((pack, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-cyan-300 font-teko text-xl font-bold">
                        <span>💎</span>
                        <span>{pack.dia.toLocaleString()}</span>
                        <span className="text-xs text-emerald-400 font-chakra">
                          (+{pack.bonus} Bonus)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-chakra">
                        Free Fire Instant In-game Deposit
                      </span>
                    </div>

                    <button
                      onClick={() => handleQuickTopUp(pack.dia + pack.bonus)}
                      className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-chakra font-bold text-xs rounded-lg active:scale-95"
                    >
                      TOP UP
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-300 font-chakra">
                💡 Tip: As Moderator, you can also disburse unlimited free diamonds to yourself and everyone using the "MAIN MODERATOR HU" control room!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
