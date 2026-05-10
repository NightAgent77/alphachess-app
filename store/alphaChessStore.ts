import { Chess, type Move, type Square } from "chess.js";
import { create } from "zustand";
import { symbolForPiece } from "@/lib/pieceSymbols";

export type PlayerSide = "white" | "black";

/** Shrink-at-from, then grow-at-to (matches desktop feel). */
export type PieceMoveAnim =
  | {
      phase: "out";
      from: Square;
      to: Square;
      moving: { symbol: string; isWhite: boolean };
    }
  | {
      phase: "in";
      to: Square;
      moving: { symbol: string; isWhite: boolean };
    };

let engine = new Chess();

function sideLabel(side: PlayerSide): string {
  return side === "white" ? "White" : "Black";
}

function assignmentText(playerSide: PlayerSide): string {
  return `You: ${sideLabel(playerSide)} · Opponent: ${sideLabel(playerSide === "white" ? "black" : "white")}`;
}

function turnStatusText(
  chess: Chess,
  playerSide: PlayerSide,
  tags: string[],
): string {
  const sideToMove = chess.turn() === "w" ? "White" : "Black";
  const base = `${assignmentText(playerSide)} · ${sideToMove} to move`;
  if (tags.length === 0) return base;
  return `${base} - ${tags.join(", ")}`;
}

function buildStatusAfterMove(
  chess: Chess,
  playerSide: PlayerSide,
  move: Move | null,
): string {
  if (chess.isCheckmate()) {
    const mover = chess.turn() === "w" ? "Black" : "White";
    return `${assignmentText(playerSide)} · Checkmate - ${mover} wins`;
  }
  if (chess.isStalemate()) {
    return `${assignmentText(playerSide)} · Stalemate`;
  }
  if (chess.isDraw()) {
    return `${assignmentText(playerSide)} · Draw`;
  }

  const tags: string[] = [];
  if (move?.promotion) tags.push("promotion");
  if (move?.captured) tags.push("capture");
  if (chess.inCheck()) tags.push("check");
  return turnStatusText(chess, playerSide, tags);
}

function displayToSquare(
  displayRow: number,
  displayCol: number,
  playerSide: PlayerSide,
): Square {
  const cr = playerSide === "white" ? displayRow : 7 - displayRow;
  const cc = playerSide === "white" ? displayCol : 7 - displayCol;
  const file = String.fromCharCode("a".charCodeAt(0) + cc);
  const rank = 8 - cr;
  return `${file}${rank}` as Square;
}

export type AlphaChessState = {
  fen: string;
  playerSide: PlayerSide;
  selectedSquare: Square | null;
  legalTargets: Square[];
  captureTargets: Square[];
  whiteCaptured: string[];
  blackCaptured: string[];
  gameOver: boolean;
  checkmateWinner: "white" | "black" | null;
  /** Set when player resigns (winner side). */
  resignWinner: "white" | "black" | null;
  status: string;
  /** One-move piece animation; clears after playing (no sticky last-move highlights). */
  moveAnim: PieceMoveAnim | null;
  halfMoveCount: number;

  reset: () => void;
  tapSquare: (displayRow: number, displayCol: number) => void;
  resignCurrentPlayer: () => void;
  offerDrawAndAccept: () => void;
  clearSelectionUI: () => void;
  approximateReportedMoveNumber: () => number;
};

export const useAlphaChessStore = create<AlphaChessState>((set, get) => ({
  fen: engine.fen(),
  playerSide: "white",
  selectedSquare: null,
  legalTargets: [],
  captureTargets: [],
  whiteCaptured: [],
  blackCaptured: [],
  gameOver: false,
  checkmateWinner: null,
  resignWinner: null,
  status: turnStatusText(engine, "white", []),
  moveAnim: null,
  halfMoveCount: 0,

  approximateReportedMoveNumber: () => {
    const n = get().halfMoveCount;
    return Math.max(1, Math.floor((n + 1) / 2));
  },

  clearSelectionUI: () => {
    set({ selectedSquare: null, legalTargets: [], captureTargets: [] });
  },

  reset: () => {
    engine = new Chess();
    const playerSide: PlayerSide = Math.random() < 0.5 ? "white" : "black";
    const status = turnStatusText(engine, playerSide, []);
    set({
      fen: engine.fen(),
      playerSide,
      selectedSquare: null,
      legalTargets: [],
      captureTargets: [],
      whiteCaptured: [],
      blackCaptured: [],
      gameOver: false,
      checkmateWinner: null,
      resignWinner: null,
      moveAnim: null,
      halfMoveCount: 0,
      status,
    });
  },

  resignCurrentPlayer: () => {
    if (get().gameOver) return;
    const resignWinner = engine.turn() === "w" ? "black" : "white";
    const resigning = engine.turn() === "w" ? "White" : "Black";
    const winner = engine.turn() === "w" ? "Black" : "White";
    set({
      gameOver: true,
      checkmateWinner: null,
      resignWinner,
      selectedSquare: null,
      legalTargets: [],
      captureTargets: [],
      status: `${assignmentText(get().playerSide)} · ${resigning} resigned - ${winner} wins`,
    });
  },

  offerDrawAndAccept: () => {
    if (get().gameOver) return;
    set({
      gameOver: true,
      checkmateWinner: null,
      resignWinner: null,
      selectedSquare: null,
      legalTargets: [],
      captureTargets: [],
      status: `${assignmentText(get().playerSide)} · Draw agreed`,
    });
  },

  tapSquare: (displayRow, displayCol) => {
    const { gameOver, playerSide, selectedSquare, moveAnim } = get();
    if (gameOver || moveAnim) return;

    const chess = engine;
    const tapped = displayToSquare(displayRow, displayCol, playerSide);
    const tappedPiece = chess.get(tapped);

    const tryMove = (from: Square, to: Square) => {
      const prevFen = engine.fen();
      const clone = new Chess(prevFen);
      const move = clone.move({ from, to, promotion: "q" });
      if (!move) return false;

      const wc = [...get().whiteCaptured];
      const bc = [...get().blackCaptured];
      if (move.captured) {
        const capColor: "w" | "b" = move.color === "w" ? "b" : "w";
        const sym = symbolForPiece(move.captured, capColor);
        if (move.color === "w") wc.push(sym);
        else bc.push(sym);
      }

      const gameOverNow = clone.isGameOver();

      let checkmateWinner: "white" | "black" | null = null;
      if (clone.isCheckmate()) {
        checkmateWinner = clone.turn() === "w" ? "black" : "white";
      }

      const halfMoveCount = clone.history().length;
      const status = buildStatusAfterMove(clone, playerSide, move);

      const sym = symbolForPiece(move.piece, move.color);
      const isWhite = move.color === "w";
      const moving = { symbol: sym, isWhite };

      const reduceMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        engine = clone;
        set({
          fen: engine.fen(),
          whiteCaptured: wc,
          blackCaptured: bc,
          selectedSquare: null,
          legalTargets: [],
          captureTargets: [],
          gameOver: gameOverNow,
          checkmateWinner,
          resignWinner: null,
          moveAnim: null,
          halfMoveCount,
          status,
        });
        return true;
      }

      const SHRINK_MS = 95;
      const GROW_MS = 120;

      set({
        fen: prevFen,
        moveAnim: {
          phase: "out",
          from: move.from,
          to: move.to,
          moving,
        },
        selectedSquare: null,
        legalTargets: [],
        captureTargets: [],
      });

      window.setTimeout(() => {
        engine = clone;
        set({
          fen: clone.fen(),
          whiteCaptured: wc,
          blackCaptured: bc,
          gameOver: gameOverNow,
          checkmateWinner,
          resignWinner: null,
          moveAnim: {
            phase: "in",
            to: move.to,
            moving,
          },
          halfMoveCount,
          status,
        });
        window.setTimeout(() => {
          set({ moveAnim: null });
        }, GROW_MS);
      }, SHRINK_MS);

      return true;
    };

    if (selectedSquare) {
      if (selectedSquare === tapped) {
        get().clearSelectionUI();
        return;
      }

      const moves = chess.moves({ square: selectedSquare, verbose: true });
      if (moves.some((m) => m.to === tapped)) {
        tryMove(selectedSquare, tapped);
        return;
      }
    }

    if (tappedPiece && tappedPiece.color === chess.turn()) {
      const verbose = chess.moves({ square: tapped, verbose: true });
      const legalTargets = verbose.map((m) => m.to as Square);
      const captureTargets = verbose
        .filter((m) => Boolean(m.captured))
        .map((m) => m.to as Square);
      set({ selectedSquare: tapped, legalTargets, captureTargets });
    } else {
      get().clearSelectionUI();
    }
  },
}));
