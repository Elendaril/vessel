import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from './store/usePlayerStore';
import { Terminal, ChevronRight, User, Shield, Sparkles, X, ShieldAlert } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import './App.css'; // Ensure your Tailwind setup is here

// --- CONSTANTS ---
const CLASSES = [
  {
    id: 'vanguard',
    name: 'Vanguard',
    description: 'A frontline warrior with an iron body, capable of withstanding immense recoil.',
    stats: { str: 8, vit: 10, int: 2, agi: 4, dex: 4, luk: 3, wil: 6, sen: 3 },
  },
  {
    id: 'arcane',
    name: 'Arcane Seeker',
    description: 'A master of mana circulation. Fragile, but capable of devastating area destruction.',
    stats: { str: 2, vit: 4, int: 10, agi: 5, dex: 6, luk: 3, wil: 8, sen: 5 },
  },
  {
    id: 'shadow',
    name: 'Shadow Agent',
    description: 'A speedster who exploits the turn-based laws of the System to strike twice.',
    stats: { str: 5, vit: 3, int: 3, agi: 10, dex: 8, luk: 6, wil: 3, sen: 7 },
  },
];

// Placeholder portraits - you can replace src later
const PORTRAITS = [
  { id: 'p1', color: 'bg-red-500' },
  { id: 'p2', color: 'bg-blue-500' },
  { id: 'p3', color: 'bg-emerald-500' },
];

// --- COMPONENTS ---

