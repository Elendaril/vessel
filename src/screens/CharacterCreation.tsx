import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, User, ChevronRight, Sparkles } from 'lucide-react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useGameStore } from '../store/useGameStore';

// Portraits config could also move to src/data/constants.ts later
const PORTRAITS = [
  { id: 'p1', color: 'bg-red-500' },
  { id: 'p2', color: 'bg-blue-500' },
  { id: 'p3', color: 'bg-emerald-500' },
];

export default function CharacterCreation() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', gender: 'Male', portrait: 'p1' });
  const { awaken } = usePlayerStore();
  const { setPhase } = useGameStore();

  const handleWakeUp = () => {
    awaken(formData.name, formData.gender as any, formData.portrait);
    setPhase('TUTORIAL_INTRO');
  };

  // ... (Copy the JSX for the creation window here) ...
  // ... (Replace 'handleNext' logic etc.) ...

  return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center p-4 font-mono overflow-hidden relative">
      <div className="fixed inset-0 scanline-overlay pointer-events-none" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="system-window max-w-md w-full p-6 space-y-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-system-cyan/30 pb-4">
          <div className="flex items-center gap-2 text-system-cyan">
            <Terminal size={20} className="animate-pulse" />
            <h1 className="text-xl font-bold tracking-widest uppercase">System Initialization</h1>
          </div>
          <span className="text-xs text-system-cyan/50 italic">v1.0.4</span>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0: NAME */}
          {step === 0 && (
            <motion.div key="s0" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
              <p className="text-xs text-system-cyan/60 uppercase tracking-wider">Input Vessel Designation</p>
              <input
                autoFocus
                className="w-full bg-system-cyan/5 border border-system-cyan/30 p-4 text-lg text-system-cyan outline-none focus:border-system-cyan transition-all placeholder:text-system-cyan/20"
                placeholder="ENTER NAME..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <button
                disabled={!formData.name}
                onClick={() => setStep(1)}
                className="system-button-cyan w-full flex justify-center gap-2 py-4 bg-system-cyan text-black font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
              >
                Next <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 1: GENDER & PORTRAIT */}
          {step === 1 && (
            <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
              <div className="flex items-center gap-2 text-system-cyan border-b border-system-cyan/20 pb-2">
                <User size={18} /> <h2 className="uppercase font-bold tracking-widest">Physical Vessel</h2>
              </div>

              <div className="flex gap-2">
                {['Male', 'Female'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setFormData({ ...formData, gender: g as any })}
                    className={`flex-1 py-3 border transition-all uppercase text-sm font-bold ${formData.gender === g ? 'border-system-cyan bg-system-cyan/20 text-system-cyan shadow-[0_0_10px_rgba(0,242,255,0.2)]' : 'border-gray-700 text-gray-500 hover:border-gray-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 justify-center py-4">
                {PORTRAITS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setFormData({ ...formData, portrait: p.id })}
                    className={`w-16 h-16 border-2 cursor-pointer transition-all rounded-sm ${formData.portrait === p.id ? 'border-system-cyan scale-110 shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'border-transparent grayscale opacity-50 hover:opacity-100'}`}
                  >
                    <div className={`w-full h-full ${p.color}`} />
                  </div>
                ))}
              </div>

              <button onClick={() => setStep(2)} className="w-full py-4 bg-system-cyan text-black font-bold uppercase tracking-widest hover:brightness-110">
                Confirm Data
              </button>
            </motion.div>
          )}

          {/* STEP 2: FORCED BOOT */}
          {step === 2 && (
            <motion.div key="s2" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8 py-6">
              <div className="relative inline-block">
                <Sparkles className="text-yellow-400 animate-spin-slow relative z-10" size={64} />
                <div className="absolute inset-0 blur-xl bg-yellow-400/30" />
              </div>

              <div className="space-y-2 border-y border-system-cyan/20 py-4">
                <h2 className="text-xl font-black text-system-cyan italic tracking-tight">DATA CORRUPTED</h2>
                <p className="text-xs text-blue-100/60 uppercase tracking-widest">Attempting emergency synchronization...</p>
              </div>

              <button
                onClick={handleWakeUp}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_20px_white] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]"
              >
                Forced Boot
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
