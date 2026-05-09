import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/profile", label: "Profile" },
  { href: "/leaderboard", label: "Leaderboard" },
] as const;

export default function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Alpha Chess
        </Link>
        <ul className="flex flex-1 gap-4 text-sm">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
