"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MOCK_ONLINE_ACCOUNTS,
  loadFriendIds,
  saveFriendIds,
} from "@/lib/mockOnlineDirectory";

type Section = "search" | "friends";

export function FriendsPanel() {
  const [section, setSection] = useState<Section>("search");
  const [query, setQuery] = useState("");
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFriendIds(loadFriendIds());
  }, []);

  useEffect(() => {
    saveFriendIds(friendIds);
  }, [friendIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...MOCK_ONLINE_ACCOUNTS].sort((a, b) =>
      a.displayName.localeCompare(b.displayName, undefined, {
        sensitivity: "base",
      }),
    );
    if (!q) return list;
    return list.filter(
      (a) =>
        a.displayName.toLowerCase().includes(q) ||
        a.handle.toLowerCase().includes(q),
    );
  }, [query]);

  const friends = useMemo(
    () =>
      MOCK_ONLINE_ACCOUNTS.filter((a) => friendIds.has(a.id)).sort((a, b) =>
        a.displayName.localeCompare(b.displayName),
      ),
    [friendIds],
  );

  function toggleFriend(id: string) {
    setFriendIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.04] p-6">
      <header className="mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold text-white/95">
            Play online
          </span>
        </div>
        <p className="mt-2 max-w-xl text-sm text-white/48">
          Search players, add friends, and open your friends list — demo data
          until your web backend is connected.
        </p>
      </header>

      <div className="mb-4 flex gap-2">
        <TabButton
          active={section === "search"}
          icon="🔍"
          label="Search"
          onClick={() => setSection("search")}
        />
        <TabButton
          active={section === "friends"}
          icon="👥"
          label="Friends"
          onClick={() => setSection("friends")}
        />
      </div>

      {section === "search" ? (
        <>
          <div className="relative mb-4">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35">
              🔍
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.06] py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-500/40"
            />
          </div>
          <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
            {filtered.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.055] px-4 py-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-bold text-white/90">
                  {a.displayName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white/92">
                    {a.displayName}
                  </p>
                  <p className="truncate text-sm text-white/42">
                    @{a.handle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFriend(a.id)}
                  className="shrink-0 rounded-lg border border-white/[0.12] bg-white/[0.06] px-3 py-2 text-xs font-semibold text-white/88 hover:bg-white/[0.1]"
                >
                  {friendIds.has(a.id) ? "Added" : "Add friend"}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain">
          {friends.length === 0 ? (
            <p className="text-sm text-white/40">No friends yet.</p>
          ) : (
            friends.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.055] px-4 py-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-sm font-bold">
                  {a.displayName[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white/92">{a.displayName}</p>
                  <p className="text-sm text-white/42">@{a.handle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFriend(a.id)}
                  className="text-white/45 hover:text-white/75"
                  aria-label={`Remove ${a.displayName}`}
                >
                  ✕
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function TabButton({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border border-white/[0.12] bg-white/[0.12] text-white"
          : "border border-transparent bg-white/[0.04] text-white/55 hover:bg-white/[0.07]"
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
