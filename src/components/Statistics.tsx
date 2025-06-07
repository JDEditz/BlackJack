import React from 'react';
import { Trophy, CircleDollarSign, BarChart3, BadgePercent } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/gameUtils';

const Statistics: React.FC = () => {
  const { gameState } = useGameStore();
  const { statistics } = gameState;
  
  const winRate = statistics.gamesPlayed > 0 
    ? Math.round(((statistics.wins + statistics.blackjacks) / statistics.gamesPlayed) * 100) 
    : 0;
  
  const blackjackRate = statistics.gamesPlayed > 0 
    ? Math.round((statistics.blackjacks / statistics.gamesPlayed) * 100) 
    : 0;
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-table-accent" />
        Statistics
      </h2>
      
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-md p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-sm">Win Rate</span>
            <span className="text-white font-medium">{winRate}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500" 
              style={{ width: `${winRate}%` }}
            ></div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-md p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-400 text-sm">BlackJack Rate</span>
            <span className="text-white font-medium">{blackjackRate}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500" 
              style={{ width: `${blackjackRate}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-800 rounded-md p-3 flex flex-col items-center justify-center">
            <CircleDollarSign className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-gray-400 text-xs">Max Balance</span>
            <span className="text-white font-medium text-sm">{formatMoney(statistics.maxBalance)}</span>
          </div>
          
          <div className="bg-gray-800 rounded-md p-3 flex flex-col items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-gray-400 text-xs">Total Wins</span>
            <span className="text-white font-medium text-sm">{statistics.wins + statistics.blackjacks}</span>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-md p-3">
          <div className="flex justify-between text-sm">
            <div className="text-center">
              <div className="text-white font-medium">{statistics.gamesPlayed}</div>
              <div className="text-gray-400 text-xs">Games</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{statistics.blackjacks}</div>
              <div className="text-gray-400 text-xs">Blackjacks</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{statistics.pushes}</div>
              <div className="text-gray-400 text-xs">Pushes</div>
            </div>
            <div className="text-center">
              <div className="text-white font-medium">{statistics.losses}</div>
              <div className="text-gray-400 text-xs">Losses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;