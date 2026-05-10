import type { Square } from "chess.js";
import type { PlayerSide } from "@/store/alphaChessStore";

export function displayToSquare(
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
