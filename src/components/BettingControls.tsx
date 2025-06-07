import React from 'react';
import { useGameStore } from '../store/gameStore';
import { formatMoney } from '../utils/gameUtils';

const CHIP_VALUES = [5, 25, 100, 500];

interface ChipProps {
  value: number;
  onClick: () => void;
  disabled: boolean;
}

const Chip: React.FC<ChipProps> = ({ value, onClick, disabled }) => {
  let chipClass = 'chip ';
  
  if (value === 5) chipClass += 'chip-white';
  else if (value === 25) chipClass += 'chip-red';
  else if (value === 100) chipClass += 'chip-blue';
  else if (value === 500) chipClass += 'chip-black';
  
  return (
    <button
      className={`${chipClass} w-16 h-16 text-sm font-bold ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 transition-transform'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {formatMoney(value)}
    </button>
  );
};

const BettingControls: React.FC = () => {
  const { gameState, placeBet } = useGameStore();
  const { phase, playerBalance } = gameState;
  
  const isBettingPhase = phase === 'betting';
  
  const [currentBet, setCurrentBet] = React.useState<number>(0);
  
  const handleChipClick = (value: number) => {
    setCurrentBet(prev => prev + value);
  };
  
  const handleClearBet = () => {
    setCurrentBet(0);
  };
  
  const handlePlaceBet = () => {
    if (currentBet > 0) {
      placeBet(currentBet);
      setCurrentBet(0);
    }
  };
  
  if (!isBettingPhase) {
    return null;
  }
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 shadow-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-white">Place Your Bet</h3>
          <div className="text-yellow-400 font-bold text-xl">
            {formatMoney(currentBet)}
          </div>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400" 
            style={{ width: `${Math.min(100, (currentBet / playerBalance) * 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {CHIP_VALUES.map(value => (
          <Chip 
            key={value} 
            value={value} 
            onClick={() => handleChipClick(value)}
            disabled={value > playerBalance - currentBet}
          />
        ))}
      </div>
      
      <div className="flex gap-2">
        <button 
          className="btn btn-secondary flex-1"
          onClick={handleClearBet}
          disabled={currentBet === 0}
        >
          Clear
        </button>
        <button 
          className={`btn flex-1 ${currentBet > 0 ? 'btn-success' : 'btn-disabled'}`}
          onClick={handlePlaceBet}
          disabled={currentBet === 0}
        >
          Deal
        </button>
      </div>
    </div>
  );
};

export default BettingControls;