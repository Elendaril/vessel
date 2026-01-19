import { create } from 'zustand';
import { type DungeonFloor, type DungeonRoom } from '../types/dungeon';

interface DungeonState {
  floor: DungeonFloor | null;

  // Actions
  generateTutorialDungeon: () => void;
  moveToRoom: (roomId: string) => void;
  completeRoom: () => void;
}

export const useDungeonStore = create<DungeonState>((set, get) => ({
  floor: null,

  generateTutorialDungeon: () => {
    // Hardcoded simple linear dungeon for now
    // Entrance -> Combat -> Treasure -> Boss

    const rooms: Record<string, DungeonRoom> = {
      room_start: {
        id: 'room_start',
        type: 'ENTRANCE',
        name: 'Cave Entrance',
        description: 'The light from above is fading.',
        connections: ['room_combat_1'],
        x: 50,
        y: 80,
        isCleared: true,
        isVisible: true,
      },
      room_elite_1: {
        // New Side Room
        id: 'room_elite_1',
        type: 'COMBAT', // We can add 'ELITE' type later
        name: 'Wolf Den',
        description: 'A massive Wolf guards a pile of bones.',
        // BACKTRACKING: Must connect back to the Fork
        connections: ['room_combat_1'],
        x: 20,
        y: 55, // To the left
        isCleared: false,
        isVisible: false,
        contents: { enemyId: 'wolf_elite' },
      },
      room_combat_1: {
        id: 'room_combat_1',
        type: 'COMBAT',
        name: 'Rat Nest',
        description: 'You hear squeaking in the shadows.',
        connections: ['room_start', 'room_chest_1', 'room_elite_1'],
        x: 25,
        y: 55,
        isCleared: false,
        isVisible: true,
        contents: { enemyId: 'rat_sewer' },
      },
      room_chest_1: {
        id: 'room_chest_1',
        type: 'TREASURE',
        name: 'Hidden Stash',
        description: 'An old adventurer left this behind.',
        connections: ['room_combat_1', 'room_boss'],
        x: 80,
        y: 55,
        isCleared: false,
        isVisible: false, // Hidden until you reach previous room
      },
      room_boss: {
        id: 'room_boss',
        type: 'BOSS',
        name: 'Slime King',
        description: 'A massive gelatinous cube blocks the exit.',
        connections: ['room_chest_1'],
        x: 50,
        y: 20,
        isCleared: false,
        isVisible: false,
        contents: { enemyId: 'slime_boss' },
      },
    };

    set({
      floor: {
        id: 'tutorial_f1',
        name: 'Tutorial Dungeon',
        rooms,
        currentRoomId: 'room_start',
      },
    });
  },

  moveToRoom: (roomId) => {
    const { floor } = get();
    if (!floor) return;

    // Validate connection
    const currentRoom = floor.rooms[floor.currentRoomId];
    if (!currentRoom.connections.includes(roomId)) return;

    // Logic to reveal next rooms would go here
    const nextRoom = floor.rooms[roomId];

    // Reveal connected rooms
    const updatedRooms = { ...floor.rooms };
    nextRoom.connections.forEach((connId) => {
      updatedRooms[connId].isVisible = true;
    });

    set({
      floor: {
        ...floor,
        rooms: updatedRooms,
        currentRoomId: roomId,
      },
    });
  },

  completeRoom: () => {
    const { floor } = get();
    if (!floor) return;

    const updatedRooms = { ...floor.rooms };
    updatedRooms[floor.currentRoomId].isCleared = true;

    set({
      floor: { ...floor, rooms: updatedRooms },
    });
  },
}));
