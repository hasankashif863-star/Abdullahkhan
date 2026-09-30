import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/sound';
import { battleAudioEngine, WeaponSoundType, ImpactType } from '../utils/battleAudioEngine';
import {
  Shield,
  Zap,
  Plus,
  Crosshair,
  ArrowLeft,
  RotateCcw,
  Car,
  Eye,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Flame,
  Radio,
  Sliders,
  Sparkles
} from 'lucide-react';
import { CustomRoomSettings } from '../types/game';

interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  isPlayer: boolean;
  damage: number;
  life: number;
  shooterName: string;
}

interface Enemy {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  lastShot: number;
  isAlive: boolean;
  weapon: string;
  kills: number;
}

interface GlooWallInstance {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  radius: number;
}

interface LootBox {
  id: string;
  x: number;
  y: number;
  type: 'medkit' | 'ammo' | 'armor' | 'airdrop';
  name: string;
}

interface VehicleEntity {
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
  nitro: number;
  color: string;
}

interface BattleRoyaleGameProps {
  onBackToLobby: () => void;
  customRoomConfig?: {
    isCustomRoom: boolean;
    settings: CustomRoomSettings;
    asSpectator?: boolean;
  };
}

const BOT_NAMES = [
  'Ajjubhai_94', 'Raistar_FF', 'Total_Gaming', 'TSG_Jash', 'SK_Sabir_Boss',
  'Daddy_Calling', 'Sudip_Sarkar', 'Vincenzo_99', 'B2K_Born2Kill', 'White444_God',
  'Ruok_FF_Aim', 'Nonstop_Gaming', 'Pahadi_Gaming', 'Badge_King_99', 'Cobra_Demon',
  'Headshot_Machine', 'SniperQueen', 'Shadow_Ninja', 'Bermuda_Ruler', 'Alpha_Predator',
  'Phoenix_Reborn', 'Gloo_Wall_Pro', 'Draco_Slayer', 'Storm_Breaker', 'Ghost_Rider_FF',
  'Titan_Striker', 'Toxic_Avenger', 'Legend_FF', 'Cyber_Hunter', 'Vortex_King', 'Final_Survivor'
];

