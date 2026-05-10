"use client";

import {
  demoChessStats,
  demoDeltaFromBase,
  demoWinRatePercent,
} from "@/lib/demoChessStats";

export function StatsPanel() {
  const trend = demoChessStats.eloTrend;
  const maxR = Math.max(...trend.map((t) => t.rating), 1300);
  const minR = Math.min(...trend.map((t) => t.rating), 1150);
  const w = 400;
  const h = 160;
  const pad = 24;
  const pts = trend.map((t, i) => {
    const x = pad + (i / (trend.length - 1)) * (w - pad * 2);
    const y =
      h -
      pad -
      ((t.rating - minR) / (maxR - minR || 1)) * (h - pad * 2);
    return `${x},${y}`;
  });

  const maxOutcome = Math.max(
    ...demoChessStats.outcomeBars.map((b) => b.count),
    1,
  );

  const maxOpening = Math.max(
    ...demoChessStats.openings.map((o) => o.games),
    1,
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.04]">
      <header className="shrink-0 border-b border-white/[0.06] px-6 pb-4 pt-6">
        <h2 className="text-[26px] font-bold text-white/94">Statistics</h2>
        <p className="mt-2 text-sm text-white/48">
          Rating trajectory, results, and repertoire — styled like your board
          surface.
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5">
      <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[rgb(21,25,33)] p-5">
        <p className="text-sm font-semibold text-white/55">ELO rating</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-[44px] font-bold leading-none text-white/95">
            {demoChessStats.currentElo.toLocaleString()}
          </span>
          <span className="text-lg font-semibold text-cyan-400/90">
            +{demoDeltaFromBase}
          </span>
        </div>
        <p className="mt-2 text-xs text-white/45">
          Base rating <strong className="text-white/70">{demoChessStats.baseElo}</strong> · standard starting point for new profiles
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricPill title="Games" value={`${demoChessStats.gamesPlayed}`} foot="recorded" />
        <MetricPill title="Win rate" value={`${demoWinRatePercent}%`} foot="all time" />
        <MetricPill
          title="Move acc."
          value={`${demoChessStats.moveAccuracyPercent}%`}
          foot="estimate"
        />
      </div>

      <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[rgb(21,25,33)] p-5">
        <h3 className="text-base font-semibold text-white/88">
          Rating over time
        </h3>
        <p className="text-xs text-white/40">Last 10 months (demo)</p>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="mt-4 w-full"
          style={{ height: 220 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="eloFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.45)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0.05)" />
            </linearGradient>
          </defs>
          <polygon
            fill="url(#eloFill)"
            points={`${pad},${h - pad} ${pts.join(" ")} ${w - pad},${h - pad}`}
          />
          <polyline
            fill="none"
            stroke="rgba(34,211,238,0.9)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={pts.join(" ")}
          />
        </svg>
        <div className="flex justify-between px-2 text-[10px] text-white/45">
          {trend.map((t) => (
            <span key={t.period}>{t.period}</span>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[rgb(21,25,33)] p-5">
        <h3 className="text-base font-semibold text-white/88">
          Results breakdown
        </h3>
        <p className="text-xs text-white/40">
          Wins, losses, draws in rated games (demo)
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {demoChessStats.outcomeBars.map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex justify-between text-xs text-white/50">
                <span>{b.label}</span>
                <span>{b.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(b.count / maxOutcome) * 100}%`,
                    background: b.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-white/[0.06] bg-[rgb(21,25,33)] p-5">
        <h3 className="text-base font-semibold text-white/88">
          Repertoire share
        </h3>
        <p className="text-xs text-white/40">Games by opening family (demo)</p>
        <div className="mt-4 flex flex-col gap-3">
          {demoChessStats.openings.map((o) => (
            <div key={o.name}>
              <div className="mb-1 flex justify-between text-xs text-white/50">
                <span>{o.name}</span>
                <span>{o.games}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                  style={{ width: `${(o.games / maxOpening) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs font-medium text-white/38">
        Demo statistics — connect recorded games for live ELO and charts.
      </p>
      </div>
    </div>
  );
}

function MetricPill({
  title,
  value,
  foot,
}: {
  title: string;
  value: string;
  foot: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[rgb(21,25,33)] p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-white/40">
        {title}
      </p>
      <p className="mt-1 text-[22px] font-bold text-white/92">{value}</p>
      <p className="mt-1 text-[11px] text-white/35">{foot}</p>
    </div>
  );
}
