export type OnlinePlayerAccount = {
  id: string;
  displayName: string;
  handle: string;
};

/** Mirrors `MockOnlineDirectory` from Alpha-Chess.swift */
export const MOCK_ONLINE_ACCOUNTS: OnlinePlayerAccount[] = [
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000001", displayName: "Jordan Lee", handle: "jordanlee" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000002", displayName: "Sam Rivera", handle: "sam_codes" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000003", displayName: "Morgan Blake", handle: "mblake" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000004", displayName: "Alex Novak", handle: "novakalex" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000005", displayName: "Riley Chen", handle: "rileyc" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000006", displayName: "Casey Ortiz", handle: "casey_o" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000007", displayName: "Taylor Kim", handle: "tkim" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000008", displayName: "Jamie Patel", handle: "jamiepatel" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-000000000009", displayName: "Drew Morgan", handle: "drewm" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-00000000000A", displayName: "Quinn Foster", handle: "quinnfoster" },
  { id: "AAAAAAAA-BBBB-CCCC-DDDD-00000000000B", displayName: "Skyler Brooks", handle: "skylerb" },
];

export const FRIEND_STORAGE_KEY = "AlphaChessFriendAccountIDs";

export function loadFriendIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const raw = window.localStorage.getItem(FRIEND_STORAGE_KEY);
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

export function saveFriendIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FRIEND_STORAGE_KEY, [...ids].sort().join(","));
}
