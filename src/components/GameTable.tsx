import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';
import { useGameStore } from '../store/gameStore';

const GameTable: React.FC = () => {
  const { gameState } = useGameStore();
  const { player, dealer, phase } = gameState;
  
  const isGameActive = phase !== 'betting';
  
  return (
    <div className="relative w-full table-felt rounded-xl p-4 sm:p-8 min-h-[400px] shadow-lg overflow-hidden border-4 border-[#a67c52]">
      {/* Dealer Area */}
      <div className="mb-12">
        <div className="flex items-center mb-2">
          <h2 className="text-white text-lg font-semibold mr-2">Dealer</h2>
          {isGameActive && (
            <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
              Score: {dealer.score}
            </div>
          )}
        </div>
        <div className="flex pl-4">
          {dealer.hand.length > 0 ? (
            dealer.hand.map((card, index) => (
              <Card key={`dealer-${index}`} card={card} index={index} isDealer={true} />
            ))
          ) : (
            <div className="w-[90px] h-[130px] border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center text-gray-400">
              No cards
            </div>
          )}
        </div>
      </div>
      
      {/* Center Area / Game Status */}
      <motion.div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-black bg-opacity-70 px-4 py-2 rounded-full shadow-lg">
          <p className="text-white text-center text-sm md:text-base font-medium">
            {gameState.message}
          </p>
        </div>
      </motion.div>
      
      {/* Player Area */}
      <div className="mt-12">
        <div className="flex items-center mb-2">
          <h2 className="text-white text-lg font-semibold mr-2">Player</h2>
          {isGameActive && (
            <div className="bg-gray-800 text-white text-sm px-2 py-1 rounded">
              Score: {player.score}
            </div>
          )}
        </div>
        <div className="flex pl-4">
          {player.hand.length > 0 ? (
            player.hand.map((card, index) => (
              <Card key={`player-${index}`} card={card} index={index} />
            ))
          ) : (
            <div className="w-[90px] h-[130px] border-2 border-dashed border-gray-500 rounded-md flex items-center justify-center text-gray-400">
              No cards
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameTable;