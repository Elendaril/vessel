import { useGameStore } from './store/useGameStore';
import CharacterCreation from './screens/CharacterCreation';
import TutorialIntro from './screens/TutorialIntro';
import CombatView from './components/game/CombatView';
import DungeonView from './components/game/DungeonView';
import './App.css';

export default function App() {
  const phase = useGameStore((state) => state.phase);

  return (
    <>
      {/* Global Effects (Sound, key listeners) can go here */}

      {phase === 'CREATION' && <CharacterCreation />}

      {phase === 'TUTORIAL_INTRO' && <TutorialIntro />}
      {phase === 'DUNGEON' && (
        // CHANGE 'min-h-screen' TO 'h-screen'
        <div className="h-screen bg-[#0a0e14] text-white relative overflow-hidden flex flex-col">
          <DungeonView />
        </div>
      )}

      {phase === 'COMBAT' && (
        <div className="min-h-screen bg-[#0a0e14] text-white relative overflow-hidden flex flex-col">
          <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-30" />
          <CombatView />
        </div>
      )}

      {/* Future Phases */}
      {phase === 'HUB' && <div>Hub Screen Placeholder</div>}
    </>
  );
}
