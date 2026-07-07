import { createContext, useContext } from 'react';

export interface GameStats {
  bestScore: number | string;
  avgScore: number | string;
  accuracy: number | string;
}

interface GameContextType {
  gameId: string | null;
  stats: GameStats;
}

export const GameContext = createContext<GameContextType>({
  gameId: null,
  stats: { bestScore: 0, avgScore: 0, accuracy: '0%' }
});

export const useGameContext = () => useContext(GameContext);
