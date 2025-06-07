import { create } from 'zustand';
import { GameState, Card, Suit, Rank, GameResult } from '../types';
import { createDeck, shuffleDeck, calculateScore } from '../utils/gameUtils';

const INITIAL_BALANCE = 1000;

const initialState: GameState = {
  phase: 'betting',
  deck: [],
  player: {
    name: 'Player',
    hand: [],
    score: 0,
    bust: false,
    blackjack: false,
  },
  dealer: {
    name: 'Dealer',
    hand: [],
    score: 0,
    bust: false,
    blackjack: false,
  },
  currentBet: 0,
  playerBalance: INITIAL_BALANCE,
  result: null,
  canDoubleDown: false,
  message: 'Place your bet to start',
  statistics: {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
    blackjacks: 0,
    maxBalance: INITIAL_BALANCE,
  },
};

export const useGameStore = create<{
  gameState: GameState;
  initGame: () => void;
  placeBet: (amount: number) => void;
  dealCards: () => void;
  hitCard: () => void;
  stand: () => void;
  doubleDown: () => void;
  resetGame: () => void;
}>((set, get) => ({
  gameState: { ...initialState },
  
  initGame: () => {
    const newDeck = shuffleDeck(createDeck());
    set((state) => ({
      gameState: {
        ...state.gameState,
        deck: newDeck,
        phase: 'betting',
        player: {
          ...initialState.player,
        },
        dealer: {
          ...initialState.dealer,
        },
        result: null,
        message: 'Place your bet to start',
      },
    }));
  },
  
  placeBet: (amount: number) => {
    const { gameState } = get();
    if (amount > gameState.playerBalance) return;
    
    set((state) => ({
      gameState: {
        ...state.gameState,
        currentBet: amount,
        playerBalance: state.gameState.playerBalance - amount,
        phase: 'dealing',
      },
    }));
    
    // Automatically deal cards after placing bet
    setTimeout(() => {
      get().dealCards();
    }, 500);
  },
  
  dealCards: () => {
    const { gameState } = get();
    const { deck } = gameState;
    
    if (deck.length < 4) {
      // Reshuffle if not enough cards
      const newDeck = shuffleDeck(createDeck());
      set((state) => ({
        gameState: {
          ...state.gameState,
          deck: newDeck,
        },
      }));
    }
    
    // Deal initial cards
    const playerCard1 = { ...deck[0] };
    const dealerCard1 = { ...deck[1], hidden: true };
    const playerCard2 = { ...deck[2] };
    const dealerCard2 = { ...deck[3] };
    
    const playerHand = [playerCard1, playerCard2];
    const dealerHand = [dealerCard1, dealerCard2];
    
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore([dealerCard2]); // Only show score for visible card
    
    const playerBlackjack = playerScore === 21;
    const canDoubleDown = playerScore >= 9 && playerScore <= 11;
    
    set((state) => ({
      gameState: {
        ...state.gameState,
        deck: deck.slice(4),
        player: {
          ...state.gameState.player,
          hand: playerHand,
          score: playerScore,
          blackjack: playerBlackjack,
        },
        dealer: {
          ...state.gameState.dealer,
          hand: dealerHand,
          score: dealerScore,
          blackjack: false, // We don't know yet
        },
        phase: playerBlackjack ? 'dealer-turn' : 'player-turn',
        canDoubleDown,
        message: playerBlackjack ? 'Blackjack! Waiting for dealer...' : 'Your turn',
      },
    }));
    
    // Automatically handle blackjack
    if (playerBlackjack) {
      setTimeout(() => {
        get().stand();
      }, 1000);
    }
  },
  
  hitCard: () => {
    const { gameState } = get();
    const { deck, player } = gameState;
    
    if (gameState.phase !== 'player-turn' || player.bust || player.blackjack) return;
    
    if (deck.length < 1) {
      // Reshuffle if not enough cards
      const newDeck = shuffleDeck(createDeck());
      set((state) => ({
        gameState: {
          ...state.gameState,
          deck: newDeck,
        },
      }));
    }
    
    const newCard = { ...deck[0] };
    const newHand = [...player.hand, newCard];
    const newScore = calculateScore(newHand);
    const bust = newScore > 21;
    
    set((state) => ({
      gameState: {
        ...state.gameState,
        deck: deck.slice(1),
        player: {
          ...state.gameState.player,
          hand: newHand,
          score: newScore,
          bust,
        },
        canDoubleDown: false,
        phase: bust ? 'game-over' : 'player-turn',
        message: bust ? 'Bust! You lose.' : 'Your turn',
      },
    }));
    
    // Handle bust
    if (bust) {
      setTimeout(() => {
        const { gameState } = get();
        set((state) => ({
          gameState: {
            ...state.gameState,
            result: 'lose',
            statistics: {
              ...state.gameState.statistics,
              gamesPlayed: state.gameState.statistics.gamesPlayed + 1,
              losses: state.gameState.statistics.losses + 1,
            },
          },
        }));
      }, 1000);
    }
  },
  
  stand: () => {
    const { gameState } = get();
    const { dealer, player, deck } = gameState;
    
    if (gameState.phase !== 'player-turn' && gameState.phase !== 'dealer-turn') return;
    
    // Reveal dealer's hidden card
    const revealedHand = dealer.hand.map(card => ({ ...card, hidden: false }));
    const revealedScore = calculateScore(revealedHand);
    const dealerBlackjack = revealedScore === 21 && revealedHand.length === 2;
    
    set((state) => ({
      gameState: {
        ...state.gameState,
        dealer: {
          ...state.gameState.dealer,
          hand: revealedHand,
          score: revealedScore,
          blackjack: dealerBlackjack,
        },
        phase: 'dealer-turn',
        message: 'Dealer\'s turn',
      },
    }));
    
    // Dealer draws cards until score is 17 or higher
    setTimeout(() => {
      let currentState = get().gameState;
      let currentDeck = [...currentState.deck];
      let currentDealerHand = [...currentState.dealer.hand];
      let currentDealerScore = currentState.dealer.score;
      let dealerBust = false;
      
      while (currentDealerScore < 17) {
        if (currentDeck.length < 1) {
          currentDeck = shuffleDeck(createDeck());
        }
        
        const newCard = { ...currentDeck[0], hidden: false };
        currentDeck = currentDeck.slice(1);
        currentDealerHand = [...currentDealerHand, newCard];
        currentDealerScore = calculateScore(currentDealerHand);
        dealerBust = currentDealerScore > 21;
        
        // Update state after each card (for animation purposes)
        set((state) => ({
          gameState: {
            ...state.gameState,
            deck: currentDeck,
            dealer: {
              ...state.gameState.dealer,
              hand: currentDealerHand,
              score: currentDealerScore,
              bust: dealerBust,
            },
          },
        }));
        
        if (dealerBust) break;
      }
      
      // Determine game result
      setTimeout(() => {
        const { gameState } = get();
        const { player, dealer, currentBet } = gameState;
        let result: GameResult = null;
        let winnings = 0;
        let message = '';
        
        if (player.blackjack && !dealer.blackjack) {
          result = 'blackjack';
          winnings = currentBet * 2.5; // Blackjack pays 3:2
          message = 'Blackjack! You win!';
        } else if (dealer.blackjack && !player.blackjack) {
          result = 'lose';
          message = 'Dealer has Blackjack. You lose.';
        } else if (player.blackjack && dealer.blackjack) {
          result = 'push';
          winnings = currentBet; // Return bet
          message = 'Both have Blackjack. Push.';
        } else if (player.bust) {
          result = 'lose';
          message = 'Bust! You lose.';
        } else if (dealer.bust) {
          result = 'win';
          winnings = currentBet * 2; // Double bet
          message = 'Dealer busts! You win!';
        } else if (player.score > dealer.score) {
          result = 'win';
          winnings = currentBet * 2; // Double bet
          message = 'You win!';
        } else if (player.score < dealer.score) {
          result = 'lose';
          message = 'Dealer wins. You lose.';
        } else {
          result = 'push';
          winnings = currentBet; // Return bet
          message = 'Push.';
        }
        
        const newBalance = gameState.playerBalance + winnings;
        
        // Update statistics
        const newStatistics = {
          ...gameState.statistics,
          gamesPlayed: gameState.statistics.gamesPlayed + 1,
          maxBalance: Math.max(gameState.statistics.maxBalance, newBalance),
        };
        
        if (result === 'win') {
          newStatistics.wins = gameState.statistics.wins + 1;
        } else if (result === 'lose') {
          newStatistics.losses = gameState.statistics.losses + 1;
        } else if (result === 'push') {
          newStatistics.pushes = gameState.statistics.pushes + 1;
        } else if (result === 'blackjack') {
          newStatistics.blackjacks = gameState.statistics.blackjacks + 1;
          newStatistics.wins = gameState.statistics.wins + 1;
        }
        
        set((state) => ({
          gameState: {
            ...state.gameState,
            phase: 'game-over',
            result,
            playerBalance: newBalance,
            message,
            statistics: newStatistics,
          },
        }));
      }, 1000);
    }, 1000);
  },
  
  doubleDown: () => {
    const { gameState } = get();
    const { currentBet, playerBalance, phase, canDoubleDown } = gameState;
    
    if (phase !== 'player-turn' || !canDoubleDown || currentBet > playerBalance) return;
    
    // Double the bet and deduct from balance
    set((state) => ({
      gameState: {
        ...state.gameState,
        currentBet: state.gameState.currentBet * 2,
        playerBalance: state.gameState.playerBalance - state.gameState.currentBet,
      },
    }));
    
    // Draw one card and then stand
    get().hitCard();
    setTimeout(() => {
      get().stand();
    }, 1000);
  },
  
  resetGame: () => {
    const { gameState } = get();
    
    // Check if player is out of money
    if (gameState.playerBalance <= 0) {
      set((state) => ({
        gameState: {
          ...initialState,
          statistics: state.gameState.statistics,
          message: 'Game reset. You were out of money!',
        },
      }));
    } else {
      set((state) => ({
        gameState: {
          ...state.gameState,
          phase: 'betting',
          player: {
            ...initialState.player,
          },
          dealer: {
            ...initialState.dealer,
          },
          currentBet: 0,
          result: null,
          canDoubleDown: false,
          message: 'Place your bet to start',
        },
      }));
    }
    
    get().initGame();
  },
}));