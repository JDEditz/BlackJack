import React from 'react';
import { Spade } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/gameUtils';

const Header: React.FC = () => {
  const { gameState } = useGameStore();
  
  return (
    <header className="bg-black py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Spade className="w-8 h-8 text-white mr-2" />
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-white">
            BlackJack
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-800 px-4 py-2 rounded-md">
            <span className="text-sm text-gray-400">Balance</span>
            <p className="text-lg font-medium text-white">
              {formatMoney(gameState.playerBalance)}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;