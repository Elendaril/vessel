import { type Enemy } from '../types/combat';

// A Dictionary/Map is faster to look up than an Array
export const ENEMY_DB: Record<string, Enemy> = {
  slime_weak: {
    id: 'slime_weak',
    name: 'Weakened Slime',
    level: 1,
    hp: 20,
    maxHp: 20,
    attack: 3,
    defense: 0,
    speed: 10,
    expReward: 10,
    sprite: 'bg-emerald-500', // We can replace this with image paths later
  },
  rat_sewer: {
    id: 'rat_sewer',
    name: 'Starving Rat',
    level: 2,
    hp: 35,
    maxHp: 35,
    attack: 5,
    defense: 1,
    speed: 10,
    expReward: 15,
    sprite: 'bg-gray-600',
  },
  // Easy to add more here...
};
