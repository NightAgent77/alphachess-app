"use client";

import type { CSSProperties } from "react";
import { useAlphaChessStore } from "@/store/alphaChessStore";
import { AlphaChessBoard } from "./AlphaChessBoard";

export function GamePlayArea({
  dimensions,
  onNewGame,
  onResign,
  onOfferDraw,
}: {
  dimensions: { width: number; height: number };
  onNewGame: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
}) {
  const status = useAlphaChessStore((s) => s.status);
  const gameOver = useAlphaChessStore((s) => s.gameOver);
  const blackCaptured = useAlphaChessStore((s) => s.blackCaptured);
  const whiteCaptured = useAlphaChessStore((s) => s.whiteCaptured);

  const topBar = 60;
  const bottomBar = 70;
  const vGap = 30;
  const maxBoard = Math.max(
    220,
    Math.min(
      920,
      Math.min(dimensions.width - 36, dimensions.height - topBar - bottomBar - vGap * 2),
    ),
  );

  const compact =
    dimensions.width < 900 || dimensions.height < 700;

  return (
    <div className="relative flex min-h-[520px] flex-1 items-center justify-center">
      <div className="relative flex flex-col items-center justify-center">
        <p
          className={`pointer-events-none absolute left-1/2 z-10 line-clamp-1 -translate-x-1/2 text-center text-white/55 ${compact ? "text-sm" : "text-base"}`}
          style={{ top: `max(24px, calc(50% - ${maxBoard / 2}px - 34px))` }}
          suppressHydrationWarning
        >
          {status}
        </p>

        <div
          className="rounded-2xl p-2.5"
          style={{
            background: "linear-gradient(145deg, rgb(15,18,26), rgb(8,10,15))",
            boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <AlphaChessBoard boardPx={maxBoard} />
        </div>

        <CapturedRail
          pieces={blackCaptured}
          className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2"
          style={{
            left: `max(16px, calc(50% - ${maxBoard / 2}px - ${34 * 1.1}px))`,
          }}
        />
        <CapturedRail
          pieces={whiteCaptured}
          className="pointer-events-none absolute top-1/2 z-10 -translate-y-1/2"
          style={{
            right: `max(16px, calc(50% - ${maxBoard / 2}px - ${34 * 1.1}px))`,
          }}
        />

        <div
          className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{
            bottom: `max(16px, calc(50% - ${maxBoard / 2}px - 52px))`,
          }}
        >
          <div className={`flex gap-3 ${compact ? "gap-2" : "gap-3"}`}>
            <GameTextButton
              label="New Game"
              onClick={onNewGame}
              dataAction="new-game"
            />
            <GameTextButton
              label="Resign"
              disabled={gameOver}
              onClick={onResign}
              dataAction="resign"
            />
            <GameTextButton
              label="Offer Draw"
              disabled={gameOver}
              onClick={onOfferDraw}
              dataAction="draw"
            />
          </div>
          <p className="text-center text-xs text-white/45">
            Cmd+R — new game setup
          </p>
        </div>
      </div>
    </div>
  );
}

function GameTextButton({
  label,
  disabled,
  onClick,
  dataAction,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  dataAction?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-action={dataAction}
      className="rounded-md px-2 py-1 text-[13px] font-semibold text-white/85 decoration-transparent transition hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function CapturedRail({
  pieces,
  className,
  style,
}: {
  pieces: string[];
  className?: string;
  style?: CSSProperties;
}) {
  const s = 1.1;
  return (
    <div
      className={className}
      style={{
        ...style,
        padding: `${10 * s}px ${6 * s}px`,
        borderRadius: 10 * s,
        background: "linear-gradient(to bottom, rgba(255,255,255,0.06), rgba(0,0,0,0.2))",
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div className="flex flex-col items-center gap-1.5">
        {pieces.length === 0 ? (
          <span className="text-xs text-white/28">-</span>
        ) : (
          pieces.slice(-12).map((sym, i) => (
            <span key={`${sym}-${i}`} className="text-base leading-none">
              {sym}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
