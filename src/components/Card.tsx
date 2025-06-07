import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../types';
import { getCardColor, getSuitSymbol } from '../utils/gameUtils';

interface CardProps {
  card: CardType;
  index: number;
  isDealer?: boolean;
}

const Card: React.FC<CardProps> = ({ card, index, isDealer = false }) => {
  const { suit, rank, hidden } = card;
  
  if (hidden) {
    return (
      <motion.div 
        className="relative w-[70px] h-[100px] sm:w-[90px] sm:h-[130px] card-shadow rounded-md overflow-hidden mx-[-10px] first:ml-0"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-blue-900 border-2 border-white flex items-center justify-center">
          <div className="w-[80%] h-[80%] rounded bg-blue-800 flex items-center justify-center">
            <div className="text-white font-bold text-lg">♠♥♣♦</div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  const colorClass = getCardColor(suit);
  const symbol = getSuitSymbol(suit);
  
  return (
    <motion.div 
      className="relative w-[70px] h-[100px] sm:w-[90px] sm:h-[130px] bg-white card-shadow rounded-md overflow-hidden mx-[-10px] first:ml-0"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2, duration: 0.3 }}
    >
      <div className="absolute inset-0 flex flex-col p-1 sm:p-2">
        <div className={`text-xs sm:text-sm font-bold ${colorClass}`}>
          {rank}
        </div>
        <div className={`text-xs sm:text-sm font-bold ${colorClass}`}>
          {symbol}
        </div>
        <div className={`flex-grow flex items-center justify-center ${colorClass}`}>
          <span className="text-xl sm:text-3xl font-bold">{symbol}</span>
        </div>
        <div className={`text-xs sm:text-sm font-bold rotate-180 ${colorClass}`}>
          {rank}
        </div>
        <div className={`text-xs sm:text-sm font-bold rotate-180 ${colorClass}`}>
          {symbol}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;