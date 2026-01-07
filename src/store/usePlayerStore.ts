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
  gender: 'Male' | 'Female' | 'Unknown';
  portrait: string | null;
  classTitle: string;
  isAwakened: boolean;
  level: number;
  exp: number;
  stats: Stats;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  ppPool: number;
  // Actions
  awaken: (data: { name: string; gender: any; portrait: string; classTitle: string; stats: Stats }) => void;
  gainExp: (amount: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  name: 'Vessel #001',
  gender: 'Unknown',
  portrait: null,
  classTitle: '',
  isAwakened: false,
  level: 0,
  exp: 0,
  stats: { str: 0, vit: 0, int: 0, agi: 0, dex: 0, luk: 0, wil: 0, sen: 0 },
  hp: 10,
  maxHp: 10,
  mp: 5,
  maxMp: 5,
  ppPool: 0,

  awaken: (data) =>
    set(() => ({
      isAwakened: true,
      name: data.name,
      gender: data.gender,
      portrait: data.portrait,
      classTitle: data.classTitle,
      level: 1,
      stats: data.stats,
      hp: data.stats.vit * 10,
      maxHp: data.stats.vit * 10,
      mp: data.stats.int * 8,
      maxMp: data.stats.int * 8,
      ppPool: Math.floor(data.stats.wil / 5) + 3,
    })),

  gainExp: (amount) => set((state) => ({ exp: state.exp + amount })),
}));
