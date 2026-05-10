"use client";

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

  const topBar = 56;
  const bottomBar = 96;
  const vGap = 28;
  /** Side rails (captured pieces) sit outside the board; reserve horizontal space. */
  const railTrack = 46;
  const railGap = 10;
  const hPad = 40;
  const maxBoard = Math.max(
    220,
    Math.min(
      920,
      Math.min(
        dimensions.width - hPad - 2 * railTrack - 2 * railGap,
        dimensions.height - topBar - bottomBar - vGap * 2,
      ),
    ),
  );

  const compact =
    dimensions.width < 900 || dimensions.height < 700;

  return (
    <div className="flex min-h-[520px] flex-1 items-center justify-center px-3 py-5">
      <div className="flex max-w-full flex-col items-center gap-4">
        <p
          className={`line-clamp-2 text-center text-white/55 ${compact ? "text-sm" : "text-base"}`}
          suppressHydrationWarning
        >
          {status}
        </p>

        <div className="flex max-w-full flex-row items-center justify-center gap-2 md:gap-3">
          <CapturedRail pieces={blackCaptured} />
          <div
            className="shrink-0 rounded-2xl p-2.5"
            style={{
              background: "linear-gradient(145deg, rgb(15,18,26), rgb(8,10,15))",
              boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <AlphaChessBoard boardPx={maxBoard} />
          </div>
          <CapturedRail pieces={whiteCaptured} />
        </div>

        <div className="flex flex-col items-center gap-2 px-2">
          <div className={`flex flex-wrap justify-center ${compact ? "gap-2" : "gap-3"}`}>
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

function CapturedRail({ pieces }: { pieces: string[] }) {
  const s = 1.1;
  return (
    <div
      className="pointer-events-none w-[42px] shrink-0 self-center md:w-[46px]"
      style={{
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
