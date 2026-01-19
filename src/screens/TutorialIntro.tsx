import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { useDungeonStore } from '../store/useDungeonStore';

export default function TutorialIntro() {
  const { setPhase } = useGameStore();
  const { generateTutorialDungeon } = useDungeonStore();

  const handleStandUp = () => {
    // 2. Generate the floor data
    generateTutorialDungeon();

    // 3. Switch to the Map View
    // Make sure you added 'DUNGEON' to your GamePhase type!
    setPhase('DUNGEON');
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6 relative overflow-hidden">
      <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />
        <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-50" />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} className="relative z-10 max-w-2xl w-full space-y-8 text-center">
          {/* System Error Message */}
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="border border-red-500/50 bg-red-900/10 p-6 rounded animate-pulse">
            <h1 className="text-red-500 font-bold tracking-[0.2em] mb-2 text-xl">[ ERROR: COORDINATES UNKNOWN ]</h1>
            <p className="text-sm text-red-200/70">Connection to the Hub server failed. Initiating Emergency Survival Protocol...</p>
          </motion.div>

          {/* Narrative Text */}
          <div className="p-8 border border-gray-800 bg-gray-900/50 backdrop-blur-sm rounded-lg shadow-2xl">
            <p className="italic text-gray-400 mb-8 text-lg leading-relaxed">
              You open your eyes. The air is damp and smells of rust. You are lying on a cold stone floor.
              <br />
              <br />
              You don't remember how you got here, but you see a dim light pulsing down the corridor... and something is moving towards you.
            </p>

            <button
              onClick={handleStandUp}
              className="px-10 py-4 bg-gray-200 text-black font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Stand Up
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
