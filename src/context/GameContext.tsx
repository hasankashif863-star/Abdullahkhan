import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Character,
  Skill,
  VaultItem,
  LuckRoyaleWheel,
  LuckRoyalePrize,
  GameEvent,
  Player,
  DailyRewardDay
} from '../types/game';
import {
  INITIAL_CHARACTERS,
  INITIAL_SKILLS,
  INITIAL_VAULT_ITEMS,
  INITIAL_LUCK_ROYALES,
  INITIAL_EVENTS,
  INITIAL_PLAYERS,
  generate365DailyRewards
} from '../data/mockData';
import { soundManager } from '../utils/sound';
import { battleAudioEngine } from '../utils/battleAudioEngine';

interface ModeratorLog {
  id: string;
  timestamp: string;
  action: string;
  recipient: string;
  detail: string;
}

interface GameContextType {
  // Player stats
  playerName: string;
  setPlayerName: (name: string) => void;
  level: number;
  rank: string;
  diamonds: number;
  gold: number;
  badges: number;
  soundMuted: boolean;
  toggleMute: () => void;

  // Characters & Skills
  characters: Character[];
  equippedCharacter: Character;
  setEquippedCharacter: (char: Character) => void;
  allSkills: Skill[];
  equippedActiveSkill: Skill;
  setEquippedActiveSkill: (skill: Skill) => void;
  equippedPassiveSkills: Skill[];
  setEquippedPassiveSkills: (skills: Skill[]) => void;
  equipSkillToSlot: (slot: 'active' | 0 | 1 | 2, skill: Skill) => void;

  // Vault & Inventory
  vaultItems: VaultItem[];
  equippedBundle: VaultItem;
  equippedWeapon: VaultItem;
  equippedGlooWall: VaultItem;
  equipVaultItem: (item: VaultItem) => void;
  upgradeEvoWeapon: (weaponId: string) => boolean;

  // Luck Royale
  luckRoyaleWheels: LuckRoyaleWheel[];
  spinRoyale: (wheelId: string, count: number) => LuckRoyalePrize[];
  luckMeter: Record<string, number>;

  // Daily Rewards (365 days & Oct 18)
  currentDayStreak: number;
  claimedDays: number[];
  october18Claimed: boolean;
  dailyRewardsList: DailyRewardDay[];
  claimDailyReward: (day: number) => { success: boolean; message: string };
  claimOctober18SpecialReward: () => { success: boolean; message: string };
  fastForwardStreakDays: (daysToAdd: number) => void;

  // Events
  events: GameEvent[];
  claimEventTask: (eventId: string, taskId: string) => void;

  // Moderator / Admin Suite
  isModerator: boolean;
  godModeEnabled: boolean;
  toggleGodMode: () => void;
  playersList: Player[];
  moderatorLogs: ModeratorLog[];
  serverAnnouncement: string | null;
  clearAnnouncement: () => void;
  broadcastAnnouncement: (msg: string) => void;
  sendDiamondsToPlayer: (playerId: string | 'ALL', amount: number, note?: string) => void;
  sendBadgesToPlayer: (playerId: string | 'ALL', amount: number) => void;
  injectMoneyTopUp: (dollarAmount: number, diamondEquivalent: number) => void;
  unlockEverythingAdmin: () => void;
  setRoyaleInstantGrandPrize: boolean;
  toggleRoyaleInstantGrandPrize: () => void;

