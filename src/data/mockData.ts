import { Character, Skill, VaultItem, LuckRoyaleWheel, GameEvent, Player, DailyRewardDay } from '../types/game';

export const INITIAL_SKILLS: Skill[] = [
  // Active Skills
  {
    id: 'skill_drop_the_beat',
    name: 'Drop the Beat',
    characterName: 'DJ Alok',
    type: 'ACTIVE',
    description: 'Creates a 5m aura that increases sprint speed by 15% and restores 5 HP/s for 10 seconds. Cooldown: 45s.',
    cooldownSeconds: 45,
    durationSeconds: 10,
    icon: '🎵',
    color: '#06b6d4'
  },
  {
    id: 'skill_time_turner',
    name: 'Time Turner',
    characterName: 'Chrono',
    type: 'ACTIVE',
    description: 'Creates a 360-degree force field that blocks 800 damage from incoming enemy fire. Cooldown: 60s.',
    cooldownSeconds: 60,
    durationSeconds: 8,
    icon: '🛡️',
    color: '#3b82f6'
  },
  {
    id: 'skill_camouflage',
    name: 'Camouflage',
    characterName: 'Wukong',
    type: 'ACTIVE',
    description: 'Transforms into a stealth bush for 15s. Attacking or taking damage cancels effect. CD resets upon taking down an enemy.',
    cooldownSeconds: 50,
    durationSeconds: 15,
    icon: '🌿',
    color: '#10b981'
  },
  {
    id: 'skill_healing_heartbeat',
    name: 'Healing Heartbeat',
    characterName: 'Dimitri',
    type: 'ACTIVE',
    description: 'Creates a 3.5m healing zone restoring 5 HP/s for 12s. Allows self and downed teammates to self-recover.',
    cooldownSeconds: 60,
    durationSeconds: 12,
    icon: '❤️',
    color: '#ec4899'
  },
  {
    id: 'skill_master_of_all',
    name: 'Master of All',
    characterName: 'K (Captain Booyah)',
    type: 'ACTIVE',
    description: 'Increases max EP by 50. Jiujitsu Mode: Boosts EP conversion rate by 500%. Psychology Mode: Recover 3 EP every 2s.',
    cooldownSeconds: 20,
    durationSeconds: 10,
    icon: '⚡',
    color: '#eab308'
  },

  // Passive Skills
  {
    id: 'skill_dash',
    name: 'Dash',
    characterName: 'Kelly',
    type: 'PASSIVE',
    description: 'Increases sprinting speed by 6% permanently.',
    cooldownSeconds: 0,
    durationSeconds: 0,
    icon: '⚡',
    color: '#f59e0b'
  },
  {
    id: 'skill_bushido',
    name: 'Bushido',
    characterName: 'Hayato',
    type: 'PASSIVE',
    description: 'With every 10% decrease in max HP, armor penetration increases by 10%.',
    cooldownSeconds: 0,
    durationSeconds: 0,
    icon: '⚔️',
    color: '#ef4444'
  },
  {
    id: 'skill_hackers_eye',
    name: "Hacker's Eye",
    characterName: 'Moco',
    type: 'PASSIVE',
    description: 'Tag enemies that you shoot for 5 seconds. Information is shared with your squad.',
    cooldownSeconds: 0,
    durationSeconds: 0,
    icon: '👁️',
    color: '#8b5cf6'
  },
  {
    id: 'skill_sustained_raids',
    name: 'Sustained Raids',
    characterName: 'Jota',
    type: 'PASSIVE',
    description: 'Hitting enemies recovers 10% HP; knocking down an enemy instantly recovers 20% HP.',
    cooldownSeconds: 0,
    durationSeconds: 0,
    icon: '🩸',
    color: '#f97316'
  },
  {
    id: 'skill_nutty_movement',
    name: 'Nutty Movement',
    characterName: 'D-Bee',
    type: 'PASSIVE',
    description: 'When firing while moving, movement speed increases by 15% and accuracy increases by 45%.',
    cooldownSeconds: 0,
    durationSeconds: 0,
    icon: '🎯',
    color: '#a855f7'
  }
];

