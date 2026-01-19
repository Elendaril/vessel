import { motion, AnimatePresence } from 'framer-motion';
import { User, Skull } from 'lucide-react';
import { useCombatStore } from '../../store/useCombatStore';

export default function TurnTimeline() {
  const { turnQueue } = useCombatStore();

  // Show next 6 turns
  const visibleTurns = turnQueue.slice(0, 6);

  return (
    <div className="flex flex-col gap-2 p-2 bg-black/40 border-r border-system-cyan/20 h-full min-w-[80px] items-center">
      <div className="text-[10px] text-system-cyan font-bold uppercase tracking-widest mb-2 writing-vertical-lr text-center">Timeline</div>

      <div className="flex flex-col gap-3 pt-4">
        <AnimatePresence initial={false}>
          {visibleTurns.map((turn, index) => (
            <motion.div
              key={turn.id}
              layout
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0, transition: { duration: 0.2 } }}
              className={`
                relative w-10 h-10 rounded border-2 flex items-center justify-center shadow-lg transition-colors
                ${index === 0 ? 'scale-110 border-yellow-400 z-10 bg-gray-800' : 'scale-90 opacity-70 border-gray-700 bg-gray-900'}
              `}
            >
              {/* Icon based on Owner */}
              {turn.owner === 'PLAYER' ? <User size={index === 0 ? 20 : 16} className="text-blue-400" /> : <Skull size={index === 0 ? 20 : 16} className="text-red-400" />}

              {/* "Current" Arrow indicator */}
              {index === 0 && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-l-[8px] border-l-yellow-400 border-b-[6px] border-b-transparent" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