  // Currency modifications
  addDiamonds: (amt: number) => void;
  spendDiamonds: (amt: number) => boolean;
  addGold: (amt: number) => void;
  spendGold: (amt: number) => boolean;
  addBadges: (amt: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sound state
  const [soundMuted, setSoundMuted] = useState<boolean>(() => {
    return localStorage.getItem('ff_muted') === 'true';
  });

  const toggleMute = () => {
    setSoundMuted((prev) => {
      const next = !prev;
      soundManager.isMuted = next;
      battleAudioEngine.setMuted(next);
      localStorage.setItem('ff_muted', String(next));
      return next;
    });
  };

  // Player & Currencies
  const [playerName, setPlayerName] = useState<string>('Boss_Moderator_786');
  const [level, setLevel] = useState<number>(78);
  const [rank, setRank] = useState<string>('Grandmaster');
  const [diamonds, setDiamonds] = useState<number>(() => {
    const saved = localStorage.getItem('ff_diamonds');
    return saved !== null ? Number(saved) : 99999;
  });
  const [gold, setGold] = useState<number>(() => {
    const saved = localStorage.getItem('ff_gold');
    return saved !== null ? Number(saved) : 550000;
  });
  const [badges, setBadges] = useState<number>(() => {
    const saved = localStorage.getItem('ff_badges');
    return saved !== null ? Number(saved) : 650;
  });

  // Characters & Skills
  const [characters] = useState<Character[]>(INITIAL_CHARACTERS);
  const [equippedCharacter, setEquippedCharacter] = useState<Character>(INITIAL_CHARACTERS[0]);
  const [allSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [equippedActiveSkill, setEquippedActiveSkill] = useState<Skill>(INITIAL_SKILLS[0]);
  const [equippedPassiveSkills, setEquippedPassiveSkills] = useState<Skill[]>([
    INITIAL_SKILLS[5], // Kelly Dash
    INITIAL_SKILLS[6], // Hayato Bushido
    INITIAL_SKILLS[7]  // Moco Hacker's Eye
  ]);

  // Vault
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);
  const [equippedBundle, setEquippedBundle] = useState<VaultItem>(INITIAL_VAULT_ITEMS[0]);
  const [equippedWeapon, setEquippedWeapon] = useState<VaultItem>(INITIAL_VAULT_ITEMS[6]); // AK Draco
  const [equippedGlooWall, setEquippedGlooWall] = useState<VaultItem>(INITIAL_VAULT_ITEMS[10]);

  // Luck Royale
  const [luckRoyaleWheels] = useState<LuckRoyaleWheel[]>(INITIAL_LUCK_ROYALES);
  const [luckMeter, setLuckMeter] = useState<Record<string, number>>({
    faded_wheel: 40,
    diamond_royale: 25,
    weapon_royale: 30
  });
  const [setRoyaleInstantGrandPrize, setSetRoyaleInstantGrandPrize] = useState<boolean>(false);

  // Daily Rewards (365 days)
  const [dailyRewardsList] = useState<DailyRewardDay[]>(generate365DailyRewards());
  const [currentDayStreak, setCurrentDayStreak] = useState<number>(() => {
    const s = localStorage.getItem('ff_streak');
    return s ? Number(s) : 1;
  });
  const [claimedDays, setClaimedDays] = useState<number[]>(() => {
    try {
      const c = localStorage.getItem('ff_claimed_days');
      return c ? JSON.parse(c) : [];
    } catch {
      return [];
    }
  });
  const [october18Claimed, setOctober18Claimed] = useState<boolean>(() => {
    return localStorage.getItem('ff_oct18_claimed') === 'true';
  });

  // Events
  const [events, setEvents] = useState<GameEvent[]>(INITIAL_EVENTS);

  // Moderator Suite
  const [isModerator] = useState<boolean>(true);
  const [godModeEnabled, setGodModeEnabled] = useState<boolean>(false);
  const [playersList, setPlayersList] = useState<Player[]>(INITIAL_PLAYERS);
  const [moderatorLogs, setModeratorLogs] = useState<ModeratorLog[]>([
    {
      id: 'log_0',
      timestamp: 'Today, 10:00 AM',
      action: 'SERVER_BOOT',
      recipient: 'All Players',
      detail: 'Moderator Suite initialized. Ready for diamond distribution & badge granting.'
    }
  ]);
  const [serverAnnouncement, setServerAnnouncement] = useState<string | null>(
    '📢 SERVER NOTICE: Main Moderator Boss_Moderator_786 is online! Exclusive October 18th Rewards & Free Badges activated!'
  );

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('ff_diamonds', String(diamonds));
  }, [diamonds]);

  useEffect(() => {
    localStorage.setItem('ff_gold', String(gold));
  }, [gold]);

  useEffect(() => {
    localStorage.setItem('ff_badges', String(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('ff_streak', String(currentDayStreak));
  }, [currentDayStreak]);

  useEffect(() => {
    localStorage.setItem('ff_claimed_days', JSON.stringify(claimedDays));
  }, [claimedDays]);

  useEffect(() => {
    localStorage.setItem('ff_oct18_claimed', String(october18Claimed));
  }, [october18Claimed]);

  const addDiamonds = (amt: number) => {
    setDiamonds((prev) => prev + amt);
    soundManager.playDiamondClink();
  };

  const spendDiamonds = (amt: number) => {
    if (godModeEnabled) return true;
    if (diamonds >= amt) {
      setDiamonds((prev) => prev - amt);
      return true;
    }
    return false;
  };

  const addGold = (amt: number) => {
    setGold((prev) => prev + amt);
  };

  const spendGold = (amt: number) => {
    if (godModeEnabled) return true;
    if (gold >= amt) {
      setGold((prev) => prev - amt);
      return true;
    }
    return false;
  };

  const addBadges = (amt: number) => {
    setBadges((prev) => prev + amt);
    soundManager.playDiamondClink();
  };

  // Skill slot assignment
  const equipSkillToSlot = (slot: 'active' | 0 | 1 | 2, skill: Skill) => {
    soundManager.playClick();
    if (slot === 'active') {
      if (skill.type === 'ACTIVE') {
        setEquippedActiveSkill(skill);
      }
    } else {
      if (skill.type === 'PASSIVE') {
        setEquippedPassiveSkills((prev) => {
          const updated = [...prev];
          updated[slot] = skill;
          return updated;
        });
      }
    }
  };

  // Vault item equipping
  const equipVaultItem = (item: VaultItem) => {
    soundManager.playClick();
    if (item.category === 'bundle') {
      setEquippedBundle(item);
    } else if (item.category === 'weapon') {
      setEquippedWeapon(item);
    } else if (item.category === 'gloo_wall') {
      setEquippedGlooWall(item);
    }
  };

  // Upgrade Evo Weapon to max
  const upgradeEvoWeapon = (weaponId: string) => {
    const item = vaultItems.find((v) => v.id === weaponId);
    if (!item || !item.maxEvoLevel) return false;
    if (diamonds < 1000 && !godModeEnabled) return false;

    if (!godModeEnabled) {
      setDiamonds((prev) => prev - 1000);
    }
    setVaultItems((prev) =>
      prev.map((v) => (v.id === weaponId ? { ...v, evoLevel: item.maxEvoLevel } : v))
    );
    soundManager.playBooyah();
    return true;
  };

  // Spin Luck Royale
  const spinRoyale = (wheelId: string, count: number): LuckRoyalePrize[] => {
    const wheel = luckRoyaleWheels.find((w) => w.id === wheelId);
    if (!wheel) return [];

    const cost = count === 1 ? wheel.costPerSpin : wheel.costPer10Spins;
    if (!spendDiamonds(cost)) {
      return [];
    }

    const wonPrizes: LuckRoyalePrize[] = [];
    const currentLuck = luckMeter[wheelId] || 0;

    for (let i = 0; i < count; i++) {
      soundManager.playWheelTick();
      if (setRoyaleInstantGrandPrize || currentLuck >= 90) {
        // Guaranteed Grand Prize
        const grand = wheel.prizes.find((p) => p.rarity === 'grand') || wheel.prizes[0];
        wonPrizes.push(grand);
        setLuckMeter((prev) => ({ ...prev, [wheelId]: 0 }));
      } else {
        // Weighted random pick
        const rand = Math.random() * 100;
        let cumulative = 0;
        let selected = wheel.prizes[wheel.prizes.length - 1];

        for (const p of wheel.prizes) {
          cumulative += p.probability;
          if (rand <= cumulative) {
            selected = p;
            break;
          }
        }
        wonPrizes.push(selected);
        setLuckMeter((prev) => ({ ...prev, [wheelId]: Math.min(100, (prev[wheelId] || 0) + 5) }));
      }
    }

    // Apply any diamond prizes
    wonPrizes.forEach((p) => {
      if (p.type === 'diamonds' && p.amount) {
        setDiamonds((prev) => prev + p.amount!);
      }
    });

    return wonPrizes;
  };

  // Claim Daily Check-In Reward
  const claimDailyReward = (day: number) => {
    if (claimedDays.includes(day)) {
      return { success: false, message: `Day ${day} reward already claimed!` };
    }

    const reward = dailyRewardsList.find((d) => d.day === day);
    if (!reward) {
      return { success: false, message: 'Invalid reward day.' };
    }

    setClaimedDays((prev) => [...prev, day]);
    setDiamonds((prev) => prev + reward.diamonds);
    setGold((prev) => prev + reward.gold);
    setBadges((prev) => prev + reward.badges);
    soundManager.playDiamondClink();

    return {
      success: true,
      message: `Claimed Day ${day} reward! +${reward.diamonds.toLocaleString()} 💎 Diamonds, +${reward.gold.toLocaleString()} 🪙 Gold, +${reward.badges} 🎖️ Badges!`
    };
  };

  // Claim October 18 Mega Reward
  const claimOctober18SpecialReward = () => {
    if (october18Claimed) {
      return { success: false, message: 'October 18 Mega Jackpot already claimed!' };
    }

    setOctober18Claimed(true);
    setDiamonds((prev) => prev + 50000);
    setGold((prev) => prev + 200000);
    setBadges((prev) => prev + 500);

    // Equip the exclusive October 18 Mythic Phoenix & Golden Dragon M1887
    const phoenix = vaultItems.find((v) => v.id === 'bundle_oct18_phoenix');
    if (phoenix) setEquippedBundle(phoenix);

    const goldenDragon = vaultItems.find((v) => v.id === 'weapon_m1887_golden_dragon');
    if (goldenDragon) setEquippedWeapon(goldenDragon);

    soundManager.playBooyah();
    broadcastAnnouncement('🎉 OCTOBER 18 MEGA JACKPOT CLAIMED: +50,000 Diamonds & Mythic Phoenix Bundle Granted!');

    return {
      success: true,
      message: 'BOOYAH! Claimed October 18 Mega Jackpot: 50,000 Diamonds, 500 Badges, Mythic Phoenix Bundle & Golden Dragon M1887!'
    };
  };

  // Fast forward streak simulator for 1 year testing
  const fastForwardStreakDays = (daysToAdd: number) => {
    soundManager.playClick();
    setCurrentDayStreak((prev) => Math.min(365, prev + daysToAdd));
  };

  // Claim Event Tasks
  const claimEventTask = (eventId: string, taskId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;
    const task = event.tasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    if (task.rewardType === 'diamonds') {
      addDiamonds(task.rewardAmount);
    } else if (task.rewardType === 'badges') {
      addBadges(task.rewardAmount);
    }

    setEvents((prev) =>
      prev.map((e) => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          tasks: e.tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
        };
      })
    );
    soundManager.playDiamondClink();
  };

  // Moderator actions: "Sara badge ma sab ko du or ma mod rater hu ma ak mere pass sara option or ma sub ko paise se diamond du"
  const sendDiamondsToPlayer = (playerId: string | 'ALL', amount: number, note: string = 'Moderator Gift Drop') => {
    soundManager.playBooyah();
    const time = new Date().toLocaleTimeString();

    if (playerId === 'ALL') {
      setPlayersList((prev) =>
        prev.map((p) => ({
          ...p,
          diamonds: p.diamonds + amount
        }))
      );
      // Give to self too
      setDiamonds((prev) => prev + amount);

      const log: ModeratorLog = {
        id: 'log_' + Date.now(),
        timestamp: time,
        action: 'DIAMONDS_MASS_DROP',
        recipient: 'ALL SERVER PLAYERS',
        detail: `Sent +${amount.toLocaleString()} 💎 Diamonds to all ${playersList.length} online players! Note: "${note}"`
      };
      setModeratorLogs((prev) => [log, ...prev]);
      broadcastAnnouncement(`👑 MODERATOR DROP: Boss_Moderator_786 sent +${amount.toLocaleString()} Diamonds to EVERYONE! Check your vault!`);
    } else {
      setPlayersList((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, diamonds: p.diamonds + amount } : p))
      );
      const target = playersList.find((p) => p.id === playerId);
      const log: ModeratorLog = {
        id: 'log_' + Date.now(),
        timestamp: time,
        action: 'DIAMONDS_DIRECT_TRANSFER',
        recipient: target ? target.name : playerId,
        detail: `Sent +${amount.toLocaleString()} 💎 Diamonds to ${target ? target.name : playerId}`
      };
      setModeratorLogs((prev) => [log, ...prev]);
      broadcastAnnouncement(`👑 MODERATOR GIFT: +${amount.toLocaleString()} Diamonds sent to ${target ? target.name : playerId}!`);
    }
  };

  // Give Badges to everyone
  const sendBadgesToPlayer = (playerId: string | 'ALL', amount: number) => {
    soundManager.playBooyah();
    const time = new Date().toLocaleTimeString();

    if (playerId === 'ALL') {
      setPlayersList((prev) =>
        prev.map((p) => ({
          ...p,
          badges: p.badges + amount
        }))
      );
      setBadges((prev) => prev + amount);

      const log: ModeratorLog = {
        id: 'log_' + Date.now(),
        timestamp: time,
        action: 'BADGES_MASS_GRANT',
        recipient: 'ALL SERVER PLAYERS',
        detail: `Granted +${amount} 🎖️ Elite Pass Badges to all players! Everyone unlocked max Elite Pass!`
      };
      setModeratorLogs((prev) => [log, ...prev]);
      broadcastAnnouncement(`🎖️ MODERATOR POWER: Boss_Moderator_786 unlocked +${amount} Badges for ALL PLAYERS! Elite Pass Maxed Out!`);
    } else {
      setPlayersList((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, badges: p.badges + amount } : p))
      );
      const target = playersList.find((p) => p.id === playerId);
      const log: ModeratorLog = {
        id: 'log_' + Date.now(),
        timestamp: time,
        action: 'BADGES_DIRECT_GRANT',
        recipient: target ? target.name : playerId,
        detail: `Granted +${amount} 🎖️ Badges to ${target ? target.name : playerId}`
      };
      setModeratorLogs((prev) => [log, ...prev]);
    }
  };

  // Money / Cash diamond top-up injection ("paise se diamond du")
  const injectMoneyTopUp = (dollarAmount: number, diamondEquivalent: number) => {
    soundManager.playBooyah();
    const time = new Date().toLocaleTimeString();
    // Disburse diamonds to community
    setPlayersList((prev) =>
      prev.map((p) => ({
        ...p,
        diamonds: p.diamonds + diamondEquivalent
      }))
    );
    setDiamonds((prev) => prev + diamondEquivalent);

    const log: ModeratorLog = {
      id: 'log_' + Date.now(),
      timestamp: time,
      action: 'CASH_COMMUNITY_FUND',
      recipient: 'SERVER DIAMOND SHOWER',
      detail: `Funded $${dollarAmount} cash top-up! Generated +${diamondEquivalent.toLocaleString()} 💎 Diamonds distributed to all players.`
    };
    setModeratorLogs((prev) => [log, ...prev]);
    broadcastAnnouncement(`💸 CASH TOP-UP ACTIVATED: $${dollarAmount} Server Drop! +${diamondEquivalent.toLocaleString()} Diamonds distributed to all players!`);
  };

  // Unlock all Vault items & Evo skins
  const unlockEverythingAdmin = () => {
    soundManager.playBooyah();
    setDiamonds(999999);
    setGold(9999999);
    setBadges(5000);
    setLevel(100);
    setRank('Grandmaster');

    // Max all evo guns
    setVaultItems((prev) =>
      prev.map((item) => (item.maxEvoLevel ? { ...item, evoLevel: item.maxEvoLevel } : item))
    );

    const log: ModeratorLog = {
      id: 'log_' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      action: 'UNLOCK_ALL_GOD_MODE',
      recipient: 'All Accounts & Self',
      detail: 'Unlocked all Vault skins, Level 7 Evo weapons, infinite diamonds and badges!'
    };
    setModeratorLogs((prev) => [log, ...prev]);
    broadcastAnnouncement('⚡ MODERATOR OVERDRIVE: All Evo Guns upgraded to Level 7 Max & Infinite Vault Unlocked!');
  };

  const toggleGodMode = () => {
    soundManager.playClick();
    setGodModeEnabled((prev) => !prev);
  };

  const toggleRoyaleInstantGrandPrize = () => {
    soundManager.playClick();
    setSetRoyaleInstantGrandPrize((prev) => !prev);
  };

  const broadcastAnnouncement = (msg: string) => {
    soundManager.playClick();
    setServerAnnouncement(msg);
  };

  const clearAnnouncement = () => {
    setServerAnnouncement(null);
  };

  return (
    <GameContext.Provider
      value={{
        playerName,
        setPlayerName,
        level,
        rank,
        diamonds,
        gold,
        badges,
        soundMuted,
        toggleMute,
        characters,
        equippedCharacter,
        setEquippedCharacter,
        allSkills,
        equippedActiveSkill,
        setEquippedActiveSkill,
        equippedPassiveSkills,
        setEquippedPassiveSkills,
        equipSkillToSlot,
        vaultItems,
        equippedBundle,
        equippedWeapon,
        equippedGlooWall,
        equipVaultItem,
        upgradeEvoWeapon,
        luckRoyaleWheels,
        spinRoyale,
        luckMeter,
        currentDayStreak,
        claimedDays,
        october18Claimed,
        dailyRewardsList,
        claimDailyReward,
        claimOctober18SpecialReward,
        fastForwardStreakDays,
        events,
        claimEventTask,
        isModerator,
        godModeEnabled,
        toggleGodMode,
        playersList,
        moderatorLogs,
        serverAnnouncement,
        clearAnnouncement,
        broadcastAnnouncement,
        sendDiamondsToPlayer,
        sendBadgesToPlayer,
        injectMoneyTopUp,
        unlockEverythingAdmin,
        setRoyaleInstantGrandPrize,
        toggleRoyaleInstantGrandPrize,
        addDiamonds,
        spendDiamonds,
        addGold,
        spendGold,
        addBadges
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
