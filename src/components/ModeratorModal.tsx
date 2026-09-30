import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  ShieldAlert,
  Send,
  Award,
  DollarSign,
  Sparkles,
  Zap,
  Gift,
  CheckCircle2,
  Users,
  Megaphone,
  X,
  BookOpen,
  Sliders,
  AlertTriangle,
  Play
} from 'lucide-react';

interface ModeratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomRoom?: () => void;
  onOpenDevPlan?: () => void;
}

export const ModeratorModal: React.FC<ModeratorModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomRoom,
  onOpenDevPlan
}) => {
  const {
    godModeEnabled,
    toggleGodMode,
    playersList,
    moderatorLogs,
    sendDiamondsToPlayer,
    sendBadgesToPlayer,
    injectMoneyTopUp,
    unlockEverythingAdmin,
    setRoyaleInstantGrandPrize,
    toggleRoyaleInstantGrandPrize,
    broadcastAnnouncement,
    claimOctober18SpecialReward,
    october18Claimed
  } = useGame();

  const [activeTab, setActiveTab] = useState<
    'guide' | 'diamonds' | 'badges' | 'money' | 'god_mode' | 'players' | 'logs'
  >('guide');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('ALL');
  const [diamondAmount, setDiamondAmount] = useState<number>(50000);
  const [customNote, setCustomNote] = useState<string>('Moderator Boss Gift Drop! Enjoy!');
  const [badgeAmount, setBadgeAmount] = useState<number>(500);
  const [dollarCash, setDollarCash] = useState<number>(100);
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleSendDiamonds = (e: React.FormEvent) => {
    e.preventDefault();
    if (diamondAmount <= 0) return;
    sendDiamondsToPlayer(selectedPlayerId, diamondAmount, customNote);
    showFeedback(
      `Sent ${diamondAmount.toLocaleString()} 💎 Diamonds to ${
        selectedPlayerId === 'ALL' ? 'ALL PLAYERS' : selectedPlayerId
      } successfully!`
    );
  };

  const handleSendBadges = (e: React.FormEvent) => {
    e.preventDefault();
    if (badgeAmount <= 0) return;
    sendBadgesToPlayer(selectedPlayerId, badgeAmount);
    showFeedback(
      `Granted ${badgeAmount} 🎖️ Elite Badges to ${
        selectedPlayerId === 'ALL' ? 'ALL PLAYERS' : selectedPlayerId
      }!`
    );
  };

  const handleSendMoneyTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (dollarCash <= 0) return;
    const diamondsGenerated = dollarCash * 1000;
    injectMoneyTopUp(dollarCash, diamondsGenerated);
    showFeedback(
      `Funded $${dollarCash} Cash! Distributed ${diamondsGenerated.toLocaleString()} 💎 Diamonds to all players on server!`
    );
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    broadcastAnnouncement(`👑 MODERATOR NOTICE: ${announcementText}`);
    showFeedback('Announcement broadcasted across entire server!');
    setAnnouncementText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-[#06080f] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-500 to-yellow-500 px-4 sm:px-6 py-3 flex items-center justify-between text-black">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 animate-pulse text-black" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-chakra font-black text-lg sm:text-xl tracking-wider uppercase">
                  MAIN MODERATOR HU — ADMIN CONTROL SUITE
                </h2>
                <span className="bg-black text-amber-300 text-[10px] font-chakra px-2 py-0.5 rounded font-black tracking-widest">
                  SERVER #01 ROOT
                </span>
              </div>
              <p className="text-xs text-black/90 font-bold">
                Full authority over diamonds, gold, Elite Pass badges, luck royale & player distributions
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

        {/* Feedback alert */}
        {feedbackMsg && (
          <div className="bg-emerald-950/90 border-b border-emerald-500 px-4 py-2 text-emerald-300 text-xs font-chakra flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-[#04060a] border-b border-slate-800 text-xs font-chakra">
          {[
            { id: 'guide', label: '👮 Moderator Guide & Rules', icon: BookOpen },
            { id: 'diamonds', label: '💎 Send Diamonds', icon: Send },
            { id: 'badges', label: '🎖️ Sara Badge Sab Ko Du', icon: Award },
            { id: 'money', label: '💸 Paise Se Diamond Du', icon: DollarSign },
            { id: 'god_mode', label: '⚡ God Mode & Cheats', icon: Zap },
            { id: 'players', label: '👥 Player Database', icon: Users },
            { id: 'logs', label: '📜 Server Logs', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-200 bg-[#06080f]">
          {/* TAB 0: MODERATOR GUIDE & RULES */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="font-chakra font-black text-lg text-amber-400 uppercase tracking-wide">
                      Chief Moderator Authority & Duty Handbook
                    </h3>
                    <p className="text-xs text-gray-300">
                      Aap is server par Main Moderator hain. Aap custom rooms, spectator matches, diamond drops aur tournament rules direct control kar sakte hain.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onOpenCustomRoom && (
                      <button
                        onClick={() => { onClose(); onOpenCustomRoom(); }}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase flex items-center space-x-1"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Open Custom Room (32P)</span>
                      </button>
                    )}
                    {onOpenDevPlan && (
                      <button
                        onClick={() => { onClose(); onOpenDevPlan(); }}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase flex items-center space-x-1"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Full Architecture Plan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* What Mod Can Do vs Cannot Do */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-500/40 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Moderator Kya Kar Sakta Hai?</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li>• <strong>32-Player Custom Room Manage Karna:</strong> Players ko invite karna, slots change karna, teams swap karna aur inactive players ko kick karna.</li>
                    <li>• <strong>Spectator Mode Mein Monitor Karna:</strong> Match ko live referee bankar monitor karna baghair gameplay ko corrupt kiye.</li>
                    <li>• <strong>Tournament Rules Check:</strong> Banned weapons, hacker aimbot, aur wall-glitch ko detect karna aur player ko warn/mute karna.</li>
                    <li>• <strong>Mass Drops & Rewards:</strong> Players ko paise se diamonds bhejna, Elite Pass badges grant karna aur server announcements chalana.</li>
                    <li>• <strong>Match Event Triggers:</strong> In-match emergency airdrop summon karna ya safe zone shrink ko speed-up karna.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-red-500/40 space-y-3">
                  <div className="flex items-center space-x-2 text-red-400 font-bold text-sm uppercase">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Moderator Ko Kya Nahi Karna Chahiye?</span>
                  </div>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li>• <strong>Player Passwords Dekhna:</strong> Security violation—passwords hashed hote hain aur kisi ko visible nahi hote.</li>
                    <li>• <strong>Database Delete Karna:</strong> Server ki core SQL tables ko drop karna strictly banned hota hai.</li>
                    <li>• <strong>Ranked Match Mein Cheat Karna:</strong> Normal competitive ranked match mein god-mode se genuine players ka game kharab na karna.</li>
                    <li>• <strong>Personal Accounts Ban Abuse:</strong> Baghair proof ke kisi player ka account permanent delete karna authority se bahar hai.</li>
                  </ul>
                </div>
              </div>

              {/* Permission Hierarchy */}
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-bold">Permission Ladder:</span>
                <span className="font-mono text-gray-300">OWNER ➔ ADMIN ➔ <strong className="text-amber-400">MODERATOR (Aap)</strong> ➔ HELPER ➔ PLAYER</span>
              </div>
            </div>
          )}

          {/* TAB 1: SEND DIAMONDS */}
          {activeTab === 'diamonds' && (
            <div className="space-y-5">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
                <h3 className="font-chakra font-bold text-base text-amber-400 mb-1 flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Diamond Disbursement Terminal
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Send free diamonds to any specific player or mass drop to everyone on the server simultaneously.
                </p>

                <form onSubmit={handleSendDiamonds} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-chakra text-slate-300 mb-1">
                        Select Recipient:
                      </label>
                      <select
                        value={selectedPlayerId}
                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-chakra focus:border-amber-400 outline-none"
                      >
                        <option value="ALL">🌍 ALL PLAYERS (Server-Wide Mass Drop)</option>
                        {playersList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Lv.{p.level} - {p.rank}) - Has {p.diamonds.toLocaleString()} 💎
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-chakra text-slate-300 mb-1">
                        Diamond Amount:
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000000"
                        value={diamondAmount}
                        onChange={(e) => setDiamondAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-teko text-xl tracking-wider focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Quick Presets:</span>
                    <div className="flex flex-wrap gap-2">
                      {[10000, 25000, 50000, 100000, 500000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setDiamondAmount(amt)}
                          className={`px-2.5 py-1 rounded text-xs font-teko text-base tracking-wider border transition-colors ${
                            diamondAmount === amt
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          +{amt.toLocaleString()} 💎
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-chakra text-slate-300 mb-1">
                      Moderator Gift Note / Message:
                    </label>
                    <input
                      type="text"
                      value={customNote}
                      onChange={(e) => setCustomNote(e.target.value)}
                      placeholder="e.g. Moderator gift drop for our active warriors!"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-chakra focus:border-amber-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-chakra font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    DISBURSE {diamondAmount.toLocaleString()} DIAMONDS TO{' '}
                    {selectedPlayerId === 'ALL' ? 'EVERYONE ON SERVER' : 'SELECTED PLAYER'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: GRANT BADGES TO EVERYONE */}
          {activeTab === 'badges' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-purple-950/50 to-slate-900 p-5 rounded-xl border border-purple-500/40">
                <div className="flex items-center gap-2.5 mb-2">
                  <Award className="w-6 h-6 text-purple-400" />
                  <h3 className="font-chakra font-bold text-lg text-purple-200">
                    SARA BADGE SAB KO DU (Grant All Elite Badges)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  As requested by you: Instant one-click badge injector. Give max 500+ badges to all players so every single user unlocks the full Booyah Pass, Sakura Kimono, and Cobra Gun rewards!
                </p>

                <form onSubmit={handleSendBadges} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-chakra text-slate-300 mb-1">
                        Target Recipient:
                      </label>
                      <select
                        value={selectedPlayerId}
                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                        className="w-full bg-slate-950 border border-purple-800 rounded-lg px-3 py-2 text-sm text-white font-chakra focus:border-purple-400 outline-none"
                      >
                        <option value="ALL">🌍 SAB KO DU (Grant to ALL Players)</option>
                        {playersList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (Current Badges: {p.badges})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-chakra text-slate-300 mb-1">
                        Badges Amount to Grant:
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        value={badgeAmount}
                        onChange={(e) => setBadgeAmount(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-purple-800 rounded-lg px-3 py-2 text-sm text-white font-teko text-xl tracking-wider focus:border-purple-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {[100, 250, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setBadgeAmount(amt)}
                        className={`px-3 py-1 rounded text-xs font-teko text-base border transition-colors ${
                          badgeAmount === amt
                            ? 'bg-purple-500/30 border-purple-400 text-purple-200 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        +{amt} Badges
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-chakra font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5 text-yellow-300" />
                    GRANT {badgeAmount} BADGES TO{' '}
                    {selectedPlayerId === 'ALL' ? 'ALL PLAYERS (SAB KO DU)' : 'PLAYER'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: MONEY DIAMOND INJECTOR ("PAISE SE DIAMOND DU") */}
          {activeTab === 'money' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 p-5 rounded-xl border border-emerald-500/40">
                <div className="flex items-center gap-2.5 mb-2">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-chakra font-bold text-lg text-emerald-200">
                    PAISE SE DIAMOND DU (Cash Community Diamond Top-Up)
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Your special requirement: "Ma sub ko paise se diamond du". You can fund a cash sponsorship pool in dollars/rupees, and the system automatically converts and rains real diamonds into all online players&apos; accounts!
                </p>

                <form onSubmit={handleSendMoneyTopUp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-chakra text-slate-300 mb-1">
                      Cash Funding Pool (USD / Dollars):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-emerald-400 font-bold">$</span>
                      <input
                        type="number"
                        min="5"
                        max="5000"
                        value={dollarCash}
                        onChange={(e) => setDollarCash(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-emerald-700 rounded-lg pl-8 pr-3 py-2 text-sm text-white font-teko text-2xl tracking-wider focus:border-emerald-400 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[20, 50, 100, 250, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDollarCash(amt)}
                        className={`px-3 py-1 rounded text-xs font-chakra border transition-colors ${
                          dollarCash === amt
                            ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200 font-bold'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        ${amt} (${amt * 1000} 💎 Diamonds Drop)
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-emerald-950/40 border border-emerald-600/30 rounded-lg text-xs text-emerald-300 flex items-center justify-between">
                    <span>Generated Diamonds for Community:</span>
                    <span className="font-teko text-2xl text-cyan-300 font-bold">
                      +{(dollarCash * 1000).toLocaleString()} 💎 Diamonds
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-slate-950 font-chakra font-bold text-sm tracking-wider uppercase rounded-xl shadow-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-5 h-5 text-slate-950" />
                    FUND ${dollarCash} AND SHOWER ALL PLAYERS WITH {(dollarCash * 1000).toLocaleString()} DIAMONDS
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: GOD MODE & CHEATS */}
          {activeTab === 'god_mode' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* God Mode Currency */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-chakra font-bold text-sm text-white">Infinite Currencies (God Mode)</h4>
                    <p className="text-[11px] text-slate-400">Diamonds & Gold never decrease when spending</p>
                  </div>
                  <button
                    onClick={toggleGodMode}
                    className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold transition-colors ${
                      godModeEnabled ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {godModeEnabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* 100% Luck Royale Win */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-chakra font-bold text-sm text-white">100% Luck Royale Grand Prize</h4>
                    <p className="text-[11px] text-slate-400">Every single spin guarantees Grand Prize</p>
                  </div>
                  <button
                    onClick={toggleRoyaleInstantGrandPrize}
                    className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold transition-colors ${
                      setRoyaleInstantGrandPrize ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {setRoyaleInstantGrandPrize ? 'ACTIVE' : 'OFF'}
                  </button>
                </div>

                {/* Unlock All Vault Items */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-chakra font-bold text-sm text-white">Unlock All Vault & Max Evo Guns</h4>
                    <p className="text-[11px] text-slate-400">Upgrade all Evo Guns to Level 7 Max</p>
                  </div>
                  <button
                    onClick={unlockEverythingAdmin}
                    className="px-3 py-1.5 rounded-lg text-xs font-chakra font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                  >
                    UNLOCK ALL
                  </button>
                </div>

                {/* Trigger October 18 Reward */}
                <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <h4 className="font-chakra font-bold text-sm text-white">October 18th Mega Jackpot</h4>
                    <p className="text-[11px] text-slate-400">Instant +50,000 Diamonds & Mythic Phoenix</p>
                  </div>
                  <button
                    onClick={() => {
                      const res = claimOctober18SpecialReward();
                      showFeedback(res.message);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-chakra font-bold transition-colors ${
                      october18Claimed
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    {october18Claimed ? 'CLAIMED' : 'CLAIM NOW'}
                  </button>
                </div>
              </div>

              {/* Broadcast Server Announcement */}
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <h4 className="font-chakra font-bold text-sm text-amber-400 mb-1 flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Broadcast Live Server Banner Announcement
                </h4>
                <form onSubmit={handleBroadcast} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="Enter message to scroll at top of everyone's screen..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-chakra focus:border-amber-400 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-chakra font-bold text-xs rounded-lg"
                  >
                    BROADCAST
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: PLAYER DATABASE */}
          {activeTab === 'players' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-chakra font-bold text-sm text-white">
                  Active Server Players ({playersList.length})
                </h3>
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-chakra">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Server Synced
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-700 rounded-xl">
                <table className="w-full text-left text-xs font-chakra">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2.5">Player</th>
                      <th className="px-3 py-2.5">Rank & Lv</th>
                      <th className="px-3 py-2.5">Diamonds</th>
                      <th className="px-3 py-2.5">Badges</th>
                      <th className="px-3 py-2.5 text-right">Moderator Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    {playersList.map((player) => (
                      <tr key={player.id} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2 flex items-center gap-2">
                          <span className="text-base">{player.avatar}</span>
                          <div>
                            <span className="font-bold text-white block">{player.name}</span>
                            <span className="text-[10px] text-slate-400">{player.statusMessage}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="text-amber-400 font-semibold">{player.rank}</span>
                          <span className="text-slate-500 ml-1">Lv.{player.level}</span>
                        </td>
                        <td className="px-3 py-2 text-cyan-300 font-teko text-base">
                          {player.diamonds.toLocaleString()} 💎
                        </td>
                        <td className="px-3 py-2 text-purple-300 font-teko text-base">
                          {player.badges} 🎖️
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                sendDiamondsToPlayer(player.id, 5000);
                                showFeedback(`Sent +5,000 Diamonds to ${player.name}!`);
                              }}
                              className="px-2 py-1 bg-cyan-900/50 hover:bg-cyan-800 border border-cyan-500/40 text-cyan-200 rounded text-[11px]"
                            >
                              +5K 💎
                            </button>
                            <button
                              onClick={() => {
                                sendBadgesToPlayer(player.id, 100);
                                showFeedback(`Granted +100 Badges to ${player.name}!`);
                              }}
                              className="px-2 py-1 bg-purple-900/50 hover:bg-purple-800 border border-purple-500/40 text-purple-200 rounded text-[11px]"
                            >
                              +100 🎖️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: SERVER AUDIT LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-2">
              <h3 className="font-chakra font-bold text-sm text-white mb-2">
                Moderator Activity & Audit Log
              </h3>
              <div className="space-y-2 font-mono text-xs max-h-80 overflow-y-auto">
                {moderatorLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-slate-300"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="text-amber-400 font-bold">[{log.action}]</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-slate-200">{log.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-chakra">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Moderator Status: ACTIVE & ROOT AUTHENTICATED</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
