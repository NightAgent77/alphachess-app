"use client";

type Session = "unsigned" | "guest" | "signedIn" | "signedUp";

export function ProfilePanel({
  session,
  onSessionChange,
  onSignIn,
  onSignUp,
}: {
  session: Session;
  onSessionChange: (s: Session) => void;
  onSignIn: () => void;
  onSignUp: () => void;
}) {
  const subtitle =
    session === "unsigned"
      ? "Sign in to sync games and stats, or play as a guest on this device."
      : session === "guest"
        ? "Guest mode — chess from this session is not kept after you quit the app."
        : session === "signedIn"
          ? "You’re linked (demo UI). Ratings and saved games could appear here once the service is connected."
          : "Profile reserved (demo). Finish setup when email or OAuth flows are wired in.";

  return (
    <div className="flex max-h-full flex-1 flex-col overflow-y-auto rounded-[18px] border border-white/[0.08] bg-white/[0.04] p-7">
      <header className="mb-6 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(77,122,224)]/40 to-cyan-500/25">
          <span className="text-xl text-white/95">👤</span>
        </div>
        <div>
          <h2 className="text-[26px] font-bold text-white/94">Profile</h2>
          <p className="mt-1 text-sm text-white/48">{subtitle}</p>
        </div>
      </header>

      {session === "unsigned" && (
        <div>
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-white/45">
            Get started
          </p>
          <div className="flex flex-col gap-3">
            <OutlineCard
              title="Sign in"
              subtitle="Resume synced games and saved preferences on this Mac."
              chroma="blue"
              onClick={onSignIn}
            />
            <OutlineCard
              title="Sign up"
              subtitle="Create a profile so ratings and history can sync when Alpha Chess Cloud is enabled."
              chroma="purple"
              onClick={onSignUp}
            />
            <div className="my-2 h-px bg-white/10" />
            <OutlineCard
              title="Continue as guest"
              subtitle="Play without an account — nothing syncs outside this session. Your chess games aren't preserved when you quit the app (same idea as closing a webpage)."
              chroma="gold"
              caution
              onClick={() => onSessionChange("guest")}
            />
          </div>
        </div>
      )}

      {session === "guest" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-orange-400/35 bg-orange-500/[0.08] p-4">
            <p className="flex items-center gap-2 font-bold text-white/94">
              <span>⚠️</span> Guest session
            </p>
            <p className="mt-2 text-sm text-white/55">
              You’re playing without a saved profile. Gameplay from this session is not written to the cloud and is cleared when you leave the app — think of it like a site that forgets you when the tab closes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSessionChange("unsigned")}
            className="text-sm font-semibold text-[rgb(77,122,224)] hover:underline"
          >
            Sign in, sign up, or choose again
          </button>
        </div>
      )}

      {(session === "signedIn" || session === "signedUp") && (
        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.055] p-4">
            <p className="text-xl font-bold text-white/94">
              {session === "signedIn" ? "Signed in" : "Account created"}
            </p>
            <p className="mt-2 text-sm text-white/50">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => onSessionChange("unsigned")}
            className="text-sm font-semibold text-[rgb(77,122,224)] hover:underline"
          >
            Use a different account option
          </button>
        </div>
      )}
    </div>
  );
}

function OutlineCard({
  title,
  subtitle,
  chroma,
  caution,
  onClick,
}: {
  title: string;
  subtitle: string;
  chroma: "blue" | "purple" | "gold";
  caution?: boolean;
  onClick: () => void;
}) {
  const grad =
    chroma === "blue"
      ? "from-[rgb(77,122,224)]/75 to-cyan-400/45"
      : chroma === "purple"
        ? "from-purple-500/65 to-[rgb(77,122,224)]/42"
        : "from-amber-400/78 to-yellow-400/38";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-left transition hover:bg-white/[0.06] ${
        caution ? "ring-1 ring-amber-400/45" : ""
      }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] bg-gradient-to-br ${grad}`}
      >
        <span className="text-lg opacity-90">🔑</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-bold text-white/94">{title}</p>
        <p className="mt-1 text-[13px] font-medium text-white/[0.48]">
          {subtitle}
        </p>
      </div>
      <span className="text-white/35">›</span>
    </button>
  );
}
