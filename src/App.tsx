import React from 'react';
import { AnimatePresence } from 'framer-motion';
import GameTable from './components/GameTable';
import Header from './components/Header';
import GameProvider from './context/GameProvider';
import GameControls from './components/GameControls';
import BettingControls from './components/BettingControls';
import GameStatus from './components/GameStatus';
import Statistics from './components/Statistics';
import { useGameStore } from './store/gameStore';

function App() {
  const { gameState } = useGameStore();
  
  return (
    <GameProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <GameTable />
                <GameStatus />
                <div className="mt-4">
                  <GameControls />
                  <BettingControls />
                </div>
              </div>
              <div className="lg:col-span-1">
                <Statistics />
              </div>
            </div>
          </div>
        </main>
        <footer className="py-4 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} BlackJack. All rights reserved.</p>
        </footer>
      </div>
    </GameProvider>
  );
}

export default App;