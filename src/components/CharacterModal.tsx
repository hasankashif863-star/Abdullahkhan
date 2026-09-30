import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Character, Skill } from '../types/game';
import { soundManager } from '../utils/sound';
import { Users, Zap, Shield, Sparkles, Check, X } from 'lucide-react';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({ isOpen, onClose }) => {
  const {
    characters,
    equippedCharacter,
    setEquippedCharacter,
    allSkills,
    equippedActiveSkill,
    equippedPassiveSkills,
    equipSkillToSlot
  } = useGame();

  const [selectedChar, setSelectedChar] = useState<Character>(equippedCharacter);
  const [selectedSlotForSwap, setSelectedSlotForSwap] = useState<'active' | 0 | 1 | 2 | null>(null);

  if (!isOpen) return null;

  const handleSelectCharacter = (char: Character) => {
    setSelectedChar(char);
    soundManager.playSkillActivate();
  };

  const handleEquipCharacter = () => {
    setEquippedCharacter(selectedChar);
    // Automatically set default active skill to this character's signature active if active
    if (selectedChar.activeSkill.type === 'ACTIVE') {
      equipSkillToSlot('active', selectedChar.activeSkill);
    }
    soundManager.playBooyah();
  };

  const activeSkillsList = allSkills.filter((s) => s.type === 'ACTIVE');
  const passiveSkillsList = allSkills.filter((s) => s.type === 'PASSIVE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl bg-[#06080f] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 px-4 sm:px-6 py-3 flex items-center justify-between text-black">
          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-black" />
            <div>
              <h2 className="font-chakra font-black text-lg sm:text-xl tracking-wider uppercase">
                CHARACTERS & SKILL COMBINATION WORKSHOP
              </h2>
              <p className="text-xs text-black/90 font-bold">
                Change character and customize 1 Active Skill + 3 Passive Skill slots
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

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#06080f]">
          {/* Left Column: Character Roster */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="font-chakra font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              Select Character
            </h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {characters.map((char) => {
                const isEquipped = equippedCharacter.id === char.id;
                const isSelected = selectedChar.id === char.id;
                return (
                  <button
                    key={char.id}
                    onClick={() => handleSelectCharacter(char)}
                    className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-[#090d16] border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#05070a] border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-xl">
                      {char.avatar ? (
                        <img
                          src={char.avatar}
                          alt={char.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{char.activeSkill.icon}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-chakra font-black text-sm text-white truncate">
                          {char.name}
                        </span>
                        {isEquipped && (
                          <span className="text-[10px] bg-emerald-500 text-black font-chakra font-black px-1.5 py-0.2 rounded">
                            EQUIPPED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-chakra truncate block">
                        {char.title}
                      </span>
                      <span className="text-[11px] text-amber-400 font-teko text-sm tracking-wide block truncate">
                        Skill: {char.activeSkill.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Center Column: Character Visual & Quote */}
          <div className="lg:col-span-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="relative aspect-square rounded-xl overflow-hidden border border-slate-700 bg-slate-900 mb-4 flex items-center justify-center">
                {selectedChar.id === 'char_alok' ? (
                  <img
                    src="/src/assets/images/ff_alok_hero_1790532645545.jpg"
                    alt={selectedChar.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-6xl">
                    <span>{selectedChar.activeSkill.icon}</span>
                    <span className="text-sm font-chakra text-amber-400 mt-2 font-bold">
                      {selectedChar.name}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] font-chakra text-amber-400 border border-amber-500/30">
                  AWAKENED
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-chakra font-bold text-xl text-white">
                  {selectedChar.name}
                </h3>
                <p className="text-xs text-amber-300 font-chakra italic">
                  {selectedChar.quote}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed font-sans-clean">
                  {selectedChar.biography}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={handleEquipCharacter}
                disabled={equippedCharacter.id === selectedChar.id}
                className={`w-full py-3 rounded-xl font-chakra font-bold text-sm tracking-wider uppercase shadow-lg transition-transform active:scale-95 ${
                  equippedCharacter.id === selectedChar.id
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950'
                }`}
              >
                {equippedCharacter.id === selectedChar.id ? 'CURRENTLY EQUIPPED' : `EQUIP ${selectedChar.name}`}
              </button>
            </div>
          </div>

          {/* Right Column: 4 Skill Slots (1 Active + 3 Passive) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h3 className="font-chakra font-bold text-sm text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Active Skill Slot (Signature Aura)
              </h3>
              <div
                onClick={() => setSelectedSlotForSwap('active')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedSlotForSwap === 'active'
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-2xl">{equippedActiveSkill.icon}</span>
                  <div>
                    <span className="font-chakra font-bold text-sm text-cyan-200 block">
                      {equippedActiveSkill.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      From: {equippedActiveSkill.characterName} (CD: {equippedActiveSkill.cooldownSeconds}s)
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 font-sans-clean leading-relaxed">
                  {equippedActiveSkill.description}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-chakra font-bold text-sm text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Passive Skill Slots (3 Slots)
              </h3>
              <div className="space-y-2">
                {equippedPassiveSkills.map((passiveSkill, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedSlotForSwap(idx as 0 | 1 | 2)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      selectedSlotForSwap === idx
                        ? 'bg-purple-950/40 border-purple-400 shadow-md shadow-purple-500/20'
                        : 'bg-slate-950/80 border-slate-800 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{passiveSkill.icon}</span>
                        <div>
                          <span className="font-chakra font-bold text-xs text-purple-200">
                            Slot {idx + 1}: {passiveSkill.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {passiveSkill.characterName}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-purple-400 font-chakra">
                        CLICK TO CHANGE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Swap Picker Drawer */}
            {selectedSlotForSwap !== null && (
              <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-chakra font-bold text-amber-400">
                    Swap Skill for {selectedSlotForSwap === 'active' ? 'Active Slot' : `Passive Slot ${selectedSlotForSwap + 1}`}
                  </span>
                  <button
                    onClick={() => setSelectedSlotForSwap(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {(selectedSlotForSwap === 'active' ? activeSkillsList : passiveSkillsList).map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => {
                        equipSkillToSlot(selectedSlotForSwap, skill);
                        setSelectedSlotForSwap(null);
                      }}
                      className="w-full p-2 bg-slate-900 hover:bg-slate-800 rounded-lg text-left border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span>{skill.icon}</span>
                        <div>
                          <span className="font-bold text-white block">{skill.name}</span>
                          <span className="text-[10px] text-slate-400">{skill.characterName}</span>
                        </div>
                      </div>
                      <span className="text-amber-400 font-teko text-sm">EQUIP</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
