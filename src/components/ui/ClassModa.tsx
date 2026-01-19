import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { X, ShieldAlert, ChevronRight } from 'lucide-react';

interface ClassModalProps {
  selectedClass: any;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClassModal({ selectedClass, onClose, onConfirm }: ClassModalProps) {
  const chartData = Object.entries(selectedClass.stats).map(([key, value]) => ({
    subject: key.toUpperCase(),
    value: value as number,
    fullMark: 10,
  }));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="system-window relative max-w-2xl w-full p-8 border-t-4 border-t-system-cyan shadow-[0_0_50px_rgba(0,242,255,0.15)]"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 border-b border-system-cyan/20 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-system-cyan animate-ping rounded-full" />
              <h2 className="text-3xl font-black text-system-cyan italic tracking-tighter uppercase">{selectedClass.name}</h2>
            </div>
            <p className="text-xs text-system-cyan/50 tracking-[0.4em] mt-1">MODULE: ARCHETYPE_ANALYSIS</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} className="text-system-cyan" />
          </button>
        </div>

        {/* Content Section: Larger and more spacious */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Chart */}
          <div className="space-y-4">
            <h3 className="text-[10px] text-system-cyan font-bold tracking-widest uppercase opacity-50 text-center">Stat Distribution Matrix</h3>
            <div className="h-64 w-full bg-system-cyan/5 rounded-sm border border-system-cyan/10 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#00f2ff22" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#00f2ff', fontSize: 11, fontWeight: 'bold' }} />
                  <Radar name={selectedClass.name} dataKey="value" stroke="#00f2ff" fill="#00f2ff" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-system-cyan underline decoration-system-cyan/30">Background</h4>
                <p className="text-sm text-blue-100 leading-relaxed">
                  Analysis suggests high compatibility with this vessel. The {selectedClass.name} path prioritizes
                  <span className="text-system-cyan"> optimization of the core circuit</span>.
                </p>
              </div>

              <div className="bg-red-500/5 border border-red-500/20 p-4 relative overflow-hidden">
                {/* Decorative background icon */}
                <ShieldAlert className="absolute -right-2 -bottom-2 text-red-500/10" size={64} />

                <div className="flex items-center gap-2 text-red-500 mb-2 font-bold text-xs uppercase tracking-tighter">Unique Trait: Awakened Will</div>
                <p className="text-[12px] text-red-100/80 relative z-10">Grants a permanent 10% reduction in Recoil Damage when using forbidden skills.</p>
              </div>
            </div>

            <button
              onClick={onConfirm}
              className="mt-8 py-4 bg-system-cyan text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-all group flex items-center justify-center gap-3"
            >
              Sync Archetype
              <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
