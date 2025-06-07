import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/gameUtils';

const GameStatus: React.FC = () => {
  const { gameState } = useGameStore();
  const { result, phase, currentBet } = gameState;
  
  if (phase !== 'game-over' || !result) {
    return null;
  }
  
  let statusColor = 'bg-gray-800';
  let winAmount = '';
  
  if (result === 'win') {
    statusColor = 'bg-green-700';
    winAmount = formatMoney(currentBet * 2);
  } else if (result === 'lose') {
    statusColor = 'bg-red-700';
    winAmount = formatMoney(0);
  } else if (result === 'push') {
    statusColor = 'bg-blue-700';
    winAmount = formatMoney(currentBet);
  } else if (result === 'blackjack') {
    statusColor = 'bg-purple-700';
    winAmount = formatMoney(currentBet * 2.5);
  }
  
  return (
    <AnimatePresence>
      <motion.div 
        className={`mt-4 ${statusColor} rounded-lg p-4 shadow-md text-white`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold mb-1">
              {result === 'win' && 'You Win!'}
              {result === 'lose' && 'You Lose'}
              {result === 'push' && 'Push'}
              {result === 'blackjack' && 'BlackJack!'}
            </h3>
            <p className="text-sm text-gray-200">
              Bet: {formatMoney(currentBet)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-200">Payout</p>
            <p className="text-xl font-bold">{winAmount}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameStatus;