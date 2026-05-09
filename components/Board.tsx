"use client";

import { useGameStore } from "@/store/gameStore";
import { Chessboard } from "react-chessboard";

export default function Board() {
  const { fen, makeMove } = useGameStore();

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mx-auto w-full max-w-[560px]">
        <Chessboard
          options={{
            position: fen,
            boardStyle: { width: "100%" },
            onPieceDrop: ({ sourceSquare, targetSquare }) => {
              if (!targetSquare) return false;
              return makeMove(sourceSquare, targetSquare);
            },
          }}
        />
      </div>
    </div>
  );
}
