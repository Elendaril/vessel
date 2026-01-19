export interface Enemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number; // New Stat
  expReward: number;
  sprite: string;
}

export const TUTORIAL_SLIME: Enemy = {
  id: 'tutorial_slime',
  name: 'Slime',
  level: 1,
  hp: 20,
  maxHp: 20,
  attack: 3,
  defense: 0,
  speed: 1,
  expReward: 10,
  sprite: 'bg-emerald-500',
};
