export interface Skill {
  id: string;
  name: string;
  description: string;
  damageMultiplier: number; // e.g., 1.5x ATK
  mpCost: number;

  // NEW: How heavy is this skill?
  // 1.0 = Standard, 0.5 = Fast, 2.0 = Slow
  speedModifier: number;
}
