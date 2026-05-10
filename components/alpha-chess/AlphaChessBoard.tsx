"use client";

import { Chess } from "chess.js";
import { useMemo } from "react";
import { displayToSquare } from "@/lib/chessDisplay";
import { symbolForPiece } from "@/lib/pieceSymbols";
import { useAlphaChessStore } from "@/store/alphaChessStore";

const ACCENT = {
  selection: "rgba(34, 211, 238, 0.9)",
  legal: "rgba(239, 68, 68, 0.85)",
  captureFill: "rgba(239, 68, 68, 0.22)",
};

const GRID_EDGE = "rgba(118, 126, 142, 0.45)";

function PieceGlyph({
  symbol,
  isWhite,
  size,
  motionClassName,
}: {
  symbol: string;
  isWhite: boolean;
  size: number;
  motionClassName?: string;
}) {
  const glow = isWhite ? "rgba(255,255,255,0.38)" : "rgba(34,211,238,0.26)";
  const baseTop = isWhite ? "rgb(237, 242, 247)" : "rgb(69, 77, 92)";
  const baseBottom = isWhite ? "rgb(194, 201, 215)" : "rgb(31, 36, 46)";
  const diam = size * 0.72;
  return (
    <div
      className={`relative flex items-center justify-center ${motionClassName ?? ""}`}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{
          width: diam,
          height: diam,
          background: `linear-gradient(to bottom, ${baseTop}, ${baseBottom})`,
          boxShadow: `0 0 ${size * 0.11}px ${glow}`,
          border: `1px solid ${isWhite ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"}`,
        }}
      >
        <span
          className="select-none font-semibold leading-none"
          style={{
            fontSize: Math.max(size * 0.42, 13),
            color: isWhite ? "rgba(0,0,0,0.74)" : "rgba(255,255,255,0.92)",
          }}
        >
          {symbol}
        </span>
      </div>
    </div>
  );
}

export function AlphaChessBoard({ boardPx }: { boardPx: number }) {
  const fen = useAlphaChessStore((s) => s.fen);
  const playerSide = useAlphaChessStore((s) => s.playerSide);
  const selectedSquare = useAlphaChessStore((s) => s.selectedSquare);
  const legalTargets = useAlphaChessStore((s) => s.legalTargets);
  const captureTargets = useAlphaChessStore((s) => s.captureTargets);
  const moveAnim = useAlphaChessStore((s) => s.moveAnim);
  const tapSquare = useAlphaChessStore((s) => s.tapSquare);

  const board = useMemo(() => new Chess(fen).board(), [fen]);
  const sq = boardPx / 8;

  return (
    <div
      className="relative rounded-lg"
      style={{
        width: boardPx,
        height: boardPx,
        boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-lg border-[1.2px] border-white/[0.20]"
        style={{ borderRadius: 8 }}
      />
      {Array.from({ length: 8 }, (_, displayRow) => (
        <div key={displayRow} className="flex" style={{ height: sq }}>
          {Array.from({ length: 8 }, (_, displayCol) => {
            const isLight = (displayRow + displayCol) % 2 === 0;
            const cr =
              playerSide === "white" ? displayRow : 7 - displayRow;
            const cc =
              playerSide === "white" ? displayCol : 7 - displayCol;
            const cell = board[cr]?.[cc] ?? null;

            const algebraic = displayToSquare(
              displayRow,
              displayCol,
              playerSide,
            );
            const isSel = selectedSquare === algebraic;
            const isLegal = legalTargets.includes(algebraic);
            const isCap = captureTargets.includes(algebraic);

            let motionClass: string | undefined;
            if (moveAnim?.phase === "out" && algebraic === moveAnim.from) {
              motionClass = "ac-piece-out";
            } else if (moveAnim?.phase === "in" && algebraic === moveAnim.to) {
              motionClass = "ac-piece-in";
            }

            return (
              <button
                key={displayCol}
                type="button"
                className="relative box-border flex items-center justify-center border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                style={{
                  width: sq,
                  height: sq,
                  background: isLight
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.13)",
                  borderRight:
                    displayCol < 7 ? `1px solid ${GRID_EDGE}` : undefined,
                  borderBottom:
                    displayRow < 7 ? `1px solid ${GRID_EDGE}` : undefined,
                }}
                onClick={() => tapSquare(displayRow, displayCol)}
              >
                {isCap && (
                  <span
                    className="pointer-events-none absolute inset-[2px] rounded-md border-2"
                    style={{
                      borderColor: ACCENT.legal,
                      background: ACCENT.captureFill,
                    }}
                  />
                )}
                {!isCap && isLegal && (
                  <span
                    className="pointer-events-none absolute inset-[3px] rounded-md border-2"
                    style={{ borderColor: ACCENT.legal }}
                  />
                )}
                {isSel && (
                  <span
                    className="pointer-events-none absolute inset-[3px] rounded-md border-2 shadow-[0_0_12px_rgba(34,211,238,0.55)]"
                    style={{ borderColor: ACCENT.selection }}
                  />
                )}
                {cell && (
                  <PieceGlyph
                    symbol={symbolForPiece(cell.type, cell.color)}
                    isWhite={cell.color === "w"}
                    size={sq}
                    motionClassName={motionClass}
                  />
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
