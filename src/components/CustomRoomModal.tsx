import React, { useState } from 'react';
import {
  Users,
  Settings,
  Eye,
  Play,
  X,
  Shield,
  Car,
  Zap,
  CheckCircle,
  Copy,
  Plus,
  RefreshCw,
  Sliders,
  Flame,
  UserX,
  ArrowRightLeft
} from 'lucide-react';
import { CustomRoomPlayer, CustomRoomSettings } from '../types/game';
import { soundManager } from '../utils/sound';

interface CustomRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (roomConfig?: { isCustomRoom: boolean; settings: CustomRoomSettings; asSpectator?: boolean }) => void;
}

const DEFAULT_SETTINGS: CustomRoomSettings = {
  roomName: '🔥 PRO TOURNAMENT ARENA 2026',
  roomId: '458921',
  password: '',
  maxPlayers: 32,
  mode: 'SQUAD',
  ammo: 'UNLIMITED',
  glooWalls: 'UNLIMITED',
  safeZoneSpeed: 'FAST',
  vehicles: true,
  playerHp: 200,
  fallDamage: false
};

const INITIAL_PLAYERS: CustomRoomPlayer[] = [
  { slot: 1, name: 'Chief_Hasan (You)', level: 78, isReady: true, isHost: true, isModerator: true, isBot: false, team: 1 },
  { slot: 2, name: 'Ajjubhai_94', level: 82, isReady: true, isHost: false, isBot: true, team: 1 },
  { slot: 3, name: 'Raistar_FF', level: 85, isReady: true, isHost: false, isBot: true, team: 1 },
  { slot: 4, name: 'Total_Gaming', level: 79, isReady: true, isHost: false, isBot: true, team: 1 },
  
  { slot: 5, name: 'TSG_Jash', level: 75, isReady: true, isHost: false, isBot: true, team: 2 },
  { slot: 6, name: 'SK_Sabir_Boss', level: 88, isReady: true, isHost: false, isBot: true, team: 2 },
  { slot: 7, name: 'Daddy_Calling', level: 91, isReady: true, isHost: false, isBot: true, team: 2 },
  { slot: 8, name: 'Sudip_Sarkar', level: 80, isReady: true, isHost: false, isBot: true, team: 2 },

  { slot: 9, name: 'Vincenzo_99', level: 77, isReady: true, isHost: false, isBot: true, team: 3 },
  { slot: 10, name: 'B2K_Born2Kill', level: 83, isReady: true, isHost: false, isBot: true, team: 3 },
  { slot: 11, name: 'White444_God', level: 86, isReady: true, isHost: false, isBot: true, team: 3 },
  { slot: 12, name: 'Ruok_FF_Aim', level: 84, isReady: true, isHost: false, isBot: true, team: 3 },

  { slot: 13, name: 'Nonstop_Gaming', level: 72, isReady: true, isHost: false, isBot: true, team: 4 },
  { slot: 14, name: 'Pahadi_Gaming', level: 76, isReady: true, isHost: false, isBot: true, team: 4 },
  { slot: 15, name: 'Badge_King_99', level: 81, isReady: true, isHost: false, isBot: true, team: 4 },
  { slot: 16, name: 'Cobra_Demon', level: 74, isReady: true, isHost: false, isBot: true, team: 4 },

  { slot: 17, name: 'Headshot_Machine', level: 70, isReady: true, isHost: false, isBot: true, team: 5 },
  { slot: 18, name: 'SniperQueen', level: 73, isReady: true, isHost: false, isBot: true, team: 5 },
  { slot: 19, name: 'Shadow_Ninja', level: 69, isReady: true, isHost: false, isBot: true, team: 5 },
  { slot: 20, name: 'Bermuda_Ruler', level: 75, isReady: true, isHost: false, isBot: true, team: 5 },

  { slot: 21, name: 'Alpha_Predator', level: 68, isReady: true, isHost: false, isBot: true, team: 6 },
  { slot: 22, name: 'Phoenix_Reborn', level: 71, isReady: true, isHost: false, isBot: true, team: 6 },
  { slot: 23, name: 'Gloo_Wall_Hacker', level: 77, isReady: true, isHost: false, isBot: true, team: 6 },
  { slot: 24, name: 'Draco_Slayer', level: 79, isReady: true, isHost: false, isBot: true, team: 6 },

  { slot: 25, name: 'Storm_Breaker', level: 65, isReady: true, isHost: false, isBot: true, team: 7 },
  { slot: 26, name: 'Ghost_Rider_FF', level: 72, isReady: true, isHost: false, isBot: true, team: 7 },
  { slot: 27, name: 'Titan_Striker', level: 70, isReady: true, isHost: false, isBot: true, team: 7 },
  { slot: 28, name: 'Toxic_Avenger', level: 66, isReady: true, isHost: false, isBot: true, team: 7 },

  { slot: 29, name: 'Legend_Never_Dies', level: 82, isReady: true, isHost: false, isBot: true, team: 8 },
  { slot: 30, name: 'Cyber_Hunter', level: 74, isReady: true, isHost: false, isBot: true, team: 8 },
  { slot: 31, name: 'Vortex_King', level: 68, isReady: true, isHost: false, isBot: true, team: 8 },
  { slot: 32, name: 'Final_Survivor', level: 75, isReady: true, isHost: false, isBot: true, team: 8 }
];

