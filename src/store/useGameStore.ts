import { create } from 'zustand';

type GamePhase = 'CREATION' | 'TUTORIAL_INTRO' | 'COMBAT' | 'HUB' | 'DUNGEON';

interface GameState {
  phase: GamePhase;
  // We can add logs here later to show "System Messages"
  setPhase: (phase: GamePhase) => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'CREATION',
  setPhase: (phase) => set({ phase }),
}));
