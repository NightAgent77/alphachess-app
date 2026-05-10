"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAlphaChessStore } from "@/store/alphaChessStore";
import { FriendsPanel } from "./FriendsPanel";
import { GamePlayArea } from "./GamePlayArea";
import { ProfilePanel } from "./ProfilePanel";
import { StatsPanel } from "./StatsPanel";

type Panel = "game" | "friends" | "stats" | "profile";

const NAV_ACCENT = "rgb(48, 122, 224)";
const ROW_HI = "rgb(31, 36, 59)";
const VIOLET = "rgb(148, 97, 239)";

type NewMode = "local" | "computer" | "online" | "puzzles";
type TimeCtl = "none" | "1" | "5" | "10" | "20";

export function AlphaChessShell() {
  const reset = useAlphaChessStore((s) => s.reset);
  const resignCurrentPlayer = useAlphaChessStore((s) => s.resignCurrentPlayer);
  const offerDrawAndAccept = useAlphaChessStore((s) => s.offerDrawAndAccept);
  const checkmateWinner = useAlphaChessStore((s) => s.checkmateWinner);
  const playerSide = useAlphaChessStore((s) => s.playerSide);
  const halfMoveCount = useAlphaChessStore((s) => s.halfMoveCount);
  const resignWinner = useAlphaChessStore((s) => s.resignWinner);
  const reportedMove = Math.max(1, Math.floor((halfMoveCount + 1) / 2));

  const mainRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 900, height: 700 });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panel, setPanel] = useState<Panel>("game");

  const [newGameOpen, setNewGameOpen] = useState(false);
  const [newMode, setNewMode] = useState<NewMode>("local");
  const [timeCtl, setTimeCtl] = useState<TimeCtl>("none");

  const [authKind, setAuthKind] = useState<"signIn" | "signUp" | null>(null);

  const [resignOpen, setResignOpen] = useState(false);
  const [resignPhase, setResignPhase] = useState<"confirm" | "outcome">(
    "confirm",
  );

  const [drawOpen, setDrawOpen] = useState(false);
  const [drawPhase, setDrawPhase] = useState<
    "compose" | "waiting" | "outcome"
  >("compose");

  const [matchEnd, setMatchEnd] = useState<"victory" | "defeat" | null>(null);

  const [profileSession, setProfileSession] = useState<
    "unsigned" | "guest" | "signedIn" | "signedUp"
  >("unsigned");

  useLayoutEffect(() => {
    reset();
  }, [reset]);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDims({ width: r.width, height: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!checkmateWinner) return;
    const won =
      (checkmateWinner === "white" && playerSide === "white") ||
      (checkmateWinner === "black" && playerSide === "black");
    setMatchEnd(won ? "victory" : "defeat");
  }, [checkmateWinner, playerSide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        openNewGameSetup();
      }
      if (e.key === "Escape") {
        setNewGameOpen(false);
        setAuthKind(null);
        if (resignPhase === "confirm") setResignOpen(false);
        else if (resignPhase === "outcome") setResignOpen(false);
        setDrawOpen(false);
        setMatchEnd(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resignPhase]);

  const openNewGameSetup = useCallback(() => {
    setNewMode("local");
    setTimeCtl("none");
    setNewGameOpen(true);
  }, []);

  const startGameFromModal = useCallback(() => {
    reset();
    setNewGameOpen(false);
  }, [reset]);

  useEffect(() => {
    if (drawPhase !== "waiting") return;
    const t = window.setTimeout(() => {
      offerDrawAndAccept();
      setDrawPhase("outcome");
    }, 2800);
    return () => clearTimeout(t);
  }, [drawPhase, offerDrawAndAccept]);

  const sidebarW = sidebarOpen ? 316.8 : 158.4;

  return (
    <div
      className="relative flex min-h-screen overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(145deg, rgb(20,23,31), rgb(10,13,18))",
      }}
    >
      <aside
        className="relative flex shrink-0 flex-col gap-3 pt-10 shadow-[4px_0_14px_rgba(0,0,0,0.35)]"
        style={{
          width: sidebarW,
          background:
            "linear-gradient(165deg, rgb(14,18,26), rgb(8,10,15))",
          borderRight: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        <div
          className="rounded-r-[14px] px-5"
          style={{
            boxShadow: "inset -1px 0 0 rgba(34,211,238,0.25)",
          }}
        >
          <div className={sidebarOpen ? "h-[58px] w-full" : "h-14 w-full"}>
            <Image
              src="/alpha-chess-logo.svg"
              alt="Alpha Chess"
              width={280}
              height={67}
              unoptimized
              className="h-full w-auto max-w-full object-contain object-left"
              priority
            />
          </div>
          {sidebarOpen && (
            <p className="mt-1 text-sm text-white/58">Local two-player</p>
          )}
        </div>

        <nav className="flex flex-col gap-2.5 px-4">
          <NavRow
            label="Game"
            icon="▦"
            selected={panel === "game"}
            expanded={sidebarOpen}
            onClick={() => setPanel("game")}
          />
          <NavRow
            label="Friends"
            icon="📡"
            selected={panel === "friends"}
            expanded={sidebarOpen}
            onClick={() => setPanel("friends")}
          />
          <NavRow
            label="Stats"
            icon="📈"
            selected={panel === "stats"}
            expanded={sidebarOpen}
            onClick={() => setPanel("stats")}
          />
        </nav>

        <div className="mt-auto flex items-center gap-2 px-4 pb-4">
          <button
            type="button"
            onClick={() => setPanel("profile")}
            className="flex flex-1 items-center gap-2 rounded-xl py-1 transition hover:bg-white/[0.06]"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full border text-sm"
              style={{
                borderColor:
                  panel === "profile"
                    ? `${NAV_ACCENT}99`
                    : "rgba(255,255,255,0.38)",
                color: panel === "profile" ? NAV_ACCENT : "rgba(255,255,255,0.92)",
              }}
            >
              👤
            </span>
            {sidebarOpen && (
              <span
                style={{
                  color: panel === "profile" ? NAV_ACCENT : "rgba(255,255,255,0.92)",
                }}
                className="text-[15px] font-semibold"
              >
                Profile
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-white/35 text-sm shadow-lg"
            style={{
              background: "rgba(255,255,255,0.06)",
            }}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? "‹" : "›"}
          </button>
        </div>
      </aside>

      <div
        ref={mainRef}
        className="relative flex min-h-0 flex-1 flex-col pl-10 pr-7 pt-4"
      >
        {panel === "game" && (
          <GamePlayArea
            dimensions={dims}
            onNewGame={openNewGameSetup}
            onResign={() => {
              setResignPhase("confirm");
              setResignOpen(true);
            }}
            onOfferDraw={() => {
              setDrawPhase("compose");
              setDrawOpen(true);
            }}
          />
        )}
        {panel === "friends" && <FriendsPanel />}
        {panel === "stats" && <StatsPanel />}
        {panel === "profile" && (
          <ProfilePanel
            session={profileSession}
            onSessionChange={setProfileSession}
            onSignIn={() => setAuthKind("signIn")}
            onSignUp={() => setAuthKind("signUp")}
          />
        )}
      </div>

      <p className="pointer-events-none absolute bottom-2 right-3 text-[9.5px] font-medium tracking-wide text-white/36">
        v.0.1
      </p>

      {/* Modals */}
      {newGameOpen && (
        <ModalScrim onClose={() => setNewGameOpen(false)}>
          <div
            className="relative max-h-[90vh] w-[min(600px,calc(100vw-48px))] overflow-y-auto rounded-[20px] border border-white/[0.08] p-6 shadow-2xl"
            style={{
              background: "rgb(18,19,24)",
              boxShadow: `0 0 28px rgba(120,200,255,0.15)`,
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-[22px] font-bold text-white/96">New game</h2>
            <p className="mt-2 text-sm text-white/55">
              Choose how you want to play
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <ModeCard
                title="Local 2-player"
                sub="Same device"
                selected={newMode === "local"}
                onClick={() => setNewMode("local")}
              />
              <ModeCard
                title="vs Computer"
                sub="Pick difficulty"
                selected={newMode === "computer"}
                onClick={() => setNewMode("computer")}
              />
              <ModeCard
                title="Online"
                sub="Find opponent"
                selected={newMode === "online"}
                onClick={() => setNewMode("online")}
              />
              <ModeCard
                title="Puzzles"
                sub="Daily tactics"
                selected={newMode === "puzzles"}
                onClick={() => setNewMode("puzzles")}
              />
            </div>
            <p className="mt-6 text-xs font-medium uppercase tracking-wide text-white/40">
              Time control
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(
                [
                  ["none", "No timer"],
                  ["1", "1 min"],
                  ["5", "5 min"],
                  ["10", "10 min"],
                  ["20", "20 min"],
                ] as const
              ).map(([k, lab]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTimeCtl(k)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold ${
                    timeCtl === k
                      ? "bg-white text-black"
                      : "bg-white/[0.06] text-white/85"
                  }`}
                >
                  {lab}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-white/38">
              Timers and online / AI behavior will plug in later — Start game
              resets the board with today&apos;s local rules.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setNewGameOpen(false)}
                className="flex-1 rounded-xl border border-white/22 py-3 text-sm font-semibold text-white/88"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={startGameFromModal}
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 py-3 text-sm font-bold text-white"
              >
                Start game
              </button>
            </div>
          </div>
        </ModalScrim>
      )}

      {authKind && (
        <ModalScrim onClose={() => setAuthKind(null)}>
          <div
            className="w-[min(560px,calc(100vw-40px))] rounded-[22px] border border-white/[0.08] p-6 shadow-2xl"
            style={{
              background: "rgb(18,19,24)",
              boxShadow: "0 0 28px rgba(180,220,255,0.18)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h2 className="text-[26px] font-bold text-white/95">
              {authKind === "signIn" ? "Sign in" : "Create account"}
            </h2>
            <p className="mt-2 text-sm text-white/46">
              {authKind === "signIn"
                ? "Welcome back — use your Alpha Chess credentials when authentication is wired to your backend."
                : "Set up your profile details — verification and SSO will attach here once the service is connected."}
            </p>
            <div className="mt-6 space-y-3">
              <Field icon="✉️" placeholder="Email" />
              <Field icon="🔒" placeholder="Password" password />
              {authKind === "signUp" && (
                <Field icon="🔒" placeholder="Confirm password" password />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setProfileSession(authKind === "signIn" ? "signedIn" : "signedUp");
                setAuthKind(null);
              }}
              className="mt-6 w-full rounded-xl py-3.5 text-base font-bold text-white"
              style={{ background: NAV_ACCENT }}
            >
              {authKind === "signIn" ? "Sign in" : "Create account"}
            </button>
            <p className="mt-4 text-center text-[11px] text-white/38">
              Demo only — submissions are ignored until backend auth ships.
            </p>
            <p className="mt-1 text-center text-[11px] text-white/32">
              Press Escape or click outside this card on the blurred background
              to dismiss.
            </p>
          </div>
        </ModalScrim>
      )}

      {resignOpen && (
        <ModalScrim
          onClose={() => {
            setResignOpen(false);
            setResignPhase("confirm");
          }}
        >
          <div
            className="w-[min(400px,calc(100vw-48px))] overflow-hidden rounded-2xl border border-red-400/35 shadow-[0_0_24px_rgba(255,80,80,0.25)]"
            style={{ background: "rgb(22,22,26)" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {resignPhase === "confirm" ? (
              <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
                <span className="text-2xl">🏳️</span>
                <h3 className="mt-3 text-lg font-bold text-white/96">
                  Resign game?
                </h3>
                <p className="mt-2 text-sm text-white/48">
                  You&apos;re about to concede this game. This action cannot be
                  undone.
                </p>
                <div className="mt-6 flex w-full gap-2.5">
                  <button
                    type="button"
                    onClick={() => setResignOpen(false)}
                    className="flex-1 rounded-[10px] border border-white/22 py-2.5 text-[13px] font-semibold text-white/88"
                  >
                    Keep playing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resignCurrentPlayer();
                      setResignPhase("outcome");
                    }}
                    className="flex-1 rounded-[10px] bg-gradient-to-br from-red-500 to-red-600 py-2.5 text-[13px] font-bold text-white"
                  >
                    Resign
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-red-500 px-4 py-3 text-center">
                  <p className="text-xs text-white/95">🏳️</p>
                  <p className="mt-1 text-base font-bold text-white">
                    You resigned
                  </p>
                  <p className="mt-1 text-[11px] text-white/88">
                    {resignWinner === "white" ? "White" : "Black"} wins by
                    resignation · Move {reportedMove}
                  </p>
                </div>
                <div className="bg-[rgb(23,23,28)] px-3 py-4">
                  <div className="flex items-start justify-center gap-3">
                    <Col
                      lbl="You"
                      side={playerSide === "white" ? "White" : "Black"}
                      badge={resignWinner === playerSide ? "Win" : "Loss"}
                      win={resignWinner === playerSide}
                    />
                    <span className="mt-3 text-[11px] font-black text-white/28">
                      vs
                    </span>
                    <Col
                      lbl="Opponent"
                      side={playerSide === "white" ? "Black" : "White"}
                      badge={resignWinner !== playerSide ? "Win" : "Loss"}
                      win={resignWinner !== playerSide}
                    />
                  </div>
                  <div className="my-3 h-px bg-white/[0.07]" />
                  <div className="flex gap-2.5 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setResignOpen(false);
                        setResignPhase("confirm");
                      }}
                      className="flex-1 rounded-lg border border-white/20 py-2 text-xs font-semibold text-white/85"
                    >
                      Review game
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResignOpen(false);
                        setResignPhase("confirm");
                        openNewGameSetup();
                      }}
                      className="flex-1 rounded-lg py-2 text-xs font-bold text-white"
                      style={{ background: `${VIOLET}eb` }}
                    >
                      New game
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalScrim>
      )}

      {drawOpen && (
        <ModalScrim
          onClose={() => {
            setDrawOpen(false);
            setDrawPhase("compose");
          }}
        >
          <div
            className="w-[min(700px,calc(100vw-48px))] overflow-hidden rounded-[20px] border border-white/[0.08] shadow-[0_0_32px_rgba(80,140,255,0.35)]"
            style={{ background: "rgb(28,31,41)" }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {drawPhase === "outcome" ? (
              <div>
                <div className="py-4 text-center" style={{ background: VIOLET }}>
                  <p className="text-lg">⚖️</p>
                  <p className="mt-1 text-lg font-bold text-white">Game drawn</p>
                  <p className="mt-1 px-3 text-xs text-white/90">
                    Draw by agreement · Move {reportedMove}
                  </p>
                </div>
                <div className="bg-[rgb(23,23,28)] px-4 py-4">
                  <div className="flex items-start justify-center gap-4">
                    <DrawCol title="You" side={playerSide === "white" ? "White" : "Black"} />
                    <span className="mt-4 text-sm font-black text-white/35">
                      ½ — ½
                    </span>
                    <DrawCol title="Opponent" side={playerSide === "white" ? "Black" : "White"} />
                  </div>
                  <div className="my-3 h-px bg-white/[0.07]" />
                  <p className="flex flex-wrap items-center justify-center gap-2 text-xs text-white/40">
                    <span>📊</span> Rating change:
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-bold text-white"
                      style={{ background: `${VIOLET}8c` }}
                    >
                      +8 pts each
                    </span>
                  </p>
                  <div className="mt-4 flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setDrawOpen(false);
                        setDrawPhase("compose");
                      }}
                      className="flex-1 rounded-lg border border-white/20 py-2 text-xs font-semibold text-white/85"
                    >
                      Review game
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawOpen(false);
                        setDrawPhase("compose");
                        openNewGameSetup();
                      }}
                      className="flex-1 rounded-lg py-2 text-xs font-bold text-white"
                      style={{ background: `${VIOLET}eb` }}
                    >
                      New game
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-xl font-bold text-white/96">Offer draw</h3>
                <p className="mt-1 text-sm text-white/42">
                  Local match — your opponent responds on this device.
                </p>
                <div className="mt-5 flex gap-3">
                  <div className="flex-1 rounded-2xl border border-white/[0.07] bg-[rgb(33,36,46)] p-4">
                    <p className="text-[11px] font-semibold text-white/38">
                      {drawPhase === "compose"
                        ? "Step 1 · Confirm offer"
                        : "Step 1 · Sent"}
                    </p>
                    <div className="mt-4 flex flex-col items-center text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-violet-400/55 text-xl">
                        ✋
                      </span>
                      <p className="mt-3 text-[15px] font-bold text-white/95">
                        {drawPhase === "compose"
                          ? "Offer a draw?"
                          : "Offer sent"}
                      </p>
                      <p className="mt-2 text-xs text-white/45">
                        {drawPhase === "compose"
                          ? "Your opponent will see the offer on their next turn."
                          : "Hang tight — we're waiting for a response."}
                      </p>
                    </div>
                    {drawPhase === "compose" ? (
                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setDrawOpen(false)}
                          className="flex-1 rounded-[10px] border border-white/22 py-2 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setDrawPhase("waiting")}
                          className="flex-1 rounded-[10px] bg-gradient-to-br from-violet-500 to-violet-700 py-2 text-xs font-bold text-white"
                        >
                          Send
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 rounded-[10px] bg-white/[0.06] py-2.5 text-center text-xs font-semibold text-white/35">
                        Awaiting response…
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-white/28">›</div>
                  <div className="flex-1 rounded-2xl border border-white/[0.07] bg-[rgb(33,36,46)] p-4">
                    <p className="text-[11px] font-semibold text-white/38">
                      {drawPhase === "compose"
                        ? "Step 2 · Status"
                        : "Step 2 · Waiting"}
                    </p>
                    <div className="mt-4 flex flex-col items-center text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/18 text-xl text-white/35">
                        ⋯
                      </span>
                      <p className="mt-3 text-[15px] font-bold text-white/55">
                        {drawPhase === "compose"
                          ? "No offer yet"
                          : "Draw offered"}
                      </p>
                      <p className="mt-2 text-xs text-white/38">
                        {drawPhase === "compose"
                          ? "Send an offer to see your opponent's response here."
                          : "Waiting for your opponent to respond…"}
                      </p>
                      {drawPhase === "waiting" && (
                        <p className="mt-4 rounded-full border border-violet-400/55 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-300">
                          Offer pending · Move {reportedMove}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-center text-[11px] text-white/32">
                  Press Escape or tap outside the card to dismiss.
                </p>
              </div>
            )}
          </div>
        </ModalScrim>
      )}

      {matchEnd && (
        <ModalScrim onClose={() => setMatchEnd(null)}>
          <div
            className="w-[min(400px,calc(100vw-48px))] rounded-[15px] border border-white/[0.08] p-3 shadow-2xl"
            style={{
              background: "rgb(26,26,31)",
              boxShadow:
                matchEnd === "victory"
                  ? "0 0 22px rgba(80,160,255,0.35)"
                  : "0 0 22px rgba(245,90,70,0.35)",
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2">
              <span
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-lg"
                style={{
                  background:
                    matchEnd === "victory"
                      ? "rgba(80,160,255,0.2)"
                      : "rgba(245,90,70,0.25)",
                }}
              >
                {matchEnd === "victory" ? "🏆" : "😞"}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="text-lg font-black"
                  style={{
                    color:
                      matchEnd === "victory"
                        ? "rgb(82,148,250)"
                        : "rgb(245,92,92)",
                  }}
                >
                  {matchEnd === "victory" ? "Victory!" : "Defeated"}
                </p>
                <p className="text-[11px] font-medium text-white/44">
                  Checkmate · {playerSide === "white" ? "White" : "Black"} ·{" "}
                  {reportedMove} moves · 12:32
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-[17px] font-black"
                  style={{
                    color:
                      matchEnd === "victory"
                        ? "rgb(115,208,255)"
                        : "rgb(245,92,92)",
                  }}
                >
                  {matchEnd === "victory" ? "+18" : "-14"}
                </p>
                <p className="text-[10px] text-white/45">
                  {matchEnd === "victory"
                    ? "1812 → 1830"
                    : "1794 → 1780"}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <AccuracyRow
                label="Your accuracy"
                pct={matchEnd === "victory" ? 91 : 68}
                fill={
                  matchEnd === "victory"
                    ? "rgb(82,148,250)"
                    : "rgb(245,92,92)"
                }
              />
              <AccuracyRow
                label="Opponent"
                pct={matchEnd === "victory" ? 68 : 74}
                fill={
                  matchEnd === "victory"
                    ? "rgb(245,92,92)"
                    : "rgb(255,140,72)"
                }
              />
            </div>
            <div className="mt-3 rounded-xl border border-white/[0.06] bg-[rgb(33,33,41)] px-2 py-2">
              <p className="text-[10.5px] font-semibold text-white/38">
                Move quality highlights
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {(matchEnd === "victory"
                  ? ["e4★", "e5", "Nf3", "Nf6", "Rxe5★", "O-O"]
                  : ["e4", "c5", "a6✗", "Na5✗", "d4"]
                ).map((x) => (
                  <span
                    key={x}
                    className="rounded-md border border-white/12 px-2 py-1 text-[11px] font-semibold text-white/75"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setMatchEnd(null)}
                className="flex-1 rounded-lg bg-white/[0.08] py-2 text-xs font-semibold text-white"
              >
                Review
              </button>
              <button
                type="button"
                onClick={async () => {
                  const headline = matchEnd === "victory" ? "Victory!" : "Defeated";
                  const text = `Alpha Chess — ${headline}\nCheckmate · You (${playerSide}) · ${reportedMove} full moves · 12:32 (demo)`;
                  try {
                    await navigator.clipboard.writeText(text);
                  } catch {
                    /* ignore */
                  }
                }}
                className="flex-1 rounded-lg bg-white/[0.08] py-2 text-xs font-semibold text-white"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => {
                  setMatchEnd(null);
                  if (matchEnd === "victory") openNewGameSetup();
                  else reset();
                }}
                className="flex-1 rounded-lg py-2 text-xs font-bold text-white"
                style={{
                  background:
                    matchEnd === "victory"
                      ? "rgb(82,148,250)"
                      : "rgb(255,120,72)",
                }}
              >
                {matchEnd === "victory" ? "New game" : "Rematch"}
              </button>
            </div>
            <p className="mt-2 text-center text-[9px] text-white/28">
              Press Escape or tap outside the card to dismiss.
            </p>
          </div>
        </ModalScrim>
      )}
    </div>
  );
}

function ModalScrim({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 p-6 backdrop-blur-md"
      onMouseDown={onClose}
    >
      {children}
    </div>
  );
}

function NavRow({
  label,
  icon,
  selected,
  expanded,
  onClick,
}: {
  label: string;
  icon: string;
  selected: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex w-full items-center gap-2 rounded-none py-2.5 pl-0 pr-3 text-left transition hover:bg-white/[0.04]"
      style={{
        background: selected ? ROW_HI : undefined,
      }}
    >
      {selected && (
        <span
          className="absolute bottom-0 left-0 top-0 w-[4.6px]"
          style={{ background: NAV_ACCENT }}
        />
      )}
      <span
        className="flex w-10 justify-center text-lg"
        style={{ color: selected ? NAV_ACCENT : "rgba(255,255,255,0.92)" }}
      >
        {icon}
      </span>
      {expanded && (
        <span
          className="text-[15px] font-semibold"
          style={{ color: selected ? NAV_ACCENT : "rgba(255,255,255,0.92)" }}
        >
          {label}
        </span>
      )}
    </button>
  );
}

function ModeCard({
  title,
  sub,
  selected,
  onClick,
}: {
  title: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-[rgb(48,122,224)] bg-white/[0.08]"
          : "border-white/[0.06] bg-white/[0.05] hover:bg-white/[0.07]"
      }`}
    >
      <p className="font-bold text-white/95">{title}</p>
      <p className="mt-1 text-xs text-white/48">{sub}</p>
    </button>
  );
}

function Field({
  icon,
  placeholder,
  password,
}: {
  icon: string;
  placeholder: string;
  password?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 py-3">
      <span className="text-white/45">{icon}</span>
      <input
        type={password ? "password" : "email"}
        placeholder={placeholder}
        className="flex-1 bg-transparent text-[15px] text-white/92 outline-none placeholder:text-white/35"
      />
    </div>
  );
}

function Col({
  lbl,
  side,
  badge,
  win,
}: {
  lbl: string;
  side: string;
  badge: string;
  win: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 text-center">
      <p className="text-xs font-bold text-white/92">{lbl}</p>
      <p className="text-[11px] text-white/44">{side}</p>
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
          win ? "bg-green-500/16 text-green-400" : "bg-red-500/22 text-red-400"
        }`}
      >
        {badge}
      </span>
    </div>
  );
}

function DrawCol({ title, side }: { title: string; side: string }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <p className="text-xs font-bold text-white/92">{title}</p>
      <p className="text-[11px] text-white/44">{side}</p>
      <span
        className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white/95"
        style={{ background: `${VIOLET}6b` }}
      >
        Draw
      </span>
    </div>
  );
}

function AccuracyRow({
  label,
  pct,
  fill,
}: {
  label: string;
  pct: number;
  fill: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-semibold">
        <span className="text-white/50">{label}</span>
        <span style={{ color: fill }}>{pct}%</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: fill }}
        />
      </div>
    </div>
  );
}
