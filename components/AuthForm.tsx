"use client";

export default function AuthForm() {
  return (
    <form
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="text-lg font-medium">Sign in</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Replace with Supabase Auth (email OTP, OAuth, etc.).
      </p>
    </form>
  );
}
