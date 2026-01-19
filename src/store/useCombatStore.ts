import { create } from 'zustand';
import { type Enemy } from '../types/combat';
import { usePlayerStore } from './usePlayerStore';
import { SKILL_DB } from '../data/skills';

export type TurnOwner = 'PLAYER' | 'ENEMY';

interface TurnNode {
  id: string;
  owner: TurnOwner;
}

interface CombatState {
  enemy: Enemy | null;
  logs: { id: string; message: string; type: 'damage' | 'info' | 'critical' | 'enemy' }[];
  turnQueue: TurnNode[];

  initializeCombat: (enemy: Enemy) => void;
  performPlayerAction: (skillId: string) => void;
  performEnemyAction: () => void;
}

// --- CONSTANTS ---
const BASE_ACTION_VALUE = 10000;

// --- HELPER: Turn Simulation ---
// Now accepts offsets to simulate "Cooldown" (recovery time)
function generateTurnQueue(playerSpd: number, enemySpd: number, currentQueue: TurnNode[] = [], playerOffset: number = 0, enemyOffset: number = 0): TurnNode[] {
  if (currentQueue.length >= 10) return currentQueue;

  const newQueue = [...currentQueue];

  // Initialize "Next Action Time"
  // If an offset is provided (e.g., player just attacked), they start at that value.
  // Otherwise, they start at their standard interval.
  let playerNext = playerOffset + BASE_ACTION_VALUE / Math.max(1, playerSpd);
  let enemyNext = enemyOffset + BASE_ACTION_VALUE / Math.max(1, enemySpd);

  // Cap counters
  let playerConsecutive = 0;
  let enemyConsecutive = 0;

  // Fill queue until we have 10 items
  while (newQueue.length < 10) {
    if (playerNext <= enemyNext) {
      // PLAYER ACTS
      if (playerConsecutive < 3) {
        newQueue.push({ id: Math.random().toString(), owner: 'PLAYER' });
        playerConsecutive++;
        enemyConsecutive = 0;
        playerNext += BASE_ACTION_VALUE / Math.max(1, playerSpd);
      } else {
        // Force Enemy
        newQueue.push({ id: Math.random().toString(), owner: 'ENEMY' });
        enemyConsecutive++;
        playerConsecutive = 0;
        enemyNext += BASE_ACTION_VALUE / Math.max(1, enemySpd);
      }
    } else {
      // ENEMY ACTS
      if (enemyConsecutive < 3) {
        newQueue.push({ id: Math.random().toString(), owner: 'ENEMY' });
        enemyConsecutive++;
        playerConsecutive = 0;
        enemyNext += BASE_ACTION_VALUE / Math.max(1, enemySpd);
      } else {
        // Force Player
        newQueue.push({ id: Math.random().toString(), owner: 'PLAYER' });
        playerConsecutive++;
        enemyConsecutive = 0;
        playerNext += BASE_ACTION_VALUE / Math.max(1, playerSpd);
      }
    }
  }

  return newQueue;
}

export const useCombatStore = create<CombatState>((set, get) => ({
  enemy: null,
  logs: [],
  turnQueue: [],

  initializeCombat: (enemy) => {
    const playerStats = usePlayerStore.getState().stats;
    const playerSpeed = 10 + playerStats.agi * 2;
    const enemySpeed = enemy.speed;

    // Initial generation (no offsets)
    const initialQueue = generateTurnQueue(playerSpeed, enemySpeed);

    set({
      enemy: { ...enemy },
      logs: [{ id: 'init', message: `Encounter: ${enemy.name} (SPD: ${enemy.speed})`, type: 'info' }],
      turnQueue: initialQueue,
    });
  },

  performPlayerAction: (skillId: string) => {
    const { turnQueue, enemy, logs } = get();
    const playerStore = usePlayerStore.getState();
    const playerStats = playerStore.stats;

    // 1. Checks
    if (!enemy || !turnQueue.length || turnQueue[0].owner !== 'PLAYER') return;

    // 2. Get Skill Data
    const skill = SKILL_DB[skillId];
    if (!skill) {
      console.error(`Skill ${skillId} not found!`);
      return;
    }

    // 3. MP Cost Check
    if (!playerStore.consumeMp(skill.mpCost)) {
      set({ logs: [{ id: Date.now().toString(), message: 'Not enough Mana!', type: 'info' }, ...logs] });
      return; // Stop execution
    }

    // 4. Damage Calculation (Base Dmg * Skill Multiplier)
    const rawDamage = Math.max(1, playerStats.str * skill.damageMultiplier - enemy.defense);
    const finalDamage = Math.floor(rawDamage * (0.9 + Math.random() * 0.2));

    const newEnemyHp = Math.max(0, enemy.hp - finalDamage);
    const isDead = newEnemyHp === 0;

    // 5. Timeline Update (Action Value)
    const remainingQueue = turnQueue.slice(1);
    const playerSpeed = 10 + playerStats.agi * 2;

    // MAGIC: Use the skill's specific speedModifier
    const recoveryValue = (10000 * skill.speedModifier) / Math.max(1, playerSpeed);

    const nextQueue = generateTurnQueue(playerSpeed, enemy.speed, remainingQueue, recoveryValue, 0);

    set({
      enemy: { ...enemy, hp: newEnemyHp },
      logs: [{ id: Date.now().toString(), message: `Used ${skill.name} for ${finalDamage} dmg!`, type: 'damage' }, ...logs],
      turnQueue: nextQueue,
    });

    if (isDead) {
      set({ logs: [{ id: Date.now().toString(), message: 'VICTORY!', type: 'info' }, ...logs] });
    }
  },

  performEnemyAction: () => {
    const { enemy, logs, turnQueue } = get();
    if (!enemy) return;

    // 1. Damage Logic
    const damage = enemy.attack;

    // Directly update Player Store HP
    // (Later we can add a 'takeDamage' action to usePlayerStore for cleaner code)
    const currentPlayer = usePlayerStore.getState();
    usePlayerStore.setState({ hp: Math.max(0, currentPlayer.hp - damage) });

    // 2. Queue Logic
    const remainingQueue = turnQueue.slice(1);
    const playerStats = usePlayerStore.getState().stats;
    const playerSpeed = 10 + playerStats.agi * 2;

    // Enemy acted, so they get a recovery delay
    // Standard attack = 1.0 modifier
    const recoveryValue = (BASE_ACTION_VALUE * 1.0) / Math.max(1, enemy.speed);

    const nextQueue = generateTurnQueue(
      playerSpeed,
      enemy.speed,
      remainingQueue,
      0, // Player offset (waiting normally)
      recoveryValue, // Enemy offset (recovering)
    );

    set({
      logs: [{ id: Date.now().toString(), message: `${enemy.name} attacks for ${damage}!`, type: 'enemy' }, ...logs],
      turnQueue: nextQueue,
    });
  },
}));
