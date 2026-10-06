import Link from "next/link";

import { ModeToggle } from "./mode-toggle";

// Vercel Best Practice: Hoist static arrays/objects to module level
const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
] as const;

// Vercel Best Practice: Keep layout components as Server Components;
// push Client Component boundaries down to leaf nodes (<ModeToggle />).
export default function Header() {
  return (
    <header className="border-b">
      <div className="flex flex-row items-center justify-between px-4 py-2">
        <nav className="flex gap-4 text-base font-medium">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
