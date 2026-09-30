/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider } from './context/GameContext';
import { HeaderBar } from './components/HeaderBar';
import { Lobby } from './components/Lobby';
import { BattleRoyaleGame } from './components/BattleRoyaleGame';
import { ModeratorModal } from './components/ModeratorModal';
import { CharacterModal } from './components/CharacterModal';
import { VaultModal } from './components/VaultModal';
import { LuckRoyaleModal } from './components/LuckRoyaleModal';
import { DailyRewardsModal } from './components/DailyRewardsModal';
import { EventsModal } from './components/EventsModal';
import { ProfileModal } from './components/ProfileModal';
import { CustomRoomModal } from './components/CustomRoomModal';
import { DevPlanModal } from './components/DevPlanModal';
import { CustomRoomSettings } from './types/game';

function MainGame() {
  const [screen, setScreen] = useState<'LOBBY' | 'BATTLE'>('LOBBY');
  const [activeModal, setActiveModal] = useState<
    | 'MODERATOR'
    | 'CHARACTERS'
    | 'VAULT'
    | 'LUCK_ROYALE'
    | 'DAILY_REWARDS'
    | 'EVENTS'
    | 'PROFILE'
    | 'TOPUP'
    | 'CUSTOM_ROOM'
    | 'DEV_PLAN'
    | null
  >(null);

  const [customRoomConfig, setCustomRoomConfig] = useState<{
    isCustomRoom: boolean;
    settings: CustomRoomSettings;
    asSpectator?: boolean;
  } | undefined>(undefined);

  const handleStartCustomMatch = (config?: {
    isCustomRoom: boolean;
    settings: CustomRoomSettings;
    asSpectator?: boolean;
  }) => {
    setCustomRoomConfig(config);
    setScreen('BATTLE');
  };

  const handleStartStandardMatch = () => {
    setCustomRoomConfig(undefined);
    setScreen('BATTLE');
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col font-sans-clean select-none">
      {/* Top Header Navigation */}
      <HeaderBar
        onOpenModerator={() => setActiveModal('MODERATOR')}
        onOpenProfile={() => setActiveModal('PROFILE')}
        onOpenTopUp={() => setActiveModal('TOPUP')}
      />

      {/* Main Viewport: Lobby or Battle Royale Match */}
      <main className="flex-1 relative flex flex-col">
        {screen === 'LOBBY' ? (
          <Lobby
            onStartMatch={handleStartStandardMatch}
            onOpenCharacters={() => setActiveModal('CHARACTERS')}
            onOpenVault={() => setActiveModal('VAULT')}
            onOpenLuckRoyale={() => setActiveModal('LUCK_ROYALE')}
            onOpenDailyRewards={() => setActiveModal('DAILY_REWARDS')}
            onOpenEvents={() => setActiveModal('EVENTS')}
            onOpenModerator={() => setActiveModal('MODERATOR')}
            onOpenCustomRoom={() => setActiveModal('CUSTOM_ROOM')}
            onOpenDevPlan={() => setActiveModal('DEV_PLAN')}
          />
        ) : (
          <BattleRoyaleGame
            onBackToLobby={() => {
              setScreen('LOBBY');
              setCustomRoomConfig(undefined);
            }}
            customRoomConfig={customRoomConfig}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <ModeratorModal
        isOpen={activeModal === 'MODERATOR'}
        onClose={() => setActiveModal(null)}
        onOpenCustomRoom={() => setActiveModal('CUSTOM_ROOM')}
        onOpenDevPlan={() => setActiveModal('DEV_PLAN')}
      />

      <CustomRoomModal
        isOpen={activeModal === 'CUSTOM_ROOM'}
        onClose={() => setActiveModal(null)}
        onStartMatch={handleStartCustomMatch}
      />

      <DevPlanModal
        isOpen={activeModal === 'DEV_PLAN'}
        onClose={() => setActiveModal(null)}
      />

      <CharacterModal
        isOpen={activeModal === 'CHARACTERS'}
        onClose={() => setActiveModal(null)}
      />

      <VaultModal
        isOpen={activeModal === 'VAULT'}
        onClose={() => setActiveModal(null)}
      />

      <LuckRoyaleModal
        isOpen={activeModal === 'LUCK_ROYALE'}
        onClose={() => setActiveModal(null)}
      />

      <DailyRewardsModal
        isOpen={activeModal === 'DAILY_REWARDS'}
        onClose={() => setActiveModal(null)}
      />

      <EventsModal
        isOpen={activeModal === 'EVENTS'}
        onClose={() => setActiveModal(null)}
      />

      <ProfileModal
        isOpen={activeModal === 'PROFILE' || activeModal === 'TOPUP'}
        onClose={() => setActiveModal(null)}
        defaultTab={activeModal === 'TOPUP' ? 'topup' : 'profile'}
      />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainGame />
    </GameProvider>
  );
}
