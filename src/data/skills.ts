import { type Skill } from '../types/skills';

export const SKILL_DB: Record<string, Skill> = {
  basic_strike: {
    id: 'basic_strike',
    name: 'Strike',
    description: 'A simple combat maneuver.',
    damageMultiplier: 1.0,
    mpCost: 0,
    speedModifier: 1.0,
  },
  quick_slash: {
    id: 'quick_slash',
    name: 'Flash Cut',
    description: 'Lightning fast. Low damage, quick recovery.',
    damageMultiplier: 0.4, // Adjusted from 20 to 0.8
    mpCost: 3,
    speedModifier: 0.1, // Extremely fast
  },
  heavy_slam: {
    id: 'heavy_slam',
    name: 'Titan Smash',
    description: 'Devastating blow. High delay.',
    damageMultiplier: 2.5,
    mpCost: 20,
    speedModifier: 2.0,
  },
};
