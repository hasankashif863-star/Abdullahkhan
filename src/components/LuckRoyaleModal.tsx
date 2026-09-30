import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { LuckRoyalePrize } from '../types/game';
import { soundManager } from '../utils/sound';
import { Flame, Sparkles, Award, RotateCw, CheckCircle2, X } from 'lucide-react';

interface LuckRoyaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LuckRoyaleModal: React.FC<LuckRoyaleModalProps> = ({ isOpen, onClose }) => {
  const {
    luckRoyaleWheels,
    spinRoyale,
    luckMeter,
    diamonds,
    setRoyaleInstantGrandPrize
  } = useGame();

  const [activeWheelId, setActiveWheelId] = useState<string>('faded_wheel');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wonPrizes, setWonPrizes] = useState<LuckRoyalePrize[] | null>(null);

  if (!isOpen) return null;

  const currentWheel = luckRoyaleWheels.find((w) => w.id === activeWheelId) || luckRoyaleWheels[0];
  const currentLuck = luckMeter[activeWheelId] || 0;

  const handleSpin = (count: number) => {
    if (isSpinning) return;
    const cost = count === 1 ? currentWheel.costPerSpin : currentWheel.costPer10Spins;
    if (diamonds < cost) {
      alert(`Not enough diamonds! You need ${cost} 💎. Use Moderator Suite to add diamonds!`);
      return;
    }

    setIsSpinning(true);
    setWonPrizes(null);

    // Realistic spin sound and animation delay
    let tickCount = 0;
    const interval = setInterval(() => {
      soundManager.playWheelTick();
      tickCount++;
      if (tickCount > 10) {
        clearInterval(interval);
      }
    }, 120);

    setTimeout(() => {
      clearInterval(interval);
      const results = spinRoyale(activeWheelId, count);
      setIsSpinning(false);
      setWonPrizes(results);
      soundManager.playBooyah();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl bg-[#06080f] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 px-4 sm:px-6 py-3 flex items-center justify-between text-black">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 animate-pulse text-black" />
            <div>
              <h2 className="font-chakra font-black text-lg sm:text-xl tracking-wider uppercase">
                LUCK ROYALE & FADED WHEEL
              </h2>
              <p className="text-xs text-black/90 font-bold">
                Spin for Mythic Evo Blue Flame Draco, Red Criminal & Golden Dragon
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

        {/* Wheels Switcher Tabs */}
        <div className="flex items-center gap-2 p-2.5 bg-[#04060a] border-b border-slate-800 text-xs font-chakra">
          {luckRoyaleWheels.map((wheel) => (
            <button
              key={wheel.id}
              onClick={() => {
                setActiveWheelId(wheel.id);
                setWonPrizes(null);
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeWheelId === wheel.id
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <span>{wheel.bannerImage}</span>
              <span>{wheel.title}</span>
            </button>
          ))}

          {setRoyaleInstantGrandPrize && (
            <span className="ml-auto text-[11px] bg-red-600 text-white font-chakra px-2 py-0.5 rounded font-black animate-pulse">
              👑 MODERATOR 100% GRAND PRIZE ACTIVE
            </span>
          )}
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#06080f]">
          {/* Left: Prizes Grid (Faded Wheel layout) */}
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-chakra font-black text-sm text-amber-400 uppercase tracking-wider">
                Wheel Prize Pool
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-chakra">Lucky Meter:</span>
                <div className="w-28 h-3 bg-black rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${currentLuck}%` }}
                  ></div>
                </div>
                <span className="text-xs font-teko text-amber-300 font-bold">{currentLuck}/100</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentWheel.prizes.map((prize, idx) => (
                <div
                  key={prize.id}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-between text-center transition-all aspect-square ${
                    prize.rarity === 'grand'
                      ? 'bg-gradient-to-br from-amber-950/70 to-[#0c0904] border-amber-400 shadow-xl shadow-amber-500/20'
                      : prize.rarity === 'mythic'
                      ? 'bg-red-950/30 border-red-500/70'
                      : 'bg-[#090d16] border-slate-800'
                  } ${isSpinning ? 'animate-pulse' : ''}`}
                >
                  <div className="w-full text-right">
                    <span
                      className={`text-[9px] font-chakra px-1.5 py-0.2 rounded font-bold uppercase ${
                        prize.rarity === 'grand'
                          ? 'bg-amber-500 text-slate-950'
                          : prize.rarity === 'mythic'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {prize.rarity}
                    </span>
                  </div>

                  <div className="text-4xl my-1">{prize.image}</div>

                  <div className="w-full">
                    <span className="font-chakra font-bold text-xs text-white line-clamp-2 block leading-tight">
                      {prize.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Spinning Action Controls */}
          <div className="md:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 font-chakra block">Current Grand Prize:</span>
                <span className="font-chakra font-bold text-lg text-amber-400 block mt-1">
                  {currentWheel.prizes.find((p) => p.rarity === 'grand')?.name || 'Mythic Reward'}
                </span>
                <div className="mt-2 text-xs text-slate-400 font-sans-clean">
                  Higher Lucky meter guarantees Grand Prize on next turn.
                </div>
              </div>

              {/* Won Prizes Alert */}
              {wonPrizes && wonPrizes.length > 0 && (
                <div className="p-3 bg-gradient-to-br from-amber-950/80 to-slate-900 border border-amber-500 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 font-chakra font-bold text-sm">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>CONGRATULATIONS! WON:</span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto">
                    {wonPrizes.map((won, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-white">
                        <span>{won.image}</span>
                        <span className="font-bold text-amber-300">{won.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Spin Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => handleSpin(1)}
                disabled={isSpinning}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-chakra font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>SPIN 1X ({currentWheel.costPerSpin} 💎)</span>
              </button>

              <button
                onClick={() => handleSpin(10)}
                disabled={isSpinning}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 via-amber-600 to-yellow-500 hover:from-red-500 hover:to-yellow-400 text-slate-950 font-chakra font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-yellow-200"
              >
                <Sparkles className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>SPIN 10X + 1 FREE ({currentWheel.costPer10Spins} 💎)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
