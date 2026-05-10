/** Mirrors `DemoChessStats` from Alpha-Chess.swift */

export const demoChessStats = {
  baseElo: 1200,
  currentElo: 1274,
  gamesPlayed: 48,
  wins: 22,
  losses: 18,
  draws: 8,
  moveAccuracyPercent: 84,
  eloTrend: [
    { period: "Jan", rating: 1200 },
    { period: "Feb", rating: 1188 },
    { period: "Mar", rating: 1212 },
    { period: "Apr", rating: 1196 },
    { period: "May", rating: 1230 },
    { period: "Jun", rating: 1224 },
    { period: "Jul", rating: 1248 },
    { period: "Aug", rating: 1260 },
    { period: "Sep", rating: 1252 },
    { period: "Oct", rating: 1274 },
  ],
  outcomeBars: [
    { label: "Wins", count: 22, color: "rgb(89, 217, 140)" },
    { label: "Losses", count: 18, color: "rgb(235, 97, 107)" },
    { label: "Draws", count: 8, color: "rgba(255,255,255,0.42)" },
  ],
  openings: [
    { name: "Italian Game", games: 14 },
    { name: "Sicilian", games: 11 },
    { name: "Queen's Gambit", games: 9 },
    { name: "London System", games: 7 },
    { name: "Other", games: 7 },
  ],
} as const;

export const demoDeltaFromBase =
  demoChessStats.currentElo - demoChessStats.baseElo;

export const demoWinRatePercent = Math.round(
  (demoChessStats.wins / demoChessStats.gamesPlayed) * 100,
);
