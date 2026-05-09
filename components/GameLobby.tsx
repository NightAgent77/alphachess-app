"use client";

export default function GameLobby() {
  return (
    <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="text-lg font-medium">Lobby</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Matchmaking and rooms will hook into Supabase next.
      </p>
    </section>
  );
}