export const BattleRoyaleGame: React.FC<BattleRoyaleGameProps> = ({
  onBackToLobby,
  customRoomConfig
}) => {
  const {
    playerName,
    equippedCharacter,
    equippedActiveSkill,
    equippedWeapon,
    equippedGlooWall,
    addDiamonds,
    addGold,
    addBadges,
    soundMuted,
    toggleMute
  } = useGame();

  // Initialize and synchronize 3D Web Audio spatial sound engine
  useEffect(() => {
    battleAudioEngine.init();
    battleAudioEngine.setMuted(soundMuted);
  }, [soundMuted]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Settings from custom room if present
  const isUnlimitedAmmo = customRoomConfig?.settings?.ammo === 'UNLIMITED';
  const isUnlimitedGloo = customRoomConfig?.settings?.glooWalls === 'UNLIMITED';
  const maxInitialHp = customRoomConfig?.settings?.playerHp || 200;

  // Player state
  const [hp, setHp] = useState<number>(maxInitialHp);
  const [ep, setEp] = useState<number>(100);
  const [glooCount, setGlooCount] = useState<number>(isUnlimitedGloo ? 99 : 5);
  const [medkits, setMedkits] = useState<number>(3);
  const [kills, setKills] = useState<number>(0);
  const [aliveCount, setAliveCount] = useState<number>(32);
  const [isSkillActive, setIsSkillActive] = useState<boolean>(false);
  const [skillCooldown, setSkillCooldown] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);

  // Vehicle states
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [vehicleSpeedKmh, setVehicleSpeedKmh] = useState<number>(0);
  const [vehicleHp, setVehicleHp] = useState<number>(400);
  const [vehicleNitro, setVehicleNitro] = useState<number>(100);
  const [nearVehicle, setNearVehicle] = useState<boolean>(false);

  // Spectator State
  const [isSpectating, setIsSpectating] = useState<boolean>(Boolean(customRoomConfig?.asSpectator));
  const [spectatedBotIndex, setSpectatedBotIndex] = useState<number>(0);

  // Killfeed list
  const [killFeed, setKillFeed] = useState<string[]>([
    '🔥 32 Survivors Dropped from C-130 Dropship over Bermuda!',
    customRoomConfig?.isCustomRoom
      ? `Room [${customRoomConfig.settings.roomId}]: ${customRoomConfig.settings.roomName} Started!`
      : 'Bermuda Arena: Collect weapons, vehicles and survive to Booyah!'
  ]);

  // Mutable Game Loop State
  const gameStateRef = useRef({
    player: {
      x: 400,
      y: 400,
      vx: 0,
      vy: 0,
      speed: 3.5,
      angle: 0,
      radius: 16
    },
    vehicle: {
      id: 'veh_sports_1',
      name: 'Cyber Sports Car',
      x: 480,
      y: 360,
      angle: 0,
      speed: 0,
      maxSpeed: 7.2,
      hp: 400,
      maxHp: 400,
      isOccupied: false,
      nitro: 100,
      color: '#00f2fe'
    } as VehicleEntity,
    bullets: [] as Bullet[],
    enemies: BOT_NAMES.map((name, i) => {
      // Spread across 900x700 map with safe margin from player
      const angle = (i / BOT_NAMES.length) * Math.PI * 2;
      const distance = 160 + Math.random() * 260;
      return {
        id: `e_${i}`,
        name,
        x: Math.max(50, Math.min(850, 450 + Math.cos(angle) * distance)),
        y: Math.max(50, Math.min(650, 350 + Math.sin(angle) * distance)),
        hp: 120,
        maxHp: 120,
        speed: 1.4 + Math.random() * 0.8,
        lastShot: 0,
        isAlive: true,
        weapon: i % 3 === 0 ? 'AK47 Draco' : i % 3 === 1 ? 'MP40 Cobra' : 'AWM Sniper',
        kills: 0
      };
    }) as Enemy[],
    glooWalls: [] as GlooWallInstance[],
    loots: [
      { id: 'l1', x: 300, y: 340, type: 'medkit', name: 'Medkit (+75 HP)' },
      { id: 'l2', x: 550, y: 440, type: 'ammo', name: 'AK Draco Ammo' },
      { id: 'l3', x: 620, y: 280, type: 'armor', name: 'Lv 3 Vest' },
      { id: 'l4', x: 380, y: 520, type: 'airdrop', name: '🔥 Airdrop Crate' },
      { id: 'l5', x: 220, y: 480, type: 'medkit', name: 'Super Medkit' }
    ] as LootBox[],
    safeZone: {
      x: 450,
      y: 350,
      radius: 420,
      targetRadius: 160,
      shrinkSpeed: customRoomConfig?.settings?.safeZoneSpeed === 'FAST' ? 0.22 : 0.12
    },
    keys: {} as Record<string, boolean>,
    mouse: { x: 450, y: 350, isDown: false },
    lastShotTime: 0,
    skillTimer: 0,
    skillDuration: 0,
    alokHealTick: 0,
    isDrivingState: false,
    lastBotBattleTime: Date.now()
  });

  // Global Key & Mouse listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key.toLowerCase()] = true;

      // Deploy Gloo Wall with 'F' (if not driving)
      if (e.key.toLowerCase() === 'f' && !gameStateRef.current.isDrivingState) {
        deployGlooWall();
      }

      // Enter/Exit Vehicle with 'G' or 'F' (when near vehicle)
      if (e.key.toLowerCase() === 'g' || (e.key.toLowerCase() === 'f' && nearVehicle)) {
        toggleVehicle();
      }

      // Honk Car Horn with 'H'
      if (e.key.toLowerCase() === 'h' && gameStateRef.current.isDrivingState) {
        soundManager.playCarHorn();
      }

      // Active Skill with 'E'
      if (e.key.toLowerCase() === 'e' && !gameStateRef.current.isDrivingState) {
        activateSkill();
      }

      // Medkit with 'Q'
      if (e.key.toLowerCase() === 'q') {
        useMedkit();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key.toLowerCase()] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;
      gameStateRef.current.mouse.x = (e.clientX - rect.left) * scaleX;
      gameStateRef.current.mouse.y = (e.clientY - rect.top) * scaleY;
    };

    const handleMouseDown = () => {
      gameStateRef.current.mouse.isDown = true;
    };

    const handleMouseUp = () => {
      gameStateRef.current.mouse.isDown = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [glooCount, medkits, skillCooldown, nearVehicle, isDriving]);

  // Main Canvas 60 FPS Render Loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localHp = hp;
    let localKills = kills;

    const gameLoop = () => {
      const state = gameStateRef.current;
      const { player, vehicle, keys, mouse, enemies, bullets, glooWalls, loots, safeZone } = state;

      if (gameOver && !isSpectating) {
        return;
      }

      // -------------------------------------------------------------
      // 1. VEHICLE CONTROLS & MOVEMENT
      // -------------------------------------------------------------
      const distToVeh = Math.hypot(player.x - vehicle.x, player.y - vehicle.y);
      setNearVehicle(!state.isDrivingState && distToVeh < 65);

      if (state.isDrivingState) {
        // Steer angle
        if (keys['a'] || keys['arrowleft']) {
          vehicle.angle -= 0.055;
        }
        if (keys['d'] || keys['arrowright']) {
          vehicle.angle += 0.055;
        }

        // Accelerate & Reverse
        const isNitro = keys['shift'] && vehicle.nitro > 0;
        const targetMaxSpeed = isNitro ? vehicle.maxSpeed * 1.5 : vehicle.maxSpeed;

        if (keys['w'] || keys['arrowup']) {
          vehicle.speed = Math.min(targetMaxSpeed, vehicle.speed + 0.18);
          if (isNitro) {
            vehicle.nitro = Math.max(0, vehicle.nitro - 0.4);
            setVehicleNitro(Math.round(vehicle.nitro));
          }
        } else if (keys['s'] || keys['arrowdown']) {
          vehicle.speed = Math.max(-3.5, vehicle.speed - 0.12);
        } else {
          // Friction deceleration
          vehicle.speed *= 0.94;
          if (Math.abs(vehicle.speed) < 0.05) vehicle.speed = 0;
        }

        // Move vehicle
        vehicle.x += Math.cos(vehicle.angle) * vehicle.speed;
        vehicle.y += Math.sin(vehicle.angle) * vehicle.speed;

        // Boundaries
        vehicle.x = Math.max(40, Math.min(canvas.width - 40, vehicle.x));
        vehicle.y = Math.max(40, Math.min(canvas.height - 40, vehicle.y));

        // Player follows vehicle exactly
        player.x = vehicle.x;
        player.y = vehicle.y;
        player.angle = vehicle.angle;

        const currentSpeedKmh = Math.round(Math.abs(vehicle.speed) * 22);
        setVehicleSpeedKmh(currentSpeedKmh);

        // ROADKILL CHECK: Run over enemy bots!
        if (Math.abs(vehicle.speed) > 2.5) {
          enemies.forEach((enemy) => {
            if (enemy.isAlive) {
              const d = Math.hypot(vehicle.x - enemy.x, vehicle.y - enemy.y);
              if (d < 36) {
                // Crunchy Roadkill
                soundManager.playRoadkill();
                enemy.hp = 0;
                enemy.isAlive = false;
                localKills += 1;
                setKills(localKills);

                // Add to kill feed
                const killMsg = `🚗💥 ${playerName} ROADKILLED ${enemy.name} with Sports Car!`;
                setKillFeed((prev) => [killMsg, ...prev.slice(0, 4)]);
              }
            }
          });
        }
      } else {
        // Player on foot movement
        let dx = 0;
        let dy = 0;
        if (keys['w'] || keys['arrowup']) dy -= 1;
        if (keys['s'] || keys['arrowdown']) dy += 1;
        if (keys['a'] || keys['arrowleft']) dx -= 1;
        if (keys['d'] || keys['arrowright']) dx += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        const isMoving = dx !== 0 || dy !== 0;
        const isRunning = Boolean(keys['shift'] || isSkillActive);
        const currentSpeed = isSkillActive ? player.speed * 1.35 : (keys['shift'] ? player.speed * 1.25 : player.speed);
        player.x = Math.max(30, Math.min(canvas.width - 30, player.x + dx * currentSpeed));
        player.y = Math.max(30, Math.min(canvas.height - 30, player.y + dy * currentSpeed));

        // Spatial footstep engine for player movement
        if (!isSpectating) {
          battleAudioEngine.updatePlayerFootsteps(isMoving, isRunning, player.x, player.y);
        }

        // Aim angle towards mouse
        player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
        setVehicleSpeedKmh(0);
      }

      // -------------------------------------------------------------
      // 2. SAFE ZONE SHRINKING & STORM DAMAGE
      // -------------------------------------------------------------
      if (safeZone.radius > safeZone.targetRadius) {
        safeZone.radius -= safeZone.shrinkSpeed;
      }

      const distFromSafeCenter = Math.hypot(player.x - safeZone.x, player.y - safeZone.y);
      if (distFromSafeCenter > safeZone.radius && !isSpectating) {
        localHp = Math.max(0, localHp - 0.25);
        setHp(Math.round(localHp));
        // Spatial electrical storm shock audio
        if (Math.random() < 0.08) {
          battleAudioEngine.playStormShock();
        }
        if (localHp <= 0) {
          triggerGameOver(false);
          return;
        }
      }

      // Alok Healing Aura
      if (isSkillActive) {
        state.alokHealTick += 1;
        if (state.alokHealTick % 30 === 0) {
          localHp = Math.min(maxInitialHp, localHp + 3);
          setHp(Math.round(localHp));
        }
      }

      // -------------------------------------------------------------
      // 3. PLAYER SHOOTING (When on foot)
      // -------------------------------------------------------------
      const now = Date.now();
      if (!state.isDrivingState && !isSpectating && mouse.isDown && now - state.lastShotTime > 140) {
        state.lastShotTime = now;

        // Dynamic weapon audio synthesis based on equipped weapon
        const eqWpnName = (equippedWeapon?.name || '').toLowerCase();
        const playerWpnType: WeaponSoundType = eqWpnName.includes('mp40') || eqWpnName.includes('smg')
          ? 'mp40'
          : eqWpnName.includes('awm') || eqWpnName.includes('sniper')
          ? 'awm'
          : eqWpnName.includes('shotgun') || eqWpnName.includes('m1887')
          ? 'shotgun'
          : 'ak47';

        battleAudioEngine.playLocalizedGunfire(player.x, player.y, player.x, player.y, playerWpnType, true);

        const bulletSpeed = 12;
        const spread = (Math.random() - 0.5) * 0.08;
        bullets.push({
          x: player.x + Math.cos(player.angle) * 22,
          y: player.y + Math.sin(player.angle) * 22,
          vx: Math.cos(player.angle + spread) * bulletSpeed,
          vy: Math.sin(player.angle + spread) * bulletSpeed,
          isPlayer: true,
          damage: 38 + Math.floor(Math.random() * 20),
          life: 55,
          shooterName: playerName
        });
      }

      // -------------------------------------------------------------
      // 4. BACKGROUND 32-PLAYER COMBAT SIMULATION (Bots eliminating bots)
      // -------------------------------------------------------------
      if (now - state.lastBotBattleTime > 3800) {
        state.lastBotBattleTime = now;
        const aliveEnemies = enemies.filter((e) => e.isAlive);
        if (aliveEnemies.length > 2) {
          const killer = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
          const victim = aliveEnemies.find((e) => e.id !== killer.id);
          if (victim) {
            victim.isAlive = false;
            victim.hp = 0;
            killer.kills += 1;
            const weaponsList = ['AK47 Draco 🐉', 'MP40 Cobra 🐍', 'M1887 Golden 💥', 'AWM Sniper 🎯'];
            const wpn = weaponsList[Math.floor(Math.random() * weaponsList.length)];
            const isHeadshot = Math.random() > 0.6;
            const feedText = isHeadshot
              ? `🎯 ${killer.name} HEADSHOT ${victim.name} with ${wpn}`
              : `💀 ${killer.name} eliminated ${victim.name} with ${wpn}`;
            setKillFeed((prev) => [feedText, ...prev.slice(0, 4)]);

            // Distant localized gunfire audio based on spatial position
            const distantWpnType: WeaponSoundType = wpn.includes('AWM')
              ? 'awm'
              : wpn.includes('MP40')
              ? 'mp40'
              : wpn.includes('M1887')
              ? 'shotgun'
              : 'ak47';
            battleAudioEngine.playLocalizedGunfire(killer.x, killer.y, player.x, player.y, distantWpnType, false);
          }
        }
      }

      // -------------------------------------------------------------
      // 5. ENEMY BOT AI & COMBAT WITH PLAYER
      // -------------------------------------------------------------
      enemies.forEach((enemy) => {
        if (!enemy.isAlive) return;

        // Move towards safe zone or towards player
        const distToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        const distToZone = Math.hypot(safeZone.x - enemy.x, safeZone.y - enemy.y);

        let targetX = safeZone.x;
        let targetY = safeZone.y;

        if (distToPlayer < 240) {
          targetX = player.x;
          targetY = player.y;
        }

        const angleToTarget = Math.atan2(targetY - enemy.y, targetX - enemy.x);
        enemy.x += Math.cos(angleToTarget) * enemy.speed;
        enemy.y += Math.sin(angleToTarget) * enemy.speed;

        // Keep inside bounds
        enemy.x = Math.max(30, Math.min(canvas.width - 30, enemy.x));
        enemy.y = Math.max(30, Math.min(canvas.height - 30, enemy.y));

        // Spatial footstep detection: player can hear nearby moving bots approaching in stereo!
        if (!isSpectating) {
          battleAudioEngine.updateEnemyFootstep(enemy.id, enemy.x, enemy.y, player.x, player.y, true);
        }

        // Shoot at player if in range and line of sight
        if (distToPlayer < 220 && now - enemy.lastShot > 1400) {
          enemy.lastShot = now;
          const bulletAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);

          // Localized enemy gunfire sound with stereo panning and distance attenuation
          const enemyWpnType: WeaponSoundType = enemy.weapon.includes('MP40')
            ? 'mp40'
            : enemy.weapon.includes('AWM')
            ? 'awm'
            : 'ak47';
          battleAudioEngine.playLocalizedGunfire(enemy.x, enemy.y, player.x, player.y, enemyWpnType, false);

          bullets.push({
            x: enemy.x + Math.cos(bulletAngle) * 16,
            y: enemy.y + Math.sin(bulletAngle) * 16,
            vx: Math.cos(bulletAngle) * 7.5,
            vy: Math.sin(bulletAngle) * 7.5,
            isPlayer: false,
            damage: 18 + Math.floor(Math.random() * 12),
            life: 60,
            shooterName: enemy.name
          });
        }
      });

      // -------------------------------------------------------------
      // 6. BULLET UPDATES & COLLISIONS (Gloo walls, Enemies, Player)
      // -------------------------------------------------------------
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        b.life -= 1;

        if (b.life <= 0) {
          bullets.splice(i, 1);
          continue;
        }

        // Gloo Wall Shield Block
        let blocked = false;
        for (let j = glooWalls.length - 1; j >= 0; j--) {
          const gw = glooWalls[j];
          const distGw = Math.hypot(b.x - gw.x, b.y - gw.y);
          if (distGw < gw.radius) {
            gw.hp -= b.damage;
            blocked = true;
            battleAudioEngine.playLocalizedImpact(b.x, b.y, player.x, player.y, 'shield');
            if (gw.hp <= 0) glooWalls.splice(j, 1);
            break;
          }
        }
        if (blocked) {
          bullets.splice(i, 1);
          continue;
        }

        // Hit Enemies
        if (b.isPlayer) {
          let hitEnemy = false;
          for (let k = 0; k < enemies.length; k++) {
            const enemy = enemies[k];
            if (!enemy.isAlive) continue;
            const distEnemy = Math.hypot(b.x - enemy.x, b.y - enemy.y);
            if (distEnemy < 18) {
              enemy.hp -= b.damage;
              hitEnemy = true;
              const isHead = b.damage > 45;

              // Localized impact sound with headshot ding!
              battleAudioEngine.playLocalizedImpact(enemy.x, enemy.y, player.x, player.y, isHead ? 'headshot' : 'flesh');

              if (enemy.hp <= 0) {
                enemy.isAlive = false;
                localKills += 1;
                setKills(localKills);

                // Elimination fanfare stinger
                battleAudioEngine.playEliminationStinger(isHead);

                // Add to kill feed
                const killMsg = isHead
                  ? `🎯 HEADSHOT! ${playerName} eliminated ${enemy.name} [${equippedWeapon.name}]`
                  : `💀 ${playerName} eliminated ${enemy.name}`;
                setKillFeed((prev) => [killMsg, ...prev.slice(0, 4)]);
              }
              break;
            }
          }
          if (hitEnemy) {
            bullets.splice(i, 1);
            continue;
          }
        } else {
          // Hit Player
          if (!isSpectating) {
            const distPlayer = Math.hypot(b.x - player.x, b.y - player.y);
            if (distPlayer < 18) {
              if (state.isDrivingState) {
                // Vehicle absorbs damage
                vehicle.hp -= b.damage;
                setVehicleHp(Math.max(0, vehicle.hp));
                battleAudioEngine.playLocalizedImpact(player.x, player.y, player.x, player.y, 'shield');
              } else {
                localHp = Math.max(0, localHp - b.damage);
                setHp(Math.round(localHp));
                battleAudioEngine.playPlayerDamage();
                if (localHp <= 0) {
                  triggerGameOver(false);
                  return;
                }
              }
              bullets.splice(i, 1);
              continue;
            }
          }
        }
      }

      // -------------------------------------------------------------
      // 7. LOOT PICKUP CHECK
      // -------------------------------------------------------------
      if (!isSpectating) {
        for (let i = loots.length - 1; i >= 0; i--) {
          const loot = loots[i];
          const distLoot = Math.hypot(player.x - loot.x, player.y - loot.y);
          if (distLoot < 28) {
            if (loot.type === 'medkit') {
              setMedkits((prev) => prev + 1);
              soundManager.playClick();
            } else if (loot.type === 'ammo') {
              soundManager.playGlooWall();
            } else if (loot.type === 'armor') {
              localHp = Math.min(maxInitialHp, localHp + 50);
              setHp(Math.round(localHp));
            } else if (loot.type === 'airdrop') {
              localHp = maxInitialHp;
              setHp(localHp);
              setGlooCount((prev) => prev + 3);
              soundManager.playVictoryFanfare();
            }
            loots.splice(i, 1);
          }
        }
      }

      // -------------------------------------------------------------
      // 8. UPDATE ALIVE COUNT & CHECK BOOYAH VICTORY
      // -------------------------------------------------------------
      const currentAliveBots = enemies.filter((e) => e.isAlive).length;
      const totalAlive = currentAliveBots + (isSpectating ? 0 : 1);
      setAliveCount(totalAlive);

      if (totalAlive === 1 && !isSpectating && enemies.every((e) => !e.isAlive)) {
        triggerGameOver(true);
        return;
      }

      // -------------------------------------------------------------
      // 9. DRAW CANVAS GRAPHICS (Map, Safe Zone, Loots, Vehicle, Characters)
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Map Grid Background (Dark Military Tactical Grid)
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Safe Zone Circle (Glowing Blue Cyber Ring)
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(safeZone.x, safeZone.y, safeZone.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Outer Danger Storm (Transparent Blue Vignette)
      ctx.fillStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.beginPath();
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.arc(safeZone.x, safeZone.y, safeZone.radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();

      // Draw Loot Crates
      loots.forEach((loot) => {
        ctx.save();
        ctx.translate(loot.x, loot.y);
        if (loot.type === 'airdrop') {
          // Glowing Golden Airdrop
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 12;
          ctx.fillRect(-12, -12, 24, 24);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(-12, -4, 24, 8);
          ctx.font = '10px sans-serif';
          ctx.fillStyle = '#fff';
          ctx.fillText('CRATE', -14, -16);
        } else {
          ctx.fillStyle = loot.type === 'medkit' ? '#10b981' : '#3b82f6';
          ctx.fillRect(-8, -8, 16, 16);
        }
        ctx.restore();
      });

      // Draw Gloo Walls (Cyan Defensive Ice Crystals)
      glooWalls.forEach((gw) => {
        ctx.save();
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(gw.x, gw.y, gw.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      });

      // -------------------------------------------------------------
      // DRAW VEHICLE (Cyber Sports Car)
      // -------------------------------------------------------------
      ctx.save();
      ctx.translate(vehicle.x, vehicle.y);
      ctx.rotate(vehicle.angle);

      // Car shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-24, -14, 48, 28);

      // Car Body (Aerodynamic Cyber Chassis)
      ctx.fillStyle = vehicle.color;
      ctx.shadowColor = vehicle.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(-22, -12, 44, 24, 6);
      ctx.fill();

      // Cockpit / Windshield
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-6, -9, 16, 18);

      // Headlights
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(18, -10, 4, 5);
      ctx.fillRect(18, 5, 4, 5);

      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-16, -15, 10, 4);
      ctx.fillRect(8, -15, 10, 4);
      ctx.fillRect(-16, 11, 10, 4);
      ctx.fillRect(8, 11, 10, 4);

      // Nitro Exhaust Flames when boosting
      if (state.isDrivingState && keys['shift'] && vehicle.nitro > 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(-24, -4);
        ctx.lineTo(-38, 0);
        ctx.lineTo(-24, 4);
        ctx.fill();
      }

      ctx.restore();

      // Draw Vehicle Label / HP Bar
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#00f2fe';
      ctx.fillText(`🏎️ SPORTS CAR (${Math.round((vehicle.hp / vehicle.maxHp) * 100)}%)`, vehicle.x - 38, vehicle.y - 20);

      // Draw Bullets
      bullets.forEach((b) => {
        ctx.save();
        ctx.fillStyle = b.isPlayer ? '#f59e0b' : '#ef4444';
        ctx.shadowColor = b.isPlayer ? '#f59e0b' : '#ef4444';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.isPlayer ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // -------------------------------------------------------------
      // DRAW ENEMY BOTS (Red / Orange Operators)
      // -------------------------------------------------------------
      enemies.forEach((enemy) => {
        if (!enemy.isAlive) return;

        ctx.save();
        ctx.translate(enemy.x, enemy.y);

        // Body circle
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Gun barrel pointing
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(16, 0);
        ctx.stroke();

        // HP bar above bot
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(-16, -22, 32, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-16, -22, (enemy.hp / enemy.maxHp) * 32, 4);

        // Bot Name
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.name, 0, -26);

        ctx.restore();
      });

      // -------------------------------------------------------------
      // DRAW PLAYER CHARACTER (Gold / Cyan Legendary Operator)
      // -------------------------------------------------------------
      if (!isSpectating) {
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);

        // Alok Healing Sound Wave Ring
        if (isSkillActive) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 48, 0, Math.PI * 2);
          ctx.stroke();
        }

        // If not hidden in car, draw full operator model
        if (!state.isDrivingState) {
          // Operator Body
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
          ctx.fill();

          // Tactical Vest Armor
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-8, -10, 16, 20);

          // Weapon (AK-47 Blue Flame Draco)
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(4, 6);
          ctx.lineTo(24, 6);
          ctx.stroke();
        }

        ctx.restore();

        // Player Name and HP tag
        ctx.font = 'bold 10px sans-serif';
        ctx.fillStyle = '#f59e0b';
        ctx.textAlign = 'center';
        ctx.fillText(`${playerName} [LV.78]`, player.x, player.y - 24);
      }

      // Loop continue
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [hp, kills, isSkillActive, gameOver, isSpectating, maxInitialHp]);

  // Skill timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (skillCooldown > 0) {
      interval = setInterval(() => {
        setSkillCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [skillCooldown]);

  // Actions
  const deployGlooWall = () => {
    if (glooCount <= 0 && !isUnlimitedGloo) return;
    soundManager.playGlooWall();
    if (!isUnlimitedGloo) setGlooCount((prev) => prev - 1);

    const { player } = gameStateRef.current;
    const distance = 42;
    const wallX = player.x + Math.cos(player.angle) * distance;
    const wallY = player.y + Math.sin(player.angle) * distance;

    gameStateRef.current.glooWalls.push({
      id: `gw_${Date.now()}`,
      x: wallX,
      y: wallY,
      hp: 300,
      maxHp: 300,
      radius: 24
    });
  };

  const activateSkill = () => {
    if (skillCooldown > 0 || isSkillActive) return;
    soundManager.playSkillActivate();
    setIsSkillActive(true);

    setTimeout(() => {
      setIsSkillActive(false);
      setSkillCooldown(25);
    }, 8000);
  };

  const useMedkit = () => {
    if (medkits <= 0) return;
    soundManager.playHeal();
    setMedkits((prev) => prev - 1);
    setHp((prev) => Math.min(maxInitialHp, prev + 75));
  };

  const toggleVehicle = () => {
    const state = gameStateRef.current;
    if (state.isDrivingState) {
      // Exit vehicle
      soundManager.playClick();
      state.isDrivingState = false;
      setIsDriving(false);
      state.vehicle.isOccupied = false;
      // Step slightly outside car
      state.player.x = state.vehicle.x - 30;
      state.player.y = state.vehicle.y;
    } else {
      // Enter vehicle if near
      const dist = Math.hypot(state.player.x - state.vehicle.x, state.player.y - state.vehicle.y);
      if (dist < 65) {
        soundManager.playCarEngine();
        state.isDrivingState = true;
        setIsDriving(true);
        state.vehicle.isOccupied = true;
      }
    }
  };

  const triggerGameOver = (won: boolean) => {
    setGameOver(true);
    setIsVictory(won);
    if (won) {
      soundManager.playVictoryFanfare();
      addDiamonds(500);
      addGold(1500);
      addBadges(50);
    }
  };

  const restartMatch = () => {
    setGameOver(false);
    setIsVictory(false);
    setIsSpectating(false);
    setHp(maxInitialHp);
    setKills(0);
    setAliveCount(32);
    setGlooCount(isUnlimitedGloo ? 99 : 5);
    setMedkits(3);
    gameStateRef.current.isDrivingState = false;
    setIsDriving(false);
    gameStateRef.current.player.x = 400;
    gameStateRef.current.player.y = 400;
    gameStateRef.current.bullets = [];
    gameStateRef.current.glooWalls = [];
    gameStateRef.current.safeZone.radius = 420;
    gameStateRef.current.enemies.forEach((e, i) => {
      e.isAlive = true;
      e.hp = 120;
      e.kills = 0;
    });
  };

  // Moderator in-match action
  const summonAirdrop = () => {
    soundManager.playClick();
    const { player } = gameStateRef.current;
    gameStateRef.current.loots.push({
      id: `airdrop_${Date.now()}`,
      x: player.x + (Math.random() - 0.5) * 60,
      y: player.y + (Math.random() - 0.5) * 60,
      type: 'airdrop',
      name: '🔥 Moderator Summoned Airdrop'
    });
    setKillFeed((prev) => ['🚁 Chief Moderator called an emergency Airdrop crate!', ...prev.slice(0, 4)]);
  };

  const shrinkSafeZoneNow = () => {
    battleAudioEngine.playSafeZoneWarning();
    soundManager.playClick();
    gameStateRef.current.safeZone.radius = Math.max(100, gameStateRef.current.safeZone.radius - 80);
    setKillFeed((prev) => ['⚡ Safe Zone Shrink Accelerated by Match Referee!', ...prev.slice(0, 4)]);
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-[#05070a] select-none overflow-hidden">
      {/* Top Match HUD Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-2 px-4 py-2 bg-[#090d16]/95 border border-white/10 rounded-xl backdrop-blur-md text-xs">
        {/* Left: Back / Match info */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToLobby}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="font-bold">Lobby</span>
          </button>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {customRoomConfig?.isCustomRoom ? '32P CUSTOM ROOM' : 'BR RANKED (32P)'}
            </span>
            <span className="text-gray-400 font-mono">Bermuda 2.0</span>
          </div>
        </div>

        {/* Center: Alive count & Kills */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-gray-400 uppercase font-bold text-[10px]">Alive:</span>
            <span className="font-heading font-black text-lg text-emerald-400 font-mono tracking-wider">
              {aliveCount}/32
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Crosshair className="w-4 h-4 text-red-500" />
            <span className="text-gray-400 uppercase font-bold text-[10px]">Kills:</span>
            <span className="font-heading font-black text-lg text-red-400 font-mono">{kills}</span>
          </div>
        </div>

        {/* Right: Moderator in-game tools & 3D Spatial Audio Status */}
        <div className="flex items-center space-x-2">
          {/* Spatial Web Audio Indicator / Mute Toggle */}
          <button
            onClick={toggleMute}
            title={soundMuted ? 'Unmute Spatial Battle Audio' : '3D Spatial Web Audio Active (Click to Mute)'}
            className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center space-x-1.5 transition-all ${
              soundMuted
                ? 'bg-red-950/80 border-red-500/40 text-red-400'
                : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20'
            }`}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
            <span className="hidden sm:inline">{soundMuted ? 'AUDIO OFF' : '3D AUDIO'}</span>
          </button>

          <button
            onClick={summonAirdrop}
            title="Moderator: Call Airdrop"
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[10px] hover:bg-amber-500/30 transition-all flex items-center space-x-1"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Air Drop</span>
          </button>
          <button
            onClick={shrinkSafeZoneNow}
            title="Moderator: Shrink Safe Zone"
            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-[10px] hover:bg-cyan-500/30 transition-all flex items-center space-x-1"
          >
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">Shrink Zone</span>
          </button>
        </div>
      </div>

      {/* Main Game Screen & Canvas */}
      <div className="relative w-full max-w-5xl aspect-[4/3] max-h-[76vh] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <canvas
          ref={canvasRef}
          width={900}
          height={700}
          className="w-full h-full object-contain cursor-crosshair"
        />

        {/* Top-Right Killfeed Overlay */}
        <div className="absolute top-3 right-3 max-w-xs space-y-1 pointer-events-none z-10">
          {killFeed.map((msg, i) => (
            <div
              key={i}
              className="text-[10px] px-2.5 py-1 rounded bg-black/75 border border-white/10 text-gray-200 backdrop-blur-sm animate-fade-in truncate"
            >
              {msg}
            </div>
          ))}
        </div>

        {/* Near Vehicle Interaction Prompt */}
        {nearVehicle && !isDriving && !isSpectating && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
            <button
              onClick={toggleVehicle}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-heading font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-pulse transition-all"
            >
              <Car className="w-5 h-5 fill-black" />
              <span>PRESS [G] / TAP TO DRIVE SPORTS CAR (140 KM/H)</span>
            </button>
          </div>
        )}

        {/* Driving Vehicle HUD (Speedometer & Nitro Bar) */}
        {isDriving && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center space-x-4 bg-black/85 border border-cyan-500/40 px-5 py-2.5 rounded-2xl backdrop-blur-md z-20 pointer-events-auto">
            <div className="text-center">
              <span className="font-heading font-black text-2xl text-cyan-400 font-mono block leading-none">
                {vehicleSpeedKmh}
              </span>
              <span className="text-[9px] text-gray-400 font-bold uppercase">KM / H</span>
            </div>

            <div className="w-px h-8 bg-white/10" />

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-gray-300 font-bold">
                <span>NITRO BOOST [SHIFT]</span>
                <span className="text-cyan-400">{vehicleNitro}%</span>
              </div>
              <div className="w-32 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all"
                  style={{ width: `${vehicleNitro}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => soundManager.playCarHorn()}
              title="Honk Horn [H]"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={toggleVehicle}
              className="px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs uppercase border border-red-500/30"
            >
              Exit [G]
            </button>
          </div>
        )}

        {/* Bottom Battle Controls HUD */}
        {!isSpectating && (
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between pointer-events-none z-10">
            {/* HP Bar */}
            <div className="w-64 p-3 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md pointer-events-auto space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-300">HP {hp}/{maxInitialHp}</span>
                <span className="text-[10px] text-emerald-400">EP 100/100</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    hp > 80 ? 'bg-emerald-500' : hp > 40 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(hp / maxInitialHp) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons (Medkit, Gloo Wall, Active Skill, Vehicle) */}
            <div className="flex items-center space-x-2 pointer-events-auto">
              {/* Medkit (Q) */}
              <button
                onClick={useMedkit}
                disabled={medkits <= 0}
                className="flex flex-col items-center bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/50 p-2 sm:px-3 rounded-xl text-white transition-transform active:scale-95 disabled:opacity-40"
              >
                <div className="flex items-center space-x-1">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span className="font-heading font-black text-xs">{medkits}</span>
                </div>
                <span className="text-[9px] text-gray-400">Medkit [Q]</span>
              </button>

              {/* Gloo Wall (F) */}
              <button
                onClick={deployGlooWall}
                disabled={glooCount <= 0 && !isUnlimitedGloo}
                className="flex flex-col items-center bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/50 p-2 sm:px-3 rounded-xl text-white transition-transform active:scale-95 disabled:opacity-40"
              >
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span className="font-heading font-black text-xs">
                    {isUnlimitedGloo ? '∞' : glooCount}
                  </span>
                </div>
                <span className="text-[9px] text-gray-400">Gloo Wall [F]</span>
              </button>

              {/* Active Skill (E) */}
              <button
                onClick={activateSkill}
                disabled={skillCooldown > 0 || isSkillActive}
                className={`flex flex-col items-center border p-2 sm:px-3 rounded-xl text-white transition-transform active:scale-95 ${
                  isSkillActive
                    ? 'bg-cyan-500 border-cyan-300 text-black font-black animate-pulse'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/50'
                }`}
              >
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="font-heading font-black text-xs">
                    {skillCooldown > 0 ? `${skillCooldown}s` : 'READY'}
                  </span>
                </div>
                <span className="text-[9px] text-gray-400">Skill [E]</span>
              </button>
            </div>
          </div>
        )}

        {/* VICTORY (BOOYAH!) / DEFEAT MODAL OVERLAY */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 z-30 animate-fade-in">
            {isVictory ? (
              <div className="text-center space-y-4">
                <div className="font-heading font-black text-7xl sm:text-9xl text-amber-400 tracking-widest drop-shadow-[0_0_35px_rgba(245,158,11,0.8)]">
                  BOOYAH!
                </div>
                <div className="text-lg font-bold text-white tracking-wider">
                  #1 CHAMPION OF BERMUDA (32 PLAYERS)
                </div>
                <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/60 inline-flex items-center gap-6">
                  <div>
                    <span className="text-xs text-gray-400 block font-bold">KILLS</span>
                    <span className="font-heading font-black text-3xl text-red-400">{kills}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-bold">DIAMONDS</span>
                    <span className="font-heading font-black text-3xl text-cyan-300">+500 💎</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block font-bold">BADGES</span>
                    <span className="font-heading font-black text-3xl text-purple-300">+50 🎖️</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="font-heading font-black text-6xl sm:text-8xl text-red-500 tracking-widest">
                  ELIMINATED
                </div>
                <div className="text-sm text-gray-400">
                  You placed #{aliveCount} on Bermuda 2.0. Switch to Spectator mode or try again!
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={restartMatch}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-heading font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN</span>
              </button>

              {!isVictory && (
                <button
                  onClick={() => {
                    setGameOver(false);
                    setIsSpectating(true);
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>SPECTATE SURVIVORS</span>
                </button>
              )}

              <button
                onClick={onBackToLobby}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                RETURN TO LOBBY
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Control hints footer */}
      <div className="w-full max-w-5xl mt-2 flex flex-wrap items-center justify-between text-[11px] text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Move: <strong className="text-white">WASD</strong></span>
          <span>Shoot: <strong className="text-white">Mouse Click</strong></span>
          <span>Drive Vehicle: <strong className="text-cyan-400">G / F</strong></span>
          <span>Nitro: <strong className="text-cyan-400">SHIFT</strong></span>
          <span>Horn: <strong className="text-white">H</strong></span>
          <span>Gloo Wall: <strong className="text-cyan-400">F</strong></span>
          <span>Active Skill: <strong className="text-amber-400">E</strong></span>
        </div>
        <span className="text-amber-400 font-bold">32-Player Tournament Engine Active</span>
      </div>
    </div>
  );
};
