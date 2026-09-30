export type CharacterSkillType = 'ACTIVE' | 'PASSIVE';

export interface Skill {
  id: string;
  name: string;
  characterName: string;
  type: CharacterSkillType;
  description: string;
  cooldownSeconds: number;
  durationSeconds: number;
  icon: string;
  color: string;
}

export interface Character {
  id: string;
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  activeSkill: Skill;
  passiveSkill: Skill;
  biography: string;
  quote: string;
}

export interface VaultItem {
  id: string;
  name: string;
  category: 'bundle' | 'weapon' | 'gloo_wall' | 'emote' | 'backpack';
  rarity: 'rare' | 'epic' | 'mythic' | 'evo';
  image: string;
  description: string;
  stats?: {
    damage?: string;
    rateOfFire?: string;
    reloadSpeed?: string;
    magazine?: string;
    armorPenetration?: string;
  };
  evoLevel?: number;
  maxEvoLevel?: number;
}

export interface LuckRoyalePrize {
  id: string;
  name: string;
  rarity: 'rare' | 'epic' | 'mythic' | 'grand';
  image: string;
  type: 'diamonds' | 'voucher' | 'skin' | 'magic_cube' | 'token';
  amount?: number;
  probability: number; // weight
}

export interface LuckRoyaleWheel {
  id: string;
  title: string;
  bannerImage: string;
  costPerSpin: number;
  costPer10Spins: number;
  currency: 'diamonds' | 'gold' | 'voucher';
  prizes: LuckRoyalePrize[];
}

export interface DailyRewardDay {
  day: number;
  diamonds: number;
  gold: number;
  badges: number;
  specialItem?: string;
  isMilestone?: boolean;
}

export interface Player {
  id: string;
  name: string;
  level: number;
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Heroic' | 'Grandmaster';
  diamonds: number;
  gold: number;
  badges: number;
  avatar: string;
  isOnline: boolean;
  statusMessage?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  endDate: string;
  bannerColor: string;
  tasks: {
    id: string;
    description: string;
    reward: string;
    rewardType: 'diamonds' | 'badges' | 'skin';
    rewardAmount: number;
    completed: boolean;
  }[];
}

export interface Vehicle {
  id: string;
  name: string;
  x: number;
  y: number;
  angle: number;
  speed: number;
  maxSpeed: number;
  hp: number;
  maxHp: number;
  isOccupied: boolean;
  color: string;
  nitro: number;
}

export interface CustomRoomPlayer {
  slot: number;
  name: string;
  level: number;
  isReady: boolean;
  isHost: boolean;
  isModerator?: boolean;
  isBot: boolean;
  team: number; // 1 to 8 (for Squads) or individual for Solo
  isSpectator?: boolean;
}

export interface CustomRoomSettings {
  roomName: string;
  roomId: string;
  password?: string;
  maxPlayers: 32;
  mode: 'SOLO' | 'DUO' | 'SQUAD';
  ammo: 'LIMITED' | 'UNLIMITED';
  glooWalls: 'NORMAL' | 'UNLIMITED';
  safeZoneSpeed: 'NORMAL' | 'FAST' | 'EXTREME';
  vehicles: boolean;
  playerHp: 200 | 500;
  fallDamage: boolean;
}
