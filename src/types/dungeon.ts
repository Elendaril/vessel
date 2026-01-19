export type RoomType = 'ENTRANCE' | 'COMBAT' | 'ELITE' | 'BOSS' | 'TREASURE' | 'REST' | 'EXIT';

export interface DungeonRoom {
  id: string;
  type: RoomType;
  name: string; // e.g., "Damp Corridor"
  description: string;
  connections: string[]; // IDs of rooms you can go to from here
  x: number; // For visual positioning (0-100)
  y: number; // For visual positioning (0-100)
  isCleared: boolean;
  isVisible: boolean; // "Fog of War"
  contents?: {
    enemyId?: string; // If combat
    lootId?: string; // If treasure
  };
}

export interface DungeonFloor {
  id: string;
  name: string; // e.g. "Tutorial Cave: Floor 1"
  rooms: Record<string, DungeonRoom>;
  currentRoomId: string;
}