export const INITIAL_CHARACTERS: Character[] = [
  {
    id: 'char_alok',
    name: 'DJ Alok',
    title: 'Beat Maestro',
    tagline: 'Valeu a festa! Feel the rhythm in battle.',
    avatar: '/src/assets/images/realistic_operator_alok_1790533631066.jpg',
    activeSkill: INITIAL_SKILLS[0],
    passiveSkill: INITIAL_SKILLS[5],
    biography: 'Using the power of electronic music and sound waves, Alok brings unstoppable energy and life recovery to the battlefield.',
    quote: '"Music is life, and together we survive."'
  },
  {
    id: 'char_chrono',
    name: 'Chrono',
    title: 'Time Enforcer',
    tagline: 'Dimensional guardian with temporal shields.',
    avatar: '/src/assets/images/realistic_red_criminal_1790533645434.jpg',
    activeSkill: INITIAL_SKILLS[1],
    passiveSkill: INITIAL_SKILLS[6],
    biography: 'A soldier from a futuristic parallel universe equipped with Chrono-warp shields capable of stopping all firepower.',
    quote: '"Time is the ultimate weapon."'
  },
  {
    id: 'char_kelly',
    name: 'Kelly "The Swift"',
    title: 'High School Sprinter',
    tagline: 'Lightning fast on track and on the battlefield.',
    avatar: '/src/assets/images/realistic_female_operator_1790533657217.jpg',
    activeSkill: INITIAL_SKILLS[0],
    passiveSkill: INITIAL_SKILLS[5],
    biography: 'Kelly is a high school sprinter known as Shimada Kiriko. Nothing can catch up to her when she dashes.',
    quote: '"Try to keep up if you can!"'
  },
  {
    id: 'char_hayato',
    name: 'Hayato "Firebrand"',
    title: 'Legendary Samurai',
    tagline: 'The lower my health, the sharper my blade.',
    avatar: '/src/assets/images/realistic_operator_alok_1790533631066.jpg',
    activeSkill: INITIAL_SKILLS[0],
    passiveSkill: INITIAL_SKILLS[6],
    biography: 'Born into the prestigious Shimada samurai family. He carries the honor of his clan into the battle royale arena.',
    quote: '"One slash, one victory."'
  },
  {
    id: 'char_wukong',
    name: 'Wukong',
    title: 'Monkey King',
    tagline: 'Master of camouflage and surprise strikes.',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    activeSkill: INITIAL_SKILLS[2],
    passiveSkill: INITIAL_SKILLS[7],
    biography: 'An AI synthetic warrior capable of altering physical forms to merge invisibly into the terrain.',
    quote: '"Now you see me, now you fall."'
  },
  {
    id: 'char_dimitri',
    name: 'Dimitri',
    title: 'Sound Tech Visionary',
    tagline: 'Self-reviving healing sound engineer.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    activeSkill: INITIAL_SKILLS[3],
    passiveSkill: INITIAL_SKILLS[8],
    biography: 'A world-class sound designer whose acoustic technology can kickstart adrenaline and heal teammates.',
    quote: '"Every heartbeat counts."'
  },
  {
    id: 'char_k',
    name: 'Captain Booyah (K)',
    title: 'Master of Martial Arts',
    tagline: 'Converts mental Energy Points into direct health.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    activeSkill: INITIAL_SKILLS[4],
    passiveSkill: INITIAL_SKILLS[9],
    biography: 'Professor of psychology and master of martial arts. He manipulates inner energy to sustain infinite combat vitality.',
    quote: '"Mind and body in absolute harmony."'
  }
];

