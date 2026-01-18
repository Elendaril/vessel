import { create } from 'zustand';

interface Stats {
  str: number;
  vit: number;
  int: number;
  agi: number;
  dex: number;
  luk: number;
  wil: number;
  sen: number;
}

interface PlayerState {
  name: string;
  gender: 'Male' | 'Female';
  portrait: string;
  isAwakened: boolean;
  level: number;
  // We remove classTitle for now, or set it to "???"
  classTitle: string;
  stats: Stats;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;

  awaken: (name: string, gender: 'Male' | 'Female', portrait: string) => void;
}

const BASE_STATS = { str: 5, vit: 5, int: 5, agi: 5, dex: 5, luk: 5, wil: 5, sen: 5 };

export const usePlayerStore = create<PlayerState>((set) => ({
  name: 'Unknown',
  gender: 'Male',
  portrait: 'p1',
  isAwakened: false,
  level: 0,
  classTitle: 'Awakened',
  stats: BASE_STATS,
  hp: 50,
  maxHp: 50,
  mp: 40,
  maxMp: 40,

  awaken: (name, gender, portrait) =>
    set({
      isAwakened: true,
      name,
      gender,
      portrait,
      classTitle: 'Novice', // Or "Survivor"
      level: 1,
      stats: BASE_STATS,
      // Recalculate derived stats
      hp: BASE_STATS.vit * 10,
      maxHp: BASE_STATS.vit * 10,
      mp: BASE_STATS.int * 8,
      maxMp: BASE_STATS.int * 8,
    }),
}));
