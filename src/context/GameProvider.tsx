import React, { createContext, useContext, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

type GameContextType = {
  children: React.ReactNode;
};

export const GameContext = createContext<null>(null);

const GameProvider: React.FC<GameContextType> = ({ children }) => {
  const { initGame } = useGameStore();
  
  useEffect(() => {
    // Initialize game on mount
    initGame();
  }, [initGame]);
  
  return (
    <GameContext.Provider value={null}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;