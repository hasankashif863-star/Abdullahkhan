import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import { battleAudioEngine } from '../utils/battleAudioEngine';
import {
  Users,
  Briefcase,
  Flame,
  Calendar,
  Sparkles,
  Award,
  Play,
  Volume2,
  Mic,
  MicOff,
  Headphones,
  RotateCw,
  Plus,
  X,
  Coffee,
  Heart,
  Trophy,
  Zap,
  Radio,
  Swords,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Car,
  Sliders,
  Check,
  MessageSquare,
  ShieldAlert,
  Share2
} from 'lucide-react';

interface LobbyProps {
  onStartMatch: () => void;
  onOpenCharacters: () => void;
  onOpenVault: () => void;
  onOpenLuckRoyale: () => void;
  onOpenDailyRewards: () => void;
  onOpenEvents: () => void;
  onOpenModerator: () => void;
  onOpenCustomRoom: () => void;
  onOpenDevPlan: () => void;
}

interface SquadMember {
  id: string;
  name: string;
  rank: string;
  isReady: boolean;
  micOn: boolean;
  role?: string;
  tag: string;
}

export const Lobby: React.FC<LobbyProps> = ({
  onStartMatch,
  onOpenCharacters,
  onOpenVault,
  onOpenLuckRoyale,
  onOpenDailyRewards,
  onOpenEvents,
  onOpenModerator,
  onOpenCustomRoom,
  onOpenDevPlan
}) => {
  const {
    playerName,
    level,
    rank,
    diamonds,
    gold,
    badges,
    equippedCharacter,
    equippedActiveSkill,
    equippedWeapon,
    october18Claimed
  } = useGame();

  const [activeEmoteText, setActiveEmoteText] = useState<string | null>(null);
  const [isMatchmaking, setIsMatchmaking] = useState<boolean>(false);
  const [matchmakingTimer, setMatchmakingTimer] = useState<number>(0);
  const [globalMic, setGlobalMic] = useState<boolean>(true);
  const [globalVoice, setGlobalVoice] = useState<boolean>(true);
  const [showEmotePicker, setShowEmotePicker] = useState<boolean>(false);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState<number | null>(null);

  // 5-Man Squad Lineup exactly as captured in the image
  const [squad, setSquad] = useState<SquadMember[]>([
    {
      id: 'm1',
      name: '~V1NCENZO~',
      rank: 'HEROIC',
      isReady: true,
      micOn: true,
      tag: '✓ ~V1NCENZO~'
    },
    {
      id: 'm2',
      name: 'CR7.FF',
      rank: 'GRANDMASTER',
      isReady: true,
      micOn: true,
      tag: '✓ CR7.FF'
    },
    {
      id: 'm3_leader',
      name: playerName || 'BOSS_MODERATOR',
      rank: rank || 'GRANDMASTER',
      isReady: true,
      micOn: true,
      role: 'LEADER',
      tag: `✓ ${playerName || 'BOSS'}`
    },
    {
      id: 'm4',
      name: 'TC BHAI',
      rank: 'HEROIC',
      isReady: true,
      micOn: true,
      tag: '✓ TC BHAI'
    },
    {
      id: 'm5',
      name: 'RAISTAR_99',
      rank: 'GRANDMASTER',
      isReady: true,
      micOn: true,
      tag: '✓ RAISTAR_99'
    }
  ]);

  // Keep player name synced in the center slot
  useEffect(() => {
    setSquad((prev) => {
      const next = [...prev];
      if (next[2]) {
        next[2].name = playerName;
        next[2].tag = `✓ ${playerName}`;
      }
      return next;
    });
  }, [playerName]);

  const toggleMemberReady = (index: number) => {
    soundManager.playClick();
    setSquad((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        isReady: !next[index].isReady
      };
      return next;
    });
  };

  const toggleMemberMic = (index: number) => {
    soundManager.playClick();
    setSquad((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        micOn: !next[index].micOn
      };
      return next;
    });
  };

  const triggerEmote = (emoteName: string, icon: string) => {
    soundManager.playBooyah();
    setActiveEmoteText(`${icon} ${emoteName}`);
    setShowEmotePicker(false);
    setTimeout(() => setActiveEmoteText(null), 3500);
  };

  // Matchmaking simulation tick
  useEffect(() => {
    if (!isMatchmaking) {
      setMatchmakingTimer(0);
      return;
    }

    soundManager.playClick();
    const interval = setInterval(() => {
      setMatchmakingTimer((prev) => prev + 1);
    }, 900);

    return () => clearInterval(interval);
  }, [isMatchmaking]);

  // Trigger match start safely after render when countdown completes
  useEffect(() => {
    if (isMatchmaking && matchmakingTimer >= 3) {
      setIsMatchmaking(false);
      setMatchmakingTimer(0);
      onStartMatch();
    }
  }, [isMatchmaking, matchmakingTimer, onStartMatch]);

  return (
    <div className="relative w-full h-[calc(100vh-62px)] flex flex-col justify-between overflow-hidden bg-[#040711] select-none">
      {/* ------------------------------------------------------------- */}
      {/* 1. PHOTOREALISTIC CYAN CYBER CITY 5-MAN SQUAD BACKGROUND      */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/ff_squad_cyber_lobby_1790670562433.jpg"
          alt="Free Fire 5-Man Squad Cyber Lobby"
          className="w-full h-full object-cover object-center filter brightness-95 contrast-105 saturate-110"
        />

        {/* Ambient atmospheric cyan scanline glow & corner vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-[#040711]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040711]/80 via-transparent to-[#040711]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#040711_95%)] pointer-events-none" />

        {/* Cyber Neon Floor Light Line Reflections */}
        <div className="absolute bottom-28 inset-x-0 h-16 bg-gradient-to-t from-cyan-500/15 via-transparent to-transparent pointer-events-none filter blur-xl" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TOP STATUS BAR (Tactical Comms, Region, Free Fire Logo)    */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 w-full px-3 sm:px-6 pt-2 flex items-center justify-between pointer-events-auto">
        {/* Left: Region & Room Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#080d19]/80 border border-cyan-500/30 rounded-full text-xs font-chakra backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-200 font-bold tracking-wide">BERMUDA SQUAD ARENA</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-semibold">ASIA #01</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#080d19]/70 border border-slate-800 rounded-full text-xs font-chakra text-slate-400">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ENCRYPTED SQUAD CHANNEL</span>
          </div>
        </div>

        {/* Right: Signature FREE FIRE MAX Stencil Logo & Quick Settings */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5">
              <span className="font-chakra font-black text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 tracking-wider drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                FREE FIRE
              </span>
              <span className="bg-red-600 text-white font-chakra font-black text-[10px] px-1.5 py-0.5 rounded shadow">
                MAX
              </span>
            </div>
            <span className="text-[9px] text-cyan-400 font-chakra font-semibold tracking-widest uppercase">
              CYBER HORNS SQUAD ARENA
            </span>
          </div>
        </div>
      </div>

      {/* Floating Emote Celebration */}
      {activeEmoteText && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-black/90 border-2 border-amber-400 px-6 py-2.5 rounded-full text-yellow-300 font-chakra font-black text-base shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce flex items-center gap-2">
          <span>{activeEmoteText}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CENTER ARENA: 5 SQUAD MEMBERS WITH EXACT FF NAMEPLATES      */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-10 flex-1 flex flex-col justify-end w-full max-w-7xl mx-auto px-2 sm:px-4 pb-1">
        {/* Five Interactive Squad Tag Banners positioned right under each character */}
        <div className="w-full grid grid-cols-5 gap-1.5 sm:gap-3 mb-3 pointer-events-auto">
          {squad.map((member, index) => {
            const isCenterLeader = index === 2;
            return (
              <div
                key={member.id}
                onClick={() => toggleMemberReady(index)}
                className={`relative flex flex-col items-center cursor-pointer group transition-all duration-200 ${
                  isCenterLeader ? 'scale-105 -translate-y-1' : ''
                }`}
              >
                {/* Free Fire Tactical Squad Nameplate (Dark slate with yellow accents) */}
                <div
                  className={`w-full max-w-[170px] px-2 py-1.5 rounded-md border flex items-center justify-between gap-1 shadow-2xl transition-all ${
                    isCenterLeader
                      ? 'bg-[#09101f]/95 border-amber-400 shadow-amber-500/20'
                      : member.isReady
                      ? 'bg-[#060c18]/90 border-slate-700 hover:border-amber-400/70'
                      : 'bg-[#120a0d]/90 border-red-500/50'
                  }`}
                >
                  {/* Left: Green Ready Checkmark */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-black ${
                        member.isReady
                          ? 'bg-amber-400 text-black shadow-sm'
                          : 'bg-red-600 text-white'
                      }`}
                    >
                      {member.isReady ? '✓' : '✕'}
                    </span>
                    <span className="font-chakra font-black text-[11px] sm:text-xs text-white truncate group-hover:text-amber-300">
                      {member.name}
                    </span>
                  </div>

                  {/* Right: Mic Audio Toggle Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMemberMic(index);
                    }}
                    title={member.micOn ? 'Mute Squad Voice' : 'Unmute Squad Voice'}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 shrink-0"
                  >
                    {member.micOn ? (
                      <Mic className="w-3 h-3 text-cyan-400 animate-pulse" />
                    ) : (
                      <MicOff className="w-3 h-3 text-red-400" />
                    )}
                  </button>
                </div>

                {/* Subtag (Leader crown / Rank) */}
                <div className="mt-1 flex items-center gap-1">
                  {isCenterLeader && (
                    <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.2 rounded font-chakra tracking-tight">
                      👑 SQUAD LEADER
                    </span>
                  )}
                  {!isCenterLeader && (
                    <span className="text-[9px] text-cyan-300/80 font-chakra font-semibold">
                      {member.rank}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Bottom Team Pill (Weapon, Team Capacity [5/5], Voice Channel) */}
        <div className="self-center flex items-center gap-3 bg-[#080d1a]/95 border border-amber-500/50 px-4 py-1.5 rounded-full shadow-2xl backdrop-blur-md mb-2">
          <div className="flex items-center gap-1.5 text-xs font-chakra font-bold text-amber-400">
            <span>🔫</span>
            <span className="text-white">{equippedWeapon.name}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-xs font-chakra font-black text-cyan-400">
            <Users className="w-3.5 h-3.5" />
            <span>[ 5 / 5 ] SQUAD READY</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-xs font-chakra text-slate-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">TEAM COMMS ON</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. BOTTOM TACTICAL BAR (Left Menu, Chat, Mode, START Button)   */}
      {/* ------------------------------------------------------------- */}
      <div className="relative z-20 w-full bg-[#050812]/95 border-t border-slate-800/80 px-3 sm:px-6 py-2.5 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        {/* Left Side: Free Fire Tactical Navigation Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          {/* Luck Royale */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenLuckRoyale();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090f1d] hover:bg-[#121c33] border border-amber-500/40 hover:border-amber-400 rounded-lg text-xs font-chakra font-bold text-amber-400 transition-all active:scale-95 shadow"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>LUCK ROYALE</span>
          </button>

          {/* Vault */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenVault();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090f1d] hover:bg-[#121c33] border border-slate-700 hover:border-cyan-400 rounded-lg text-xs font-chakra font-bold text-slate-200 transition-all active:scale-95 shadow"
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>VAULT</span>
          </button>

          {/* Characters */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCharacters();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090f1d] hover:bg-[#121c33] border border-slate-700 hover:border-purple-400 rounded-lg text-xs font-chakra font-bold text-slate-200 transition-all active:scale-95 shadow"
          >
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>CHARACTERS</span>
          </button>

          {/* 1-Year Rewards */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDailyRewards();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-950/80 to-[#0e1628] border border-red-500/60 rounded-lg text-xs font-chakra font-bold text-yellow-300 transition-all active:scale-95 shadow"
          >
            <Calendar className="w-3.5 h-3.5 text-yellow-300" />
            <span>OCT 18 REWARDS</span>
          </button>

          {/* Custom Room */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenCustomRoom();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090f1d] hover:bg-[#121c33] border border-amber-500/40 rounded-lg text-xs font-chakra font-bold text-amber-300 transition-all active:scale-95 shadow"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>CUSTOM (32P)</span>
          </button>

          {/* Dev Roadmap */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDevPlan();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090f1d] hover:bg-[#121c33] border border-cyan-500/40 rounded-lg text-xs font-chakra font-bold text-cyan-300 transition-all active:scale-95 shadow"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>MANUAL</span>
          </button>

          {/* Quick Emote Trigger Wheel */}
          <div className="relative">
            <button
              onClick={() => setShowEmotePicker(!showEmotePicker)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#090f1d] hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-chakra font-bold text-slate-300 active:scale-95"
            >
              <span>🕺</span>
              <span>EMOTE</span>
            </button>

            {showEmotePicker && (
              <div className="absolute bottom-12 left-0 z-50 bg-[#09101f] border border-slate-700 p-2 rounded-xl shadow-2xl flex items-center gap-2">
                <button
                  onClick={() => triggerEmote('Tea Time', '☕')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-amber-400 text-xs"
                  title="Tea Time"
                >
                  ☕
                </button>
                <button
                  onClick={() => triggerEmote('Flowers of Love', '🌹')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-red-400 text-xs"
                  title="Flowers of Love"
                >
                  🌹
                </button>
                <button
                  onClick={() => triggerEmote('Booyah Trophy', '🏆')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-yellow-400 text-xs"
                  title="Booyah Trophy"
                >
                  🏆
                </button>
                <button
                  onClick={() => triggerEmote('Dragon Roar', '🐉')}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-cyan-400 text-xs"
                  title="Dragon Roar"
                >
                  🐉
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Selected Mode Card & Huge Golden START Button */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mode Selector Card */}
          <div
            onClick={onOpenCustomRoom}
            className="hidden sm:flex items-center gap-2 bg-[#09101f] hover:bg-[#121c33] border border-slate-800 hover:border-amber-500/50 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all shadow"
          >
            <div className="text-xl">🏝️</div>
            <div>
              <div className="font-chakra font-black text-xs text-white">
                BERMUDA RANKED
              </div>
              <div className="text-[10px] text-amber-400 font-chakra font-bold">
                BATTLE ROYALE (32P)
              </div>
            </div>
          </div>

          {/* Free Fire Big Golden Angled START MATCH Button */}
          {isMatchmaking ? (
            <div className="px-8 py-3 bg-gradient-to-r from-slate-900 to-black border-2 border-amber-400 text-amber-400 font-chakra font-black text-base uppercase rounded-xl shadow-2xl flex items-center gap-3 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>MATCHING... 00:0{matchmakingTimer}</span>
              <button
                onClick={() => setIsMatchmaking(false)}
                className="text-xs text-red-400 hover:text-red-300 underline font-bold ml-2"
              >
                CANCEL
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundManager.playBooyah();
                battleAudioEngine.init();
                setIsMatchmaking(true);
              }}
              className="group relative px-8 sm:px-12 py-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 hover:from-yellow-300 hover:to-amber-400 text-black font-chakra font-black text-xl tracking-widest uppercase rounded-xl shadow-2xl shadow-amber-500/40 transition-all active:scale-95 border-2 border-yellow-200 flex items-center gap-2.5 animate-pulse-glow"
            >
              <Play className="w-6 h-6 fill-black group-hover:scale-110 transition-transform" />
              <span>START</span>
              {/* Tactical sheen effect */}
              <div className="absolute inset-0 bg-white/25 -skew-x-12 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 pointer-events-none rounded-xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
