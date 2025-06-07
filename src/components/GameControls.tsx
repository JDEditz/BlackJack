import React from 'react';
import { useGameStore } from '../store/gameStore';

const GameControls: React.FC = () => {
  const { gameState, hitCard, stand, doubleDown, resetGame } = useGameStore();
  const { phase, canDoubleDown, playerBalance, currentBet } = gameState;
  
  const isPlayerTurn = phase === 'player-turn';
  const isGameOver = phase === 'game-over';
  const canDouble = canDoubleDown && playerBalance >= currentBet;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        className={`btn ${isPlayerTurn ? 'btn-primary' : 'btn-disabled'}`}
        onClick={hitCard}
        disabled={!isPlayerTurn}
      >
        Hit
      </button>
      <button
        className={`btn ${isPlayerTurn ? 'btn-primary' : 'btn-disabled'}`}
        onClick={stand}
        disabled={!isPlayerTurn}
      >
        Stand
      </button>
      <button
        className={`btn ${canDouble && isPlayerTurn ? 'btn-primary' : 'btn-disabled'}`}
        onClick={doubleDown}
        disabled={!canDouble || !isPlayerTurn}
      >
        Double Down
      </button>
      {isGameOver && (
        <button
          className="btn btn-success"
          onClick={resetGame}
        >
          New Game
        </button>
      )}
    </div>
  );
};

export default GameControls;