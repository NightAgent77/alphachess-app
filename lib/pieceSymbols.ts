import type { Color } from "chess.js";

const WHITE: Record<string, string> = {
  k: "♔",
  q: "♕",
  r: "♖",
  b: "♗",
  n: "♘",
  p: "♙",
};
const BLACK: Record<string, string> = {
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟",
};

export function symbolForPiece(type: string, color: Color): string {
  const t = type.toLowerCase();
  return color === "w" ? WHITE[t] ?? "?" : BLACK[t] ?? "?";
}