export const INITIAL_VAULT_ITEMS: VaultItem[] = [
  // Bundles / Outfits
  {
    id: 'bundle_sakura',
    name: 'Sakura Blossom Bundle',
    category: 'bundle',
    rarity: 'mythic',
    image: '🌸',
    description: 'Iconic Season 1 Elite Pass bundle with cherry blossom masks and woven samurai kimono.'
  },
  {
    id: 'bundle_hip_hop',
    name: 'Hip Hop Street Bundle',
    category: 'bundle',
    rarity: 'mythic',
    image: '🎧',
    description: 'Legendary Season 2 Elite Pass streetwear bundle with oversized neon jacket and backwards cap.'
  },
  {
    id: 'bundle_red_criminal',
    name: 'Red Criminal Bundle',
    category: 'bundle',
    rarity: 'mythic',
    image: '🤡',
    description: 'Ultra-rare clown masked heist costume feared by all opponents on Bermuda.'
  },
  {
    id: 'bundle_arctic_blue',
    name: 'Arctic Blue Master',
    category: 'bundle',
    rarity: 'epic',
    image: '❄️',
    description: 'Sub-zero cybernetic warrior armor with frosted crystal particle trails.'
  },
  {
    id: 'bundle_cobra_rage',
    name: 'Cobra Rage Legendary',
    category: 'bundle',
    rarity: 'evo',
    image: '🐍',
    description: 'Dynamic reactive bundle that changes color based on kill count (Red, Yellow, Blue, Purple).'
  },
  {
    id: 'bundle_oct18_phoenix',
    name: 'October 18th Mythic Phoenix',
    category: 'bundle',
    rarity: 'mythic',
    image: '🔥',
    description: 'Exclusive 18th October Anniversary drop with flaming fiery wings and golden crown.'
  },

  // Weapons (Evo Guns & Legendaries)
  {
    id: 'weapon_ak47_draco',
    name: 'AK-47 Blue Flame Draco',
    category: 'weapon',
    rarity: 'evo',
    image: '🐉',
    description: 'The King of Evo Guns. Blue dragon breathing cold fire with custom firing flash and kill effect.',
    stats: {
      damage: '++ High',
      rateOfFire: '+ Boosted',
      reloadSpeed: '-5%',
      armorPenetration: '+25%'
    },
    evoLevel: 7,
    maxEvoLevel: 7
  },
  {
    id: 'weapon_mp40_cobra',
    name: 'MP40 Predatory Cobra',
    category: 'weapon',
    rarity: 'evo',
    image: '🐍',
    description: 'Evo SMG with venomous snake bite animations and maximum close-quarters shredding speed.',
    stats: {
      damage: '++ Extreme',
      rateOfFire: '+++ Max',
      reloadSpeed: '+10%',
      magazine: '+4'
    },
    evoLevel: 7,
    maxEvoLevel: 7
  },
  {
    id: 'weapon_m1887_golden_dragon',
    name: 'Golden Dragon M1887',
    category: 'weapon',
    rarity: 'mythic',
    image: '✨',
    description: 'Special October 18th twin-barrel shotgun wrapped in pure 24K dragon gold.',
    stats: {
      damage: '+++ Fatal (1 Shot Kill)',
      rateOfFire: '+ Normal',
      reloadSpeed: '+30%'
    }
  },
  {
    id: 'weapon_awm_swallowtail',
    name: 'AWM Duke Swallowtail',
    category: 'weapon',
    rarity: 'epic',
    image: '🎯',
    description: 'High-precision sniper rifle with butterfly particle glow and one-shot headshot multiplier.',
    stats: {
      damage: '+++ 300 Headshot',
      rateOfFire: '+ Standard',
      armorPenetration: '+50%'
    }
  },

  // Gloo Walls
  {
    id: 'gloo_spikey_spine',
    name: 'Spikey Spine Gloo Wall',
    category: 'gloo_wall',
    rarity: 'mythic',
    image: '🛡️',
    description: 'Dark obsidian barricade with glowing red titanium spikes.'
  },
  {
    id: 'gloo_clown_rampage',
    name: 'Clown Rampage Gloo Wall',
    category: 'gloo_wall',
    rarity: 'epic',
    image: '🎪',
    description: 'Iconic grinning red clown shield that strikes terror in enemies.'
  },
  {
    id: 'gloo_bunker_steel',
    name: 'Military Bunker Wall',
    category: 'gloo_wall',
    rarity: 'rare',
    image: '🧱',
    description: 'Reinforced ballistic composite barricade.'
  },

  // Emotes
  {
    id: 'emote_tea_time',
    name: 'Tea Time Emote',
    category: 'emote',
    rarity: 'mythic',
    image: '☕',
    description: 'Spawns a golden table and pulls out royal cup of tea while enemies watch.'
  },
  {
    id: 'emote_flowers_of_love',
    name: 'Flowers of Love',
    category: 'emote',
    rarity: 'mythic',
    image: '🌹',
    description: 'Offers a glowing red rose to squad mates or defeated foes.'
  },
  {
    id: 'emote_booyah_trophy',
    name: 'Booyah Champion Trophy',
    category: 'emote',
    rarity: 'mythic',
    image: '🏆',
    description: 'Lifts the solid gold Free Fire World Series trophy with fireworks.'
  }
];

