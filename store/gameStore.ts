import { Chess } from "chess.js";
import { create } from "zustand";

const createInitialGame = () => new Chess();

interface GameState {
  game: Chess;
  fen: string;
  isMyTurn: boolean;
  gameId: string | null;
  makeMove: (from: string, to: string) => boolean;
  resetGame: () => void;
}

const initialGame = createInitialGame();

export const useGameStore = create<GameState>((set, get) => ({
  game: initialGame,
  fen: initialGame.fen(),
  isMyTurn: true,
  gameId: null,

  makeMove: (from, to) => {
    const game = get().game;
    try {
      const move = game.move({ from, to, promotion: "q" });
      if (move) {
        set({ fen: game.fen() });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  resetGame: () => {
    const newGame = createInitialGame();
    set({ game: newGame, fen: newGame.fen() });
  },
}));
