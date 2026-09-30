import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Shield,
  Crosshair,
  Map,
  Users,
  Car,
  Server,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Code
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface DevPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevPlanModal: React.FC<DevPlanModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<
    'CORE' | 'MAP' | 'WEAPONS' | '32PLAYER' | 'VEHICLES' | 'SAFEZONE' | 'MODERATOR' | 'LOBBY'
  >('MODERATOR');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#07090e] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0a0d14] border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <BookOpen className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-white tracking-wider">
                BATTLE ROYALE ARCHITECTURE & MODERATOR MANUAL
              </h2>
              <p className="text-xs text-gray-400">
                Complete PC/Mobile Game Development Roadmap & Chief Moderator System
              </p>
            </div>
          </div>

          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-4 py-2 bg-[#080b11] border-b border-white/5 overflow-x-auto gap-1 text-xs font-bold uppercase tracking-wider scrollbar-none">
          {[
            { id: 'MODERATOR', label: '👮 Moderator Rights', icon: Shield },
            { id: '32PLAYER', label: '🌐 32-Player Network', icon: Users },
            { id: 'VEHICLES', label: '🚗 Vehicle System', icon: Car },
            { id: 'WEAPONS', label: '🔫 Weapons & Evo', icon: Crosshair },
            { id: 'SAFEZONE', label: '🔵 Safe Zone Math', icon: Zap },
            { id: 'MAP', label: '🗺️ Map & Loot', icon: Map },
            { id: 'LOBBY', label: '🏠 3D Lobby & UI', icon: Layers },
            { id: 'CORE', label: '⚙️ Game Engine', icon: Server }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { soundManager.playClick(); setActiveSection(tab.id as typeof activeSection); }}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-black font-black shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#06080e] text-gray-300 text-sm leading-relaxed space-y-6">
          {activeSection === 'MODERATOR' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
                <h3 className="font-heading font-black text-amber-400 text-base flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>MODERATOR PERMISSION HIERARCHY</span>
                </h3>
                <div className="mt-2 text-xs text-gray-300 flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30">OWNER</span>
                  <span>➔</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">ADMIN</span>
                  <span>➔</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-black">MODERATOR (Aap)</span>
                  <span>➔</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">HELPER</span>
                  <span>➔</span>
                  <span className="px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 font-bold">PLAYER</span>
                </div>
              </div>

              {/* What Mod CAN do vs CANNOT do */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#090d16] border border-emerald-500/30 space-y-3">
                  <h4 className="font-heading font-black text-emerald-400 text-sm flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>MODERATOR KYA KAR SAKTA HAI (Permissions)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Custom Room Manage Karna:</strong> 32 players ke slots organize karna, teams swap karna, aur kick karna.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Spectator Mode Monitor:</strong> Free-cam ya players ke perspective se live match bina interfere kiye dekhna.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Chat & Report Moderation:</strong> Inappropriate messages delete karna aur toxic players ko temporary mute karna.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Anti-Cheat Review Flagging:</strong> Suspicious aimbot ya speed-hackers ko review ke liye mark/suspend karna.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Tournament Rule Enforcement:</strong> Banned weapons, improper team comps ko verify karna aur warnings bhejna.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span><strong>Airdrop & Event Triggers:</strong> Special match events ya airdrop drops launch karna.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-[#090d16] border border-red-500/30 space-y-3">
                  <h4 className="font-heading font-black text-red-400 text-sm flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>MODERATOR KO KYA NAHI KARNA CHAHIYE (Restrictions)</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>User Passwords Dekhna:</strong> Security risk—kisi player ke private credentials access nahi hote.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>Account Delete Karna:</strong> Ye authority sirf Lead Admin/Owner ke pas hoti hai.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>Database Direct Tampering:</strong> Production database SQL table drop karna ya bypass karna mana hai.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-400 font-bold">✕</span>
                      <span><strong>Ranked Matches Mein Unfair Advantage:</strong> Normal ranked match mein god-mode ya illegal wall-hacks use nahi karne chahiye.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === '32PLAYER' && (
            <div className="space-y-6">
              <h3 className="font-heading font-black text-white text-base">
                🌐 32-PLAYER ONLINE MULTIPLAYER NETWORKING ARCHITECTURE
              </h3>

              <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-3">
                <div className="font-mono text-xs text-amber-400 bg-black/50 p-4 rounded-lg overflow-x-auto whitespace-pre">
{`Match #1001 (Dedicated Match Server)
 ├── Player 1 (Local Client)  ➔ Tick Rate: 60Hz UDP
 ├── Player 2 (Squad 1)       ➔ Interpolation & State Replication
 ├── Player 3 (Squad 1)       ➔ Position (X, Y, Z, Pitch, Yaw)
 ├── ...
 └── Player 32 (Squad 8)      ➔ Total 8 Squads (32 Players)`}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-amber-400 font-bold block mb-1">1. Server Authority</span>
                    Bullet hit calculations, health decreases, aur safe zone shrinking hamesha server authority par hona chahiye (client trust zero).
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-cyan-400 font-bold block mb-1">2. Client Prediction</span>
                    Local movement aur gun recoil instant render hoti hai takay 50-100ms ping par bhi zero input lag feel ho.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-purple-400 font-bold block mb-1">3. Lag Compensation</span>
                    Server snapshot rollback algorithm ke zariye fast-moving targets par exact shot hit register karta hai.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'VEHICLES' && (
            <div className="space-y-6">
              <h3 className="font-heading font-black text-white text-base flex items-center space-x-2">
                <Car className="w-5 h-5 text-emerald-400" />
                <span>🚗 REALISTIC VEHICLE MECHANICS & SYSTEM</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2 text-xs">
                  <strong className="text-emerald-400 block font-heading text-sm">Vehicle Controls & Actions:</strong>
                  <ul className="space-y-1.5 text-gray-300">
                    <li>• <strong>Enter / Exit:</strong> Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-amber-400">F</kbd> jab car ke 3m radius mein hon.</li>
                    <li>• <strong>Driving Speed:</strong> Normal sprint speed 2.2x se barh kar 5.5x (120 km/h) ho jati hai.</li>
                    <li>• <strong>Roadkill Collision:</strong> Enemy par gari chadhane se instant 150-200 damage aur knockdown hota hai.</li>
                    <li>• <strong>Nitro Boost:</strong> Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-cyan-400">SHIFT</kbd> for turbo speed boost.</li>
                    <li>• <strong>Car Horn:</strong> Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono text-gray-200">H</kbd> to honk horn.</li>
                    <li>• <strong>Vehicle HP & Destruction:</strong> Gari par 400 HP hoti hai; damage lene par smoke nikalta hai aur blast ho sakti hai.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2 text-xs">
                  <strong className="text-amber-400 block font-heading text-sm">Vehicle Types in Roadmap:</strong>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-white/5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Cyber Sports Car</span>
                        <span className="text-gray-400 text-[11px]">Highest acceleration, 140 km/h top speed, 2 seats</span>
                      </div>
                      <span className="text-cyan-400 font-mono font-bold">140 KM/H</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Monster Truck</span>
                        <span className="text-gray-400 text-[11px]">Heavy armor, climb steep hills, high roadkill damage</span>
                      </div>
                      <span className="text-amber-400 font-mono font-bold">850 HP</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">Military Jeep</span>
                        <span className="text-gray-400 text-[11px]">Full 4-player squad transport vehicle</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold">4 SEATER</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'WEAPONS' && (
            <div className="space-y-6">
              <h3 className="font-heading font-black text-white text-base">
                🔫 WEAPON CATEGORIES, ATTRIBUTES & EVO PROGRESSION
              </h3>

              <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#090d16]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-black/60 text-gray-400 uppercase font-bold border-b border-white/10">
                    <tr>
                      <th className="p-3">Weapon</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Base Damage</th>
                      <th className="p-3">Rate of Fire</th>
                      <th className="p-3">Magazine</th>
                      <th className="p-3">Range</th>
                      <th className="p-3">Evo Levels</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-amber-400">AK-47 Blue Flame Draco</td>
                      <td className="p-3 text-cyan-400">Assault Rifle (AR)</td>
                      <td className="p-3">61 HP</td>
                      <td className="p-3">High (+2)</td>
                      <td className="p-3">30 Bullets</td>
                      <td className="p-3">72m</td>
                      <td className="p-3 font-bold text-purple-400">7 (Max Wings & Aura)</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-red-400">MP40 Predatory Cobra</td>
                      <td className="p-3 text-red-300">SMG</td>
                      <td className="p-3">48 HP</td>
                      <td className="p-3">Very High (+3)</td>
                      <td className="p-3">32 Bullets</td>
                      <td className="p-3">22m</td>
                      <td className="p-3 font-bold text-purple-400">7 (Venom Aura & Reload)</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-yellow-400">M1887 Golden Dragon</td>
                      <td className="p-3 text-yellow-300">Shotgun (SG)</td>
                      <td className="p-3">100x2 HP</td>
                      <td className="p-3">Medium</td>
                      <td className="p-3">2 Shells</td>
                      <td className="p-3">15m</td>
                      <td className="p-3 font-bold text-purple-400">5 Levels</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-emerald-400">AWM Arctic Sniper</td>
                      <td className="p-3 text-emerald-300">Sniper Rifle</td>
                      <td className="p-3">150 HP (300 Head)</td>
                      <td className="p-3">Low</td>
                      <td className="p-3">5 Bullets</td>
                      <td className="p-3">150m</td>
                      <td className="p-3 text-gray-500">Legendary Skin</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="p-3 font-bold text-blue-400">Desert Eagle Cyber</td>
                      <td className="p-3 text-blue-300">Pistol</td>
                      <td className="p-3">90 HP</td>
                      <td className="p-3">Medium</td>
                      <td className="p-3">7 Bullets</td>
                      <td className="p-3">35m</td>
                      <td className="p-3 text-gray-500">Standard Skin</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'SAFEZONE' && (
            <div className="space-y-6">
              <h3 className="font-heading font-black text-white text-base">
                🔵 SAFE ZONE SHRINKING & DAMAGE TIMELINE
              </h3>

              <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-3 text-xs">
                <div className="font-mono text-cyan-400 bg-black/50 p-4 rounded-lg overflow-x-auto whitespace-pre">
{`Zone 1 (0:00 - 2:00) : 1000m Diameter ➔ 1 HP / sec damage
Zone 2 (2:00 - 3:30) : 700m Diameter  ➔ 2 HP / sec damage
Zone 3 (3:30 - 4:45) : 450m Diameter  ➔ 4 HP / sec damage
Zone 4 (4:45 - 5:30) : 250m Diameter  ➔ 8 HP / sec damage
Final Zone (5:30+)   : 50m Diameter   ➔ 15 HP / sec damage (Sudden Death)`}
                </div>
                <p className="text-gray-400">
                  Player jab safe zone se bahar hota hai, toxic gas damage-over-time apply karti hai. Gloo wall storm damage block nahi karti lekin enemy fire se shelter deti hai.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'MAP' && (
            <div className="space-y-6">
              <h3 className="font-heading font-black text-white text-base">
                🗺️ MAP STRUCTURE & LOOT DISTRIBUTION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-[#090d16] border border-amber-500/20">
                  <span className="font-bold text-amber-400 block mb-1">Clock Tower / Peak</span>
                  <span className="text-gray-400">High-tier loot zone (AK-47 Draco, Lv 3 Armor, AWM drop). Maximum combat intensity.</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-cyan-500/20">
                  <span className="font-bold text-cyan-400 block mb-1">Pochinok / Mill</span>
                  <span className="text-gray-400">Dense buildings with abundant medkits, SMG ammo, and Gloo Wall grenades.</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-purple-500/20">
                  <span className="font-bold text-purple-400 block mb-1">Hangar & Airbase</span>
                  <span className="text-gray-400">Vehicle garage with Sports Car & Monster Truck spawns and runway combat.</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090d16] border border-emerald-500/20">
                  <span className="font-bold text-emerald-400 block mb-1">Cape Town & Rim Nam</span>
                  <span className="text-gray-400">Coastal water zones, bridges, and safe drop locations for early loot collection.</span>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'LOBBY' && (
            <div className="space-y-6">
              <h3 className="font-heading font-black text-white text-base">
                🏠 3D REALISTIC LOBBY & CUSTOM ROOM INTEGRATION
              </h3>

              <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-3 text-xs text-gray-300">
                <p>
                  <strong>Lobby Design Guidelines:</strong>
                  Lobby sirf menu nahi balke player ka live showcase hota hai. Is mein 3D operator, active weapon with glowing flame particles, 4-man squad slots, aur realistic lighting effects rehte hain.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 rounded-lg bg-white/5">
                    <strong className="text-amber-400 block">Esports Custom Room:</strong>
                    32-player grid jisme host sab ko arrange kar sakta hai, rules customize kar sakta hai (Unlimited Gloo Walls / Ammo), aur spectator mode mein monitor kar sakta hai.
                  </div>
                  <div className="p-3 rounded-lg bg-white/5">
                    <strong className="text-cyan-400 block">Fast Matchmaking:</strong>
                    Countdown timer (0:05s) ke sath 32 players instant lobby se airdrop plane mein load ho jate hain.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'CORE' && (
            <div className="space-y-6">
              <h3 className="font-heading font-black text-white text-base">
                ⚙️ GAME ENGINES & TECH STACK RECOMMENDATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <strong className="text-amber-400 font-bold text-sm block">For Standalone PC/Mobile 3D Game:</strong>
                  <ul className="space-y-1.5 text-gray-300">
                    <li>• <strong>Engine:</strong> Unreal Engine 5 (Lyra Starter Game) ya Unity (Netcode for GameObjects).</li>
                    <li>• <strong>Backend Server:</strong> Node.js / Go WebSocket or Agones Dedicated Game Server on Kubernetes.</li>
                    <li>• <strong>Networking:</strong> Photon Fusion / Mirror Networking with authoritative physics.</li>
                    <li>• <strong>Database:</strong> PostgreSQL / Supabase for player inventory, ranks, and skins.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-[#090d16] border border-white/5 space-y-2">
                  <strong className="text-cyan-400 font-bold text-sm block">Web / Instant Playable Prototype:</strong>
                  <ul className="space-y-1.5 text-gray-300">
                    <li>• <strong>Frontend:</strong> React + HTML5 Canvas 60 FPS Engine + Web Audio Synthesizer.</li>
                    <li>• <strong>State Management:</strong> React Context + Local Storage persistent inventory.</li>
                    <li>• <strong>Audio:</strong> Native Web Audio oscillator synthesis (no external broken audio files).</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#0a0d14] border-t border-white/10 text-xs text-gray-400">
          <span>Chief Moderator Architecture Manual • Ready for 32-Player Tournament Deployment</span>
          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-heading font-black uppercase tracking-wider transition-all"
          >
            Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
