import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Calendar, Gift, Sparkles, Check, Flame, Award, ChevronRight, X } from 'lucide-react';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ isOpen, onClose }) => {
  const {
    currentDayStreak,
    claimedDays,
    claimDailyReward,
    dailyRewardsList,
    october18Claimed,
    claimOctober18SpecialReward,
    fastForwardStreakDays
  } = useGame();

  const [filterType, setFilterType] = useState<'all' | 'milestones'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClaim = (day: number) => {
    const res = claimDailyReward(day);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOct18Claim = () => {
    const res = claimOctober18SpecialReward();
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 4000);
  };

  const displayedDays = filterType === 'milestones'
    ? dailyRewardsList.filter((d) => d.isMilestone)
    : dailyRewardsList.slice(0, Math.min(365, Math.max(30, currentDayStreak + 10)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-[#06080f] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 px-4 sm:px-6 py-3 flex items-center justify-between text-black">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-black" />
            <div>
              <h2 className="font-chakra font-black text-lg sm:text-xl tracking-wider uppercase">
                365-DAY 1-YEAR DAILY REWARDS & OCTOBER 18 MEGA JACKPOT
              </h2>
              <p className="text-xs text-black/90 font-bold">
                Pura 1 Year Streak Rewards & Exclusive October 18th Mega Diamond Drop
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

        {/* Feedback message */}
        {feedback && (
          <div className="bg-amber-950 border-b border-amber-500 px-4 py-2 text-amber-200 text-xs font-chakra flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* SPECIAL OCTOBER 18 MEGA JACKPOT HERO CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-amber-950 to-orange-950 border-2 border-amber-400 p-5 shadow-xl">
            <div className="absolute -right-8 -bottom-8 opacity-20 text-9xl pointer-events-none select-none">
              🔥
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-red-600 text-white font-chakra text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                    SPECIAL EVENT DATE
                  </span>
                  <span className="text-amber-400 font-teko text-lg tracking-wider">
                    OCTOBER 18TH EXCLUSIVE
                  </span>
                </div>
                <h3 className="font-chakra font-bold text-2xl text-yellow-300">
                  October 18 Mega Carnage Jackpot Drop
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
                  As requested in your brief: On October 18th, every player receives an instant massive delivery of 50,000 Diamonds, 500 Badges, the exclusive Mythic Phoenix Bundle & Golden Dragon M1887!
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/40 text-cyan-300 font-teko text-base">
                    <span>💎 +50,000 Diamonds</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-purple-500/40 text-purple-300 font-teko text-base">
                    <span>🎖️ +500 Elite Badges</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-amber-500/40 text-amber-300 font-teko text-base">
                    <span>✨ Mythic Phoenix + Golden Dragon</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-center">
                <button
                  onClick={handleOct18Claim}
                  disabled={october18Claimed}
                  className={`px-6 py-3.5 rounded-xl font-chakra font-bold text-sm tracking-wider uppercase shadow-xl transition-all flex items-center gap-2 ${
                    october18Claimed
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-red-600 hover:from-yellow-300 hover:to-red-500 text-slate-950 border border-yellow-200 active:scale-95 animate-pulse-glow'
                  }`}
                >
                  <Gift className="w-5 h-5 text-slate-950" />
                  <span>{october18Claimed ? 'CLAIMED ✓' : 'CLAIM OCTOBER 18 JACKPOT'}</span>
                </button>
                {october18Claimed && (
                  <span className="text-[10px] text-emerald-400 mt-1 font-chakra">
                    Granted to your inventory
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 1-YEAR STREAK BAR */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Flame className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Current Login Streak</div>
                <div className="font-chakra font-bold text-xl text-white flex items-center gap-2">
                  <span>Day {currentDayStreak}</span>
                  <span className="text-xs text-amber-400 font-normal">/ 365 Days Goal</span>
                </div>
              </div>
            </div>

            {/* Fast forward simulator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-chakra hidden md:inline">
                Simulate 1-Year Progress:
              </span>
              <button
                onClick={() => fastForwardStreakDays(7)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 border border-slate-600 text-xs font-chakra rounded text-slate-200"
              >
                +7 Days
              </button>
              <button
                onClick={() => fastForwardStreakDays(30)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 border border-slate-600 text-xs font-chakra rounded text-slate-200"
              >
                +30 Days
              </button>
              <button
                onClick={() => fastForwardStreakDays(100)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-700 border border-slate-600 text-xs font-chakra rounded text-slate-200"
              >
                +100 Days
              </button>
              <button
                onClick={() => fastForwardStreakDays(365)}
                className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold text-xs font-chakra rounded"
              >
                Max 365 Days
              </button>
            </div>
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold transition-colors ${
                  filterType === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Days
              </button>
              <button
                onClick={() => setFilterType('milestones')}
                className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold transition-colors ${
                  filterType === 'milestones'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⭐ Major Milestones (Day 7, 30, 100, Oct 18, 365)
              </button>
            </div>
            <span className="text-xs text-slate-400 font-chakra">
              Showing {displayedDays.length} days
            </span>
          </div>

          {/* DAYS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {displayedDays.map((dayItem) => {
              const isClaimed = claimedDays.includes(dayItem.day);
              const isCurrent = dayItem.day <= currentDayStreak;
              const canClaim = isCurrent && !isClaimed;

              return (
                <div
                  key={dayItem.day}
                  className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all ${
                    dayItem.isMilestone
                      ? 'bg-gradient-to-br from-amber-950/40 to-slate-900 border-amber-500/80 shadow-md shadow-amber-500/10'
                      : isClaimed
                      ? 'bg-slate-950/60 border-slate-800 opacity-75'
                      : 'bg-slate-900/80 border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  {/* Top Day Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-chakra font-bold text-xs text-amber-400">
                      Day {dayItem.day}
                    </span>
                    {dayItem.isMilestone && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-chakra px-1.5 py-0.2 rounded font-semibold border border-amber-500/30">
                        MILESTONE
                      </span>
                    )}
                  </div>

                  {/* Rewards preview */}
                  <div className="space-y-1 my-1">
                    <div className="text-cyan-300 font-teko text-base font-bold flex items-center gap-1">
                      <span>💎</span>
                      <span>+{dayItem.diamonds.toLocaleString()} Diamonds</span>
                    </div>
                    <div className="text-purple-300 font-teko text-base font-bold flex items-center gap-1">
                      <span>🎖️</span>
                      <span>+{dayItem.badges} Badges</span>
                    </div>
                    {dayItem.specialItem && (
                      <div className="text-[10px] text-yellow-300 font-chakra truncate bg-amber-950/50 p-1 rounded border border-amber-500/30">
                        {dayItem.specialItem}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-3">
                    {isClaimed ? (
                      <div className="w-full py-1.5 bg-slate-950 text-emerald-400 text-xs font-chakra font-bold rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>CLAIMED</span>
                      </div>
                    ) : canClaim ? (
                      <button
                        onClick={() => handleClaim(dayItem.day)}
                        className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-chakra font-bold rounded-lg shadow transition-transform active:scale-95"
                      >
                        CLAIM REWARD
                      </button>
                    ) : (
                      <div className="w-full py-1.5 bg-slate-950/80 text-slate-500 text-xs font-chakra text-center rounded-lg border border-slate-800">
                        LOCKED
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