export const INITIAL_LUCK_ROYALES: LuckRoyaleWheel[] = [
  {
    id: 'faded_wheel',
    title: 'Faded Wheel - AK Draco',
    bannerImage: '🐉',
    costPerSpin: 40,
    costPer10Spins: 360,
    currency: 'diamonds',
    prizes: [
      { id: 'p1', name: 'AK-47 Blue Flame Draco Lv.7', rarity: 'grand', image: '🐉', type: 'skin', probability: 5 },
      { id: 'p2', name: '1000 Diamonds Crate', rarity: 'mythic', image: '💎', type: 'diamonds', amount: 1000, probability: 10 },
      { id: 'p3', name: 'Magic Cube', rarity: 'mythic', image: '🧊', type: 'magic_cube', probability: 15 },
      { id: 'p4', name: 'Evolution Stones x5', rarity: 'epic', image: '💎', type: 'token', probability: 25 },
      { id: 'p5', name: 'Diamond Royale Voucher x5', rarity: 'rare', image: '🎟️', type: 'voucher', probability: 35 },
      { id: 'p6', name: '5000 Gold Coins', rarity: 'rare', image: '🪙', type: 'diamonds', amount: 500, probability: 40 },
      { id: 'p7', name: 'Elite Pass Badges x50', rarity: 'epic', image: '🎖️', type: 'token', probability: 30 },
      { id: 'p8', name: 'Dragon Flame Token Box', rarity: 'rare', image: '📦', type: 'token', probability: 45 }
    ]
  },
  {
    id: 'diamond_royale',
    title: 'Diamond Royale - Red Criminal',
    bannerImage: '🤡',
    costPerSpin: 60,
    costPer10Spins: 540,
    currency: 'diamonds',
    prizes: [
      { id: 'dp1', name: 'Red Criminal Mask Bundle', rarity: 'grand', image: '🤡', type: 'skin', probability: 6 },
      { id: 'dp2', name: '500 Diamonds', rarity: 'mythic', image: '💎', type: 'diamonds', amount: 500, probability: 12 },
      { id: 'dp3', name: 'Magic Cube Fragment x10', rarity: 'epic', image: '🧩', type: 'token', probability: 25 },
      { id: 'dp4', name: 'Badges x20', rarity: 'rare', image: '🎖️', type: 'token', probability: 35 },
      { id: 'dp5', name: 'Gold 2500', rarity: 'rare', image: '🪙', type: 'diamonds', amount: 250, probability: 50 }
    ]
  },
  {
    id: 'weapon_royale',
    title: 'Weapon Royale - Golden M1887',
    bannerImage: '✨',
    costPerSpin: 50,
    costPer10Spins: 450,
    currency: 'diamonds',
    prizes: [
      { id: 'wp1', name: 'Golden Dragon M1887', rarity: 'grand', image: '✨', type: 'skin', probability: 7 },
      { id: 'wp2', name: 'Weapon Crate x10', rarity: 'epic', image: '🧰', type: 'token', probability: 20 },
      { id: 'wp3', name: 'Badges x30', rarity: 'epic', image: '🎖️', type: 'token', probability: 30 },
      { id: 'wp4', name: 'Gold 3000', rarity: 'rare', image: '🪙', type: 'diamonds', amount: 300, probability: 45 }
    ]
  }
];

export const INITIAL_EVENTS: GameEvent[] = [
  {
    id: 'event_oct18_mega',
    title: 'October 18th Mega Carnage Festival',
    subtitle: 'Special 1-Year celebration! 50,000 Free Diamonds & Phoenix Bundle for everyone!',
    badge: 'ANNIVERSARY SPECIAL',
    endDate: 'OCTOBER 18 23:59:59',
    bannerColor: 'from-amber-600 via-yellow-500 to-red-600',
    tasks: [
      { id: 't1', description: 'Log in on October 18th (or claim in Daily Calendar)', reward: '50,000 Diamonds', rewardType: 'diamonds', rewardAmount: 50000, completed: false },
      { id: 't2', description: 'Play 1 Battle Royale match and get Booyah', reward: 'Mythic Phoenix Bundle', rewardType: 'skin', rewardAmount: 1, completed: false },
      { id: 't3', description: 'Eliminate 5 enemies with AK-47 Draco or Shotgun', reward: '100 Elite Badges', rewardType: 'badges', rewardAmount: 100, completed: false },
      { id: 't4', description: 'Moderator diamond rain received from admin', reward: '5000 Diamonds', rewardType: 'diamonds', rewardAmount: 5000, completed: false }
    ]
  },
  {
    id: 'event_booyah_pass',
    title: 'Booyah Pass Season Max',
    subtitle: 'Reach Level 100 to unlock Evo Cobra Gun & Sakura Kimono.',
    badge: 'SEASON 64',
    endDate: 'ENDS IN 12 DAYS',
    bannerColor: 'from-purple-900 via-indigo-700 to-cyan-600',
    tasks: [
      { id: 'bp1', description: 'Survive for 180 seconds inside the Safe Zone', reward: '50 Badges', rewardType: 'badges', rewardAmount: 50, completed: false },
      { id: 'bp2', description: 'Deploy 3 Gloo Walls in one match', reward: '30 Badges', rewardType: 'badges', rewardAmount: 30, completed: false },
      { id: 'bp3', description: 'Use DJ Alok Drop The Beat skill 2 times', reward: '500 Diamonds', rewardType: 'diamonds', rewardAmount: 500, completed: false }
    ]
  },
  {
    id: 'event_topup_bonus',
    title: '1 Diamond Mega Top-Up',
    subtitle: 'Top up 1 diamond to get Free Spikey Spine Gloo Wall & 2000 Bonus Diamonds!',
    badge: 'HOT DEAL',
    endDate: 'PERMANENT',
    bannerColor: 'from-emerald-700 via-teal-600 to-cyan-500',
    tasks: [
      { id: 'tu1', description: 'Claim 1 Diamond Top-Up Perk', reward: 'Spikey Spine Gloo Wall + 2,000 Diamonds', rewardType: 'diamonds', rewardAmount: 2000, completed: false }
    ]
  }
];

