export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
  hidden?: boolean;
}

export interface Player {
  name: string;
  hand: Card[];
  score: number;
  bust: boolean;
  blackjack: boolean;
}

export type GamePhase = 'betting' | 'dealing' | 'player-turn' | 'dealer-turn' | 'game-over';
export type GameResult = 'win' | 'lose' | 'push' | 'blackjack' | null;

export interface GameState {
  phase: GamePhase;
  deck: Card[];
  player: Player;
  dealer: Player;
  currentBet: number;
  playerBalance: number;
  result: GameResult;
  canDoubleDown: boolean;
  message: string;
  statistics: GameStatistics;
}

export interface GameStatistics {
  gamesPlayed: number;
  wins: number;
  losses: number;
  pushes: number;
  blackjacks: number;
  maxBalance: number;
}