import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { VaultItem } from '../types/game';
import { Briefcase, Shield, Zap, Sparkles, Check, ChevronUp, X } from 'lucide-react';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose }) => {
  const {
    vaultItems,
    equippedBundle,
    equippedWeapon,
    equippedGlooWall,
    equipVaultItem,
    upgradeEvoWeapon,
    diamonds
  } = useGame();

  const [activeCategory, setActiveCategory] = useState<'bundle' | 'weapon' | 'gloo_wall' | 'emote'>('bundle');
  const [selectedItem, setSelectedItem] = useState<VaultItem>(equippedBundle);

  if (!isOpen) return null;

  const filteredItems = vaultItems.filter((item) => item.category === activeCategory);

  const isEquipped = (item: VaultItem) => {
    if (item.category === 'bundle') return equippedBundle.id === item.id;
    if (item.category === 'weapon') return equippedWeapon.id === item.id;
    if (item.category === 'gloo_wall') return equippedGlooWall.id === item.id;
    return false;
  };

  const rarityColor = (rarity: VaultItem['rarity']) => {
    switch (rarity) {
      case 'evo':
        return 'border-amber-400 text-amber-300 bg-amber-950/30';
      case 'mythic':
        return 'border-red-500 text-red-400 bg-red-950/30';
      case 'epic':
        return 'border-purple-500 text-purple-300 bg-purple-950/30';
      default:
        return 'border-blue-500 text-blue-300 bg-blue-950/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl bg-[#06080f] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 px-4 sm:px-6 py-3 flex items-center justify-between text-black">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-black" />
            <div>
              <h2 className="font-chakra font-black text-lg sm:text-xl tracking-wider uppercase">
                VAULT & WEAPON ARMORY
              </h2>
              <p className="text-xs text-black/90 font-bold">
                Legendary Bundles, Evo Guns Level 7, Gloo Walls & Emotes
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

        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-2.5 bg-[#04060a] border-b border-slate-800 text-xs font-chakra">
          {[
            { id: 'bundle', label: '🥋 Bundles & Outfits' },
            { id: 'weapon', label: '🔫 Evo Weapons & Armory' },
            { id: 'gloo_wall', label: '🛡️ Gloo Wall Skins' },
            { id: 'emote', label: '🕺 Legendary Emotes' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as typeof activeCategory);
                const first = vaultItems.find((i) => i.category === cat.id);
                if (first) setSelectedItem(first);
              }}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#06080f]">
          {/* Left Grid: Items List */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3 auto-rows-max">
            {filteredItems.map((item) => {
              const equipped = isEquipped(item);
              const isSelected = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all aspect-square ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-[#090d16] border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-chakra px-1.5 py-0.5 rounded border uppercase font-black ${rarityColor(item.rarity)}`}>
                      {item.rarity}
                    </span>
                    {equipped && (
                      <span className="text-[9px] bg-emerald-500 text-black font-chakra font-black px-1.5 rounded">
                        EQUIPPED
                      </span>
                    )}
                  </div>

                  <div className="my-auto text-center">
                    <div className="text-4xl my-1 filter drop-shadow">{item.image}</div>
                    <span className="font-chakra font-black text-xs text-white line-clamp-1 block">
                      {item.name}
                    </span>
                  </div>

                  {item.evoLevel !== undefined && (
                    <div className="text-[10px] text-amber-400 font-teko text-sm text-center font-bold">
                      Evo Level {item.evoLevel}/{item.maxEvoLevel}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Panel: Selected Item Showcase */}
          <div className="md:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Item Showcase Card */}
              <div className="relative p-6 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 text-center overflow-hidden">
                {selectedItem.category === 'weapon' && selectedItem.id === 'weapon_ak47_draco' ? (
                  <div className="h-36 w-full rounded-lg overflow-hidden mb-2">
                    <img
                      src="/src/assets/images/ff_evo_gun_banner_1790532656052.jpg"
                      alt={selectedItem.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="text-7xl my-4 animate-bounce">{selectedItem.image}</div>
                )}

                <div className="font-chakra font-bold text-lg text-white">
                  {selectedItem.name}
                </div>
                <div className={`inline-block mt-1 text-[11px] font-chakra px-2 py-0.5 rounded border uppercase font-bold ${rarityColor(selectedItem.rarity)}`}>
                  {selectedItem.rarity.toUpperCase()} GRADE
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 font-sans-clean leading-relaxed">
                {selectedItem.description}
              </p>

              {/* Stats Breakdown (if weapon) */}
              {selectedItem.stats && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5 text-xs font-chakra">
                  <span className="text-amber-400 font-bold block mb-1">Combat Attributes:</span>
                  {selectedItem.stats.damage && (
                    <div className="flex justify-between text-slate-300">
                      <span>Damage</span>
                      <span className="text-emerald-400 font-bold">{selectedItem.stats.damage}</span>
                    </div>
                  )}
                  {selectedItem.stats.rateOfFire && (
                    <div className="flex justify-between text-slate-300">
                      <span>Rate of Fire</span>
                      <span className="text-emerald-400 font-bold">{selectedItem.stats.rateOfFire}</span>
                    </div>
                  )}
                  {selectedItem.stats.armorPenetration && (
                    <div className="flex justify-between text-slate-300">
                      <span>Armor Penetration</span>
                      <span className="text-yellow-400 font-bold">{selectedItem.stats.armorPenetration}</span>
                    </div>
                  )}
                  {selectedItem.stats.reloadSpeed && (
                    <div className="flex justify-between text-slate-300">
                      <span>Reload Speed</span>
                      <span className="text-slate-400">{selectedItem.stats.reloadSpeed}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Evo Upgrade Button */}
              {selectedItem.evoLevel !== undefined && (
                <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-chakra font-bold text-amber-300">
                      Evo Gun Evolution Level:
                    </span>
                    <span className="font-teko text-lg text-amber-400 font-bold">
                      Lv. {selectedItem.evoLevel} / {selectedItem.maxEvoLevel} MAX
                    </span>
                  </div>
                  {selectedItem.evoLevel < (selectedItem.maxEvoLevel || 7) ? (
                    <button
                      onClick={() => upgradeEvoWeapon(selectedItem.id)}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-chakra font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow"
                    >
                      <ChevronUp className="w-4 h-4" />
                      UPGRADE TO LEVEL 7 MAX (1,000 💎)
                    </button>
                  ) : (
                    <div className="text-center text-xs text-amber-400 font-chakra font-bold py-1">
                      ✨ MAX LEVEL 7 AWAKENED (Special Blue Fire Effect Active)
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Equip CTA */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <button
                onClick={() => equipVaultItem(selectedItem)}
                disabled={isEquipped(selectedItem)}
                className={`w-full py-3 rounded-xl font-chakra font-bold text-sm tracking-wider uppercase shadow-lg transition-transform active:scale-95 ${
                  isEquipped(selectedItem)
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950'
                }`}
              >
                {isEquipped(selectedItem) ? 'CURRENTLY EQUIPPED' : `EQUIP ${selectedItem.name}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