export const CustomRoomModal: React.FC<CustomRoomModalProps> = ({
  isOpen,
  onClose,
  onStartMatch
}) => {
  const [settings, setSettings] = useState<CustomRoomSettings>(DEFAULT_SETTINGS);
  const [players, setPlayers] = useState<CustomRoomPlayer[]>(INITIAL_PLAYERS);
  const [activeTab, setActiveTab] = useState<'SLOTS' | 'SETTINGS' | 'SPECTATORS'>('SLOTS');
  const [copied, setCopied] = useState(false);
  const [spectators, setSpectators] = useState<string[]>([
    'Moderator_SpectateCam #1',
    'Official_Tournament_Streamer'
  ]);

  if (!isOpen) return null;

  const copyRoomId = () => {
    soundManager.playClick();
    navigator.clipboard?.writeText(settings.roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const kickPlayer = (slot: number) => {
    soundManager.playClick();
    setPlayers((prev) =>
      prev.map((p) =>
        p.slot === slot ? { ...p, name: `[Empty Slot ${slot}]`, isReady: false, isBot: false } : p
      )
    );
  };

  const swapTeam = (slot: number) => {
    soundManager.playClick();
    setPlayers((prev) =>
      prev.map((p) =>
        p.slot === slot ? { ...p, team: (p.team % 8) + 1 } : p
      )
    );
  };

  const handleStartMatch = (asSpectator = false) => {
    soundManager.playClick();
    soundManager.playVictoryFanfare();
    onClose();
    onStartMatch({
      isCustomRoom: true,
      settings,
      asSpectator
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl bg-[#07090e] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#0a0d14] border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-black text-lg tracking-wider text-white">
                  CUSTOM ROOM (32 PLAYERS)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  HOST / MODERATOR
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <span>Room Name: <strong className="text-gray-200">{settings.roomName}</strong></span>
                <span>•</span>
                <button
                  onClick={copyRoomId}
                  className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 font-mono"
                >
                  <span>ID: {settings.roomId}</span>
                  <Copy className="w-3 h-3" />
                  {copied && <span className="text-emerald-400 font-sans text-[10px]">Copied!</span>}
                </button>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">Map: Bermuda 2.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#080b11] border-b border-white/5 text-xs font-bold uppercase tracking-wider">
          <div className="flex space-x-2">
            <button
              onClick={() => { soundManager.playClick(); setActiveTab('SLOTS'); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'SLOTS'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>32 Player Slots ({players.filter((p) => !p.name.includes('[Empty')).length}/32)</span>
            </button>
            <button
              onClick={() => { soundManager.playClick(); setActiveTab('SETTINGS'); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'SETTINGS'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Room Rules & Settings</span>
            </button>
            <button
              onClick={() => { soundManager.playClick(); setActiveTab('SPECTATORS'); }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === 'SPECTATORS'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Spectator Mode ({spectators.length}/4)</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center space-x-3 text-xs text-gray-400">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>32/32 Full Match Ready</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#06080e]">
          {activeTab === 'SLOTS' && (
            <div>
              {/* Squads Grid (8 Squads of 4 players = 32 players) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((teamNum) => {
                  const teamPlayers = players.filter((p) => p.team === teamNum);
                  return (
                    <div
                      key={teamNum}
                      className="rounded-xl bg-[#090d16] border border-white/5 p-3 flex flex-col space-y-2 hover:border-amber-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5 text-xs">
                        <span className="font-heading font-black text-amber-400 tracking-wider flex items-center space-x-1.5">
                          <Flame className="w-3.5 h-3.5" />
                          <span>SQUAD {teamNum}</span>
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">4 Slots</span>
                      </div>

                      <div className="space-y-1.5">
                        {teamPlayers.map((player) => (
                          <div
                            key={player.slot}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                              player.isHost
                                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold'
                                : player.name.includes('[Empty')
                                ? 'bg-black/30 border border-dashed border-white/10 text-gray-600'
                                : 'bg-white/5 border border-white/5 text-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <span className="w-4 text-[10px] font-mono text-gray-500">#{player.slot}</span>
                              <div className="truncate">
                                <div className="flex items-center space-x-1">
                                  <span className="truncate">{player.name}</span>
                                  {player.isHost && (
                                    <span className="px-1 text-[8px] bg-amber-500 text-black font-black rounded">
                                      HOST
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-gray-500">Lv.{player.level}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1">
                              {player.isReady ? (
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-red-400" />
                              )}

                              {!player.isHost && !player.name.includes('[Empty') && (
                                <div className="flex items-center space-x-0.5 ml-1">
                                  <button
                                    onClick={() => swapTeam(player.slot)}
                                    title="Move to Next Team"
                                    className="p-1 hover:bg-white/10 text-gray-400 hover:text-amber-400 rounded"
                                  >
                                    <ArrowRightLeft className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => kickPlayer(player.slot)}
                                    title="Kick Player"
                                    className="p-1 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded"
                                  >
                                    <UserX className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center space-x-3">
                <Shield className="w-6 h-6 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <strong className="text-amber-400">Chief Moderator Authority:</strong> Aap custom room ke tamam rules, ammo, gloo wall drop rate aur safe zone shrink speed ko live customize kar sakte hain.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ammo Setting */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Ammunition</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['LIMITED', 'UNLIMITED'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { soundManager.playClick(); setSettings({ ...settings, ammo: opt }); }}
                        className={`p-2.5 rounded-lg font-bold border transition-all ${
                          settings.ammo === opt
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {opt} AMMO
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gloo Walls Setting */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Gloo Wall Shield</span>
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(['NORMAL', 'UNLIMITED'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { soundManager.playClick(); setSettings({ ...settings, glooWalls: opt }); }}
                        className={`p-2.5 rounded-lg font-bold border transition-all ${
                          settings.glooWalls === opt
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {opt} GLOO
                      </button>
                    ))}
                  </div>
                </div>

                {/* Safe Zone Speed */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Safe Zone Shrink Speed</span>
                    <Flame className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['NORMAL', 'FAST', 'EXTREME'] as const).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { soundManager.playClick(); setSettings({ ...settings, safeZoneSpeed: opt }); }}
                        className={`p-2 rounded-lg font-bold border transition-all ${
                          settings.safeZoneSpeed === opt
                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicles on Map */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Drivable Vehicles</span>
                    <Car className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[true, false].map((opt) => (
                      <button
                        key={String(opt)}
                        onClick={() => { soundManager.playClick(); setSettings({ ...settings, vehicles: opt }); }}
                        className={`p-2.5 rounded-lg font-bold border transition-all ${
                          settings.vehicles === opt
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {opt ? 'VEHICLES ON' : 'VEHICLES OFF'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Player HP */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Initial Player Health
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {([200, 500] as const).map((hp) => (
                      <button
                        key={hp}
                        onClick={() => { soundManager.playClick(); setSettings({ ...settings, playerHp: hp }); }}
                        className={`p-2.5 rounded-lg font-bold border transition-all ${
                          settings.playerHp === hp
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {hp} HP
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fall Damage */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Fall Damage
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[false, true].map((val) => (
                      <button
                        key={String(val)}
                        onClick={() => { soundManager.playClick(); setSettings({ ...settings, fallDamage: val }); }}
                        className={`p-2.5 rounded-lg font-bold border transition-all ${
                          settings.fallDamage === val
                            ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        {val ? 'DAMAGE ON' : 'NO DAMAGE'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SPECTATORS' && (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 uppercase">
                    Active Spectator Slots (Host / Referee)
                  </span>
                  <span className="text-xs text-amber-400 font-mono">Max 4 Spectators</span>
                </div>

                <div className="space-y-2">
                  {spectators.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 text-xs"
                    >
                      <div className="flex items-center space-x-2 text-gray-300 font-medium">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>{spec}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        MONITORING
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-gray-400">
                  <strong className="text-amber-300">Spectator Rule:</strong> Moderator match ko live free-cam ya kisi bhi player ke view se observe kar sakta hai baghair match gameplay ko directly disturb kiye.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-[#0a0d14] border-t border-white/10">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span className="font-mono text-emerald-400 font-bold">32/32 Players Ready</span>
            <span>•</span>
            <span>Mode: {settings.mode} ({settings.ammo} AMMO)</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleStartMatch(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Eye className="w-4 h-4 text-cyan-400" />
              <span>Enter as Spectator</span>
            </button>

            <button
              onClick={() => handleStartMatch(false)}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-heading font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>START 32-PLAYER MATCH</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
