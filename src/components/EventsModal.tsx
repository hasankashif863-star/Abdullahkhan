import React from 'react';
import { useGame } from '../context/GameContext';
import { CalendarDays, Gift, Check, Sparkles, ChevronRight, X } from 'lucide-react';

interface EventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventsModal: React.FC<EventsModalProps> = ({ isOpen, onClose }) => {
  const { events, claimEventTask } = useGame();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-[#06080f] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 px-4 sm:px-6 py-3 flex items-center justify-between text-black">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-black" />
            <div>
              <h2 className="font-chakra font-black text-lg sm:text-xl tracking-wider uppercase">
                EVENTS & MISSION REWARDS
              </h2>
              <p className="text-xs text-black/90 font-bold">
                Free Fire Carnival Events, October 18 Carnage & Booyah Tasks
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

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 bg-[#06080f]">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden shadow-lg"
            >
              {/* Event Banner Header */}
              <div className={`p-4 bg-gradient-to-r ${evt.bannerColor} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] bg-black/40 text-yellow-300 font-chakra font-bold px-2 py-0.5 rounded uppercase">
                      {evt.badge}
                    </span>
                    <span className="text-xs font-teko text-amber-200 tracking-wider">
                      {evt.endDate}
                    </span>
                  </div>
                  <h3 className="font-chakra font-bold text-lg sm:text-xl text-white">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-white/80 font-sans-clean mt-0.5">
                    {evt.subtitle}
                  </p>
                </div>
              </div>

              {/* Event Tasks List */}
              <div className="p-4 space-y-2.5 divide-y divide-slate-800/60">
                {evt.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                        {task.rewardType === 'diamonds' ? '💎' : task.rewardType === 'badges' ? '🎖️' : '🎁'}
                      </div>
                      <div>
                        <span className="text-slate-200 font-chakra font-semibold block">
                          {task.description}
                        </span>
                        <span className="text-amber-400 font-teko text-base">
                          Reward: {task.reward}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => claimEventTask(evt.id, task.id)}
                      disabled={task.completed}
                      className={`px-4 py-2 rounded-lg font-chakra font-bold uppercase transition-all shrink-0 ${
                        task.completed
                          ? 'bg-slate-900 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95 shadow'
                      }`}
                    >
                      {task.completed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>CLAIMED</span>
                        </>
                      ) : (
                        'CLAIM REWARD'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
