import { create } from 'zustand';

type GamePhase = 'CREATION' | 'TUTORIAL' | 'HUB' | 'DUNGEON' | 'COMBAT';

interface GameState {
  phase: GamePhase;
  // We can add logs here later to show "System Messages"
  setPhase: (phase: GamePhase) => void;
}

export const useGameStore = create<GameState>((set) => ({
  phase: 'CREATION',
  setPhase: (phase) => set({ phase }),
}));