// 1. The Full-Screen Class Modal
const ClassModal = ({ selectedClass, onClose, onConfirm }: any) => {
  const chartData = Object.entries(selectedClass.stats).map(([key, value]) => ({
    subject: key.toUpperCase(),
    value: value as number,
    fullMark: 10,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        className="system-window relative max-w-2xl w-full p-6 md:p-8 border-t-4 border-t-system-cyan shadow-[0_0_50px_rgba(0,242,255,0.15)] bg-[#0a0e14]"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b border-system-cyan/20 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-system-cyan animate-ping rounded-full" />
              <h2 className="text-2xl md:text-3xl font-black text-system-cyan italic tracking-tighter uppercase">{selectedClass.name}</h2>
            </div>
            <p className="text-xs text-system-cyan/50 tracking-[0.4em] mt-1">MODULE: ARCHETYPE_ANALYSIS</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Chart */}
          <div className="space-y-2">
            <div className="h-64 w-full bg-system-cyan/5 rounded-sm border border-system-cyan/10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#00f2ff22" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#00f2ff', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar name={selectedClass.name} dataKey="value" stroke="#00f2ff" fill="#00f2ff" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-system-cyan underline decoration-system-cyan/30">Archetype Data</h4>
                <p className="text-sm text-blue-100 leading-relaxed opacity-90">{selectedClass.description}</p>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-4 relative overflow-hidden rounded">
                <ShieldAlert className="absolute -right-2 -bottom-2 text-red-500/10" size={64} />
                <div className="flex items-center gap-2 text-red-400 mb-2 font-bold text-xs uppercase tracking-tighter">Unique Trait: Awakened Will</div>
                <p className="text-[11px] text-red-200/80 relative z-10">System analysis indicates high potential for [Skill Fusion] within this class path.</p>
              </div>
            </div>

            <button
              onClick={onConfirm}
              className="mt-6 md:mt-0 w-full py-4 bg-system-cyan text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all group flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(0,242,255,0.4)]"
            >
              Sync Archetype
              <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ name: '', gender: 'Male', portrait: 'p1', classId: '' });
  const [previewClass, setPreviewClass] = useState<any>(null);

  const { isAwakened, awaken, name, classTitle } = usePlayerStore();

  const handleNext = () => setStep((s) => s + 1);

  const finishAwakening = () => {
    const selectedClass = CLASSES.find((c) => c.id === formData.classId)!;
    awaken({
      name: formData.name,
      gender: formData.gender as any,
      portrait: formData.portrait,
      classTitle: selectedClass.name,
      stats: selectedClass.stats,
    });
  };

  // --- RENDERING ---

  // 1. If Awakened -> Show Dashboard (Placeholder for now)
  if (isAwakened) {
    return (
      <div className="min-h-screen bg-[#06090f] flex items-center justify-center font-mono relative">
        <div className="fixed inset-0 scanline-overlay pointer-events-none" />
        <div className="text-center space-y-4 p-10 border border-system-cyan/30 bg-black/50 backdrop-blur-md rounded-lg">
          <div className="text-system-cyan text-4xl font-black animate-pulse">SYSTEM ONLINE</div>
          <div className="text-blue-200">
            Welcome, <span className="text-yellow-400 font-bold">{name}</span>.
            <br />
            Class: <span className="text-system-cyan">{classTitle}</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. Awakening / Registration Flow
  return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center p-4 font-mono overflow-hidden relative">
      <div className="fixed inset-0 scanline-overlay pointer-events-none" />

      {/* Main Registration Window */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="system-window max-w-md w-full p-6 space-y-6 z-10">
        {/* Progress Bar */}
        <div className="flex gap-1 h-1 w-full">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`flex-1 transition-colors duration-500 ${step >= i ? 'bg-system-cyan shadow-[0_0_10px_#00f2ff]' : 'bg-gray-800'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 0: NAME */}
          {step === 0 && (
            <motion.div key="s0" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
              <div className="flex items-center gap-2 text-system-cyan border-b border-system-cyan/20 pb-2">
                <Terminal size={18} /> <h2 className="uppercase font-bold tracking-widest">Registration</h2>
              </div>
              <div>
                <p className="text-xs text-system-cyan/60 mb-2 uppercase tracking-wider">Input Vessel Designation</p>
                <input
                  autoFocus
                  className="w-full bg-system-cyan/5 border border-system-cyan/30 p-4 text-lg text-system-cyan outline-none focus:border-system-cyan focus:shadow-[inset_0_0_20px_rgba(0,242,255,0.1)] transition-all placeholder:text-system-cyan/20"
                  placeholder="ENTER NAME..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <button
                disabled={!formData.name}
                onClick={handleNext}
                className="system-button-cyan w-full flex justify-center gap-2 py-4 bg-system-cyan text-black font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
              >
                Continue <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 1: GENDER & PORTRAIT */}
          {step === 1 && (
            <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
              <div className="flex items-center gap-2 text-system-cyan border-b border-system-cyan/20 pb-2">
                <User size={18} /> <h2 className="uppercase font-bold tracking-widest">Physical Vessel</h2>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-system-cyan/60 uppercase tracking-wider">Biometric Type</p>
                <div className="flex gap-2">
                  {['Male', 'Female'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setFormData({ ...formData, gender: g })}
                      className={`flex-1 py-3 border transition-all uppercase text-sm font-bold ${
                        formData.gender === g ? 'border-system-cyan bg-system-cyan/20 text-system-cyan shadow-[0_0_10px_rgba(0,242,255,0.2)]' : 'border-gray-700 text-gray-500 hover:border-gray-500'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-system-cyan/60 uppercase tracking-wider">Visual Manifestation</p>
                <div className="flex gap-4 justify-center">
                  {PORTRAITS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setFormData({ ...formData, portrait: p.id })}
                      className={`w-16 h-16 border-2 cursor-pointer transition-all rounded-sm ${
                        formData.portrait === p.id ? 'border-system-cyan scale-110 shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'border-transparent grayscale opacity-50 hover:opacity-100'
                      }`}
                    >
                      {/* Placeholder for actual image */}
                      <div className={`w-full h-full ${p.color}`} />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleNext} className="mt-4 w-full py-4 bg-system-cyan text-black font-bold uppercase tracking-widest hover:brightness-110">
                Confirm Data
              </button>
            </motion.div>
          )}

          {/* STEP 2: CLASS SELECTION */}
          {step === 2 && (
            <motion.div key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <div className="flex items-center gap-2 text-system-cyan border-b border-system-cyan/20 pb-2">
                <Shield size={18} /> <h2 className="uppercase font-bold tracking-widest">Archetype Sync</h2>
              </div>
              <p className="text-xs text-blue-100/70">Select a combat protocol to initialize stats.</p>

              <div className="space-y-2 pr-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                {CLASSES.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setPreviewClass(c)}
                    className={`p-4 border cursor-pointer transition-all group ${
                      formData.classId === c.id ? 'border-system-cyan bg-system-cyan/10' : 'border-gray-800 hover:border-system-cyan/50 hover:bg-gray-900'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-sm tracking-wider ${formData.classId === c.id ? 'text-system-cyan' : 'text-gray-300 group-hover:text-white'}`}>{c.name}</span>
                      <ChevronRight size={14} className="text-gray-600 group-hover:text-system-cyan" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: FINAL AWAKENING */}
          {step === 3 && (
            <motion.div key="s3" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-8 py-6">
              <div className="relative inline-block">
                <Sparkles className="text-yellow-400 animate-spin-slow relative z-10" size={64} />
                <div className="absolute inset-0 blur-xl bg-yellow-400/30" />
              </div>

              <div className="space-y-2 border-y border-system-cyan/20 py-4">
                <h2 className="text-2xl font-black text-system-cyan italic tracking-tight">SYNCHRONIZATION COMPLETE</h2>
                <div className="text-xs text-blue-100/60 uppercase tracking-widest flex flex-col gap-1">
                  <span>
                    Vessel: <span className="text-white">{formData.name}</span>
                  </span>
                  <span>
                    Class: <span className="text-white">{CLASSES.find((c) => c.id === formData.classId)?.name}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={finishAwakening}
                className="w-full py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-system-cyan hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] transition-all duration-300"
              >
                Wake Up
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* --- MODAL PORTAL (Outside the main window) --- */}
      <AnimatePresence>
        {previewClass && (
          <ClassModal
            selectedClass={previewClass}
            onClose={() => setPreviewClass(null)}
            onConfirm={() => {
              setFormData({ ...formData, classId: previewClass.id });
              setPreviewClass(null);
              setStep(3); // Jump to final step
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
