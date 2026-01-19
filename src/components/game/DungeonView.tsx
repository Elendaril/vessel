import { motion } from 'framer-motion';
import { MapPin, Skull, Gem, DoorOpen, Footprints } from 'lucide-react';
import { useDungeonStore } from '../../store/useDungeonStore';
import { useGameStore } from '../../store/useGameStore';
import { type DungeonRoom } from '../../types/dungeon';

export default function DungeonView() {
  const { floor, moveToRoom } = useDungeonStore();
  const { setPhase } = useGameStore();

  if (!floor) return <div className="p-10 text-white">Loading Map Data...</div>;

  const currentRoom = floor.rooms[floor.currentRoomId];

  // Helper to render icons
  const getIcon = (type: string) => {
    switch (type) {
      case 'COMBAT':
        return <Skull size={20} />;
      case 'BOSS':
        return <Skull size={28} className="text-red-500" />;
      case 'TREASURE':
        return <Gem size={20} className="text-yellow-400" />;
      case 'ENTRANCE':
        return <DoorOpen size={20} />;
      default:
        return <MapPin size={20} />;
    }
  };

  const handleEnterRoom = () => {
    // If it's a combat room and not cleared, start fight
    if (currentRoom.type === 'COMBAT' && !currentRoom.isCleared) {
      // We would set specific enemy here based on room.contents
      setPhase('COMBAT');
    }
    // If it's empty/cleared, maybe show description or loot
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-[#0a0e14] overflow-hidden">
      {/* 1. Header Info */}
      <div className="absolute top-0 left-0 w-full p-4 z-20 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-system-cyan font-bold tracking-[0.2em] uppercase">{floor.name}</h2>
        <p className="text-xs text-blue-200 opacity-70">Current Location: {currentRoom.name}</p>
      </div>

      {/* 2. The Map Container */}
      <div className="flex-1 relative mt-10">
        {/* Draw Connections (Lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          {Object.values(floor.rooms).map((room) =>
            room.connections.map((targetId) => {
              const target = floor.rooms[targetId];
              if (!room.isVisible || !target.isVisible) return null;

              return (
                <line
                  key={`${room.id}-${target.id}`}
                  x1={`${room.x}%`}
                  y1={`${room.y}%`}
                  x2={`${target.x}%`}
                  y2={`${target.y}%`}
                  stroke={room.isCleared ? '#00f2ff' : '#4b5563'}
                  strokeWidth="2"
                  strokeDasharray={room.isCleared ? '0' : '5,5'}
                />
              );
            }),
          )}
        </svg>

        {/* Draw Nodes */}
        {Object.values(floor.rooms).map((room) => {
          if (!room.isVisible) return null;

          const isCurrent = room.id === floor.currentRoomId;
          const isReachable = currentRoom.connections.includes(room.id);

          return (
            <motion.div
              key={room.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all z-10
                ${isCurrent ? 'border-system-cyan bg-system-cyan/20 shadow-[0_0_20px_#00f2ff]' : ''}
                ${isReachable ? 'border-white bg-white/10 hover:bg-white/20' : 'border-gray-700 bg-gray-900 opacity-50'}
                ${room.isCleared ? 'grayscale opacity-50' : ''}
              `}
              style={{ left: `${room.x}%`, top: `${room.y}%` }}
              onClick={() => isReachable && moveToRoom(room.id)}
            >
              {getIcon(room.type)}

              {/* "You are here" indicator */}
              {isCurrent && (
                <motion.div layoutId="player-marker" className="absolute -top-6 text-system-cyan">
                  <Footprints size={20} className="animate-bounce" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* 3. Action Panel */}
      <div className="h-1/3 system-window border-t-2 border-t-system-cyan bg-black/90 p-6 z-20">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl text-system-cyan font-bold mb-2">{currentRoom.name}</h3>
            <p className="text-blue-100 text-sm leading-relaxed max-w-md">{currentRoom.description}</p>
            <div className="mt-4 flex gap-2">
              {currentRoom.isCleared && <span className="text-xs bg-green-900/50 text-green-400 px-2 py-1 rounded">CLEARED</span>}
              {currentRoom.type === 'COMBAT' && !currentRoom.isCleared && <span className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded">HOSTILE</span>}
            </div>
          </div>

          <div className="space-y-2">
            {currentRoom.type === 'COMBAT' && !currentRoom.isCleared ? (
              <button onClick={handleEnterRoom} className="px-8 py-3 bg-red-600 text-white font-bold uppercase tracking-widest hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                Engage
              </button>
            ) : (
              <button disabled className="px-8 py-3 border border-gray-700 text-gray-500 uppercase tracking-widest">
                Area Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