export const INITIAL_PLAYERS: Player[] = [
  { id: 'player_user', name: 'Boss_Moderator_786', level: 75, rank: 'Grandmaster', diamonds: 99999, gold: 500000, badges: 480, avatar: '👑', isOnline: true, statusMessage: 'Main Moderator Hu! Sabko diamonds & badges dunga!' },
  { id: 'player_1', name: 'Ajjubhai_94', level: 82, rank: 'Heroic', diamonds: 4200, gold: 120000, badges: 220, avatar: '🦁', isOnline: true, statusMessage: 'One tap headshot king!' },
  { id: 'player_2', name: 'Raistar_FF', level: 78, rank: 'Heroic', diamonds: 1500, gold: 80000, badges: 190, avatar: '⚡', isOnline: true, statusMessage: 'Fastest movement speed on Bermuda' },
  { id: 'player_3', name: 'Total_Gaming_Fan', level: 54, rank: 'Diamond', diamonds: 350, gold: 45000, badges: 85, avatar: '🎮', isOnline: true, statusMessage: 'Need moderator diamond drop please!' },
  { id: 'player_4', name: 'Badge_King_PK', level: 66, rank: 'Platinum', diamonds: 120, gold: 30000, badges: 110, avatar: '🎖️', isOnline: true, statusMessage: 'Moderator bhai sabko badges dedo!' },
  { id: 'player_5', name: 'Desi_Gamers_Amit', level: 70, rank: 'Heroic', diamonds: 2800, gold: 95000, badges: 240, avatar: '🔥', isOnline: false, statusMessage: 'Grandmaster push tonight' },
  { id: 'player_6', name: 'Gyan_Sujan_FF', level: 74, rank: 'Heroic', diamonds: 3100, gold: 110000, badges: 215, avatar: '🎯', isOnline: true, statusMessage: 'Live streaming CS ranked' },
  { id: 'player_7', name: 'Noob_To_Pro', level: 23, rank: 'Silver', diamonds: 50, gold: 12000, badges: 15, avatar: '🐣', isOnline: true, statusMessage: 'Help me get Alok and diamonds!' }
];

// Generate 365 Days Daily Rewards with milestones & October 18 highlight
export const generate365DailyRewards = (): DailyRewardDay[] => {
  const days: DailyRewardDay[] = [];
  for (let i = 1; i <= 365; i++) {
    let dia = 50 + (i % 7) * 20;
    let gold = 500 + (i % 10) * 100;
    let badges = 5 + (i % 5) * 5;
    let specialItem: string | undefined = undefined;
    let isMilestone = false;

    if (i === 7) {
      dia = 500;
      badges = 30;
      specialItem = 'Diamond Royale Voucher x5';
      isMilestone = true;
    } else if (i === 30) {
      dia = 2500;
      badges = 100;
      specialItem = 'Magic Cube Fragment x10';
      isMilestone = true;
    } else if (i === 100) {
      dia = 10000;
      badges = 250;
      specialItem = 'Arctic Blue Master Bundle';
      isMilestone = true;
    } else if (i === 291) {
      // Day 291 corresponds roughly to October 18th in a 365 day year!
      dia = 50000;
      badges = 500;
      specialItem = '🔥 October 18th Mega Jackpot: Mythic Phoenix + Golden Dragon M1887!';
      isMilestone = true;
    } else if (i === 365) {
      // 1 Full Year Completion!
      dia = 100000;
      badges = 1000;
      specialItem = '👑 1-Year Master Crown + 100,000 Diamonds + All Vault Unlocked!';
      isMilestone = true;
    }

    days.push({
      day: i,
      diamonds: dia,
      gold: gold,
      badges: badges,
      specialItem,
      isMilestone
    });
  }
  return days;
};
