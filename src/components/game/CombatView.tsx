import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCombatStore } from '../../store/useCombatStore';
import { usePlayerStore } from '../../store/usePlayerStore';
import { useGameStore } from '../../store/useGameStore'; // Import 1
import { useDungeonStore } from '../../store/useDungeonStore'; // Import 2
import { ENEMY_DB } from '../../data/enemies';
import TurnTimeline from '../ui/TurnTimeline';
import { SKILL_DB } from '../../data/skills';

export default function CombatView() {
  const { enemy, logs, turnQueue, initializeCombat, performPlayerAction, performEnemyAction } = useCombatStore();

  // FIX 1: Combined destructuring into one line
  const { hp, maxHp, mp, maxMp, name, equippedSkills } = usePlayerStore();

  // 1. Initialize Combat
  useEffect(() => {
    initializeCombat(ENEMY_DB['slime_weak']);
  }, []);

  const { setPhase } = useGameStore();
  const { completeRoom } = useDungeonStore();

  // 2. AI Turn Handler
  useEffect(() => {
    if (turnQueue.length > 0 && turnQueue[0].owner === 'ENEMY') {
      const timer = setTimeout(() => {
        performEnemyAction();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [turnQueue]);

  if (!enemy) return <div className="text-white p-10">Loading Encounter...</div>;

  const isPlayerTurn = turnQueue.length > 0 && turnQueue[0].owner === 'PLAYER';
  const isVictory = enemy.hp <= 0;

  const handleVictory = () => {
    completeRoom(); // Mark current room as cleared
    setPhase('DUNGEON'); // Go back to map
  };

  return (
    <div className="w-full h-full flex font-mono relative">
      {/* LEFT: TIMELINE SIDEBAR */}
      <TurnTimeline />

      {/* RIGHT: MAIN COMBAT AREA */}
      <div className="flex-1 flex flex-col p-4 gap-4">
        {/* --- ENEMY SECTION --- */}
        <div className="flex flex-col items-center justify-center relative py-6 min-h-[200px]">
          <motion.div animate={!isPlayerTurn ? { scale: [1, 1.1, 1] } : {}} className={`w-32 h-32 rounded-full ${enemy.sprite} blur-sm flex items-center justify-center shadow-[0_0_30px_#10b981]`}>
            <div className="w-20 h-20 bg-white/20 rounded-full animate-pulse" />
          </motion.div>

          <div className="mt-6 w-full max-w-xs text-center space-y-2">
            <div className="flex justify-between text-red-400 font-bold uppercase text-sm">
              <span>{enemy.name}</span>
              <span>LVL {enemy.level}</span>
            </div>
            <div className="h-4 bg-gray-900 border border-red-500/30 rounded-sm relative overflow-hidden">
              <motion.div initial={{ width: '100%' }} animate={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} className="absolute top-0 left-0 h-full bg-red-500" />
            </div>
            <p className="text-xs text-red-500/70">
              {enemy.hp} / {enemy.maxHp} HP
            </p>
          </div>
        </div>
        {/* --- LOGS --- */}
        <div className="flex-1 bg-black/40 border-y border-system-cyan/20 p-4 overflow-hidden relative min-h-[120px]">
          <div className="space-y-1">
            <AnimatePresence initial={false}>
              {logs.slice(0, 5).map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-sm ${log.type === 'damage' ? 'text-yellow-400' : log.type === 'enemy' ? 'text-red-400' : 'text-blue-300'}`}
                >
                  <span className="opacity-50 mr-2 text-[10px]">[{new Date(Number(log.id)).toLocaleTimeString([], { second: '2-digit', minute: '2-digit' })}]</span>
                  {log.message}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        {/* --- CONTROLS --- */}
        <div className="grid grid-cols-12 gap-4 h-40">
          {/* Player HP Panel */}
          <div className="col-span-4 system-window p-3 space-y-2">
            <h3 className="text-system-cyan font-bold">{name}</h3>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-blue-200">
                <span>HP</span>{' '}
                <span>
                  {hp}/{maxHp}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full">
                <div style={{ width: `${(hp / maxHp) * 100}%` }} className="h-full bg-red-500" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-blue-200">
                <span>MP</span>{' '}
                <span>
                  {mp}/{maxMp}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full">
                <div style={{ width: `${(mp / maxMp) * 100}%` }} className="h-full bg-blue-500" />
              </div>
            </div>
          </div>

          {/* Actions Panel */}
          <div className="col-span-8 grid grid-cols-2 gap-2 overflow-y-auto max-h-40 pr-1">
            {equippedSkills.map((skillId) => {
              const skill = SKILL_DB[skillId];
              if (!skill) return null;

              const canAfford = mp >= skill.mpCost;

              return (
                <button
                  key={skillId}
                  onClick={() => performPlayerAction(skillId)}
                  disabled={!isPlayerTurn || !canAfford}
                  className={`
                    flex flex-col items-center justify-center gap-1 p-2 border transition-all relative overflow-hidden group
                    ${
                      canAfford && isPlayerTurn
                        ? 'border-system-cyan/30 bg-system-cyan/5 hover:bg-system-cyan/20 hover:border-system-cyan'
                        : 'border-gray-800 bg-gray-900 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <span className="font-bold uppercase tracking-widest text-xs z-10">{skill.name}</span>

                  <div className="flex gap-3 text-[10px] opacity-70 z-10">
                    <span className={canAfford ? 'text-blue-300' : 'text-red-400'}>MP: {skill.mpCost}</span>
                    <span className="text-yellow-500">SPD: {skill.speedModifier}x</span>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-system-cyan/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              );
            })}
          </div>
        </div>{' '}
        {/* FIX 2: Closed the grid container */}
      </div>

      {/* --- VICTORY OVERLAY --- */}
      <AnimatePresence>
        {isVictory && (
          <div className="...">
            <h1 className="...">VICTORY</h1>
            <button onClick={handleVictory} className="...">
              Return to Map
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
