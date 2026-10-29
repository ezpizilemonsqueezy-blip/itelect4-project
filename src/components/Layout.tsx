import type { MouseEvent } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";
import { prefersReducedMotion } from "../lib/motion";

const publicNavItems = [
  { to: "/", label: "Desk" },
  { to: "/items", label: "Items" },
];

const memberNavItems = [
  { to: "/claims", label: "Claims" },
  { to: "/items/add", label: "Tag item" },
  { to: "/review", label: "AI review" },
];

const guestNavItems = [
  { to: "/login", label: "Sign in" },
  { to: "/register", label: "Register" },
];

export default function Layout() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const navigate = useNavigate();

  const navItems = [...publicNavItems, ...(token ? memberNavItems : guestNavItems)];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true, viewTransition: true });
  };

  // The new theme spreads out from the switch as a growing circle (View Transitions API).
  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    const apply = () => {
      flushSync(() => setTheme(next));
      root.classList.toggle("dark", next === "dark");
    };

    if (!document.startViewTransition || prefersReducedMotion()) {
      apply();
      return;
    }

    root.style.setProperty("--vt-x", `${event.clientX}px`);
    root.style.setProperty("--vt-y", `${event.clientY}px`);
    root.classList.add("theme-vt");
    const transition = document.startViewTransition(apply);
    void transition.finished.finally(() => root.classList.remove("theme-vt"));
  };

  return (
    <div className="min-h-screen text-ink">
      <header className="site-header sticky top-0 z-40 border-b border-line bg-paper/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3">
          <Link to="/" viewTransition className="group flex items-center gap-3">
            <svg viewBox="0 0 32 32" className="size-9 shrink-0 text-signal transition-transform duration-300 group-hover:-rotate-12" aria-hidden="true">
              <path d="M9 3h14l6 6v20H3V9z" fill="currentColor" />
              <circle cx="16" cy="9" r="2.4" fill="var(--paper)" />
              <path d="M8 17h16M8 22h10" stroke="var(--paper)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="leading-none">
              <span className="block font-display text-xl font-semibold italic">Lost &amp; Found</span>
              <span className="mt-1 block font-mono text-[0.62rem] tracking-[0.2em] text-ink-soft uppercase">Campus Recovery Desk</span>
            </span>
          </Link>

          <div className="flex min-w-0 items-center gap-2">
            <nav className="-mx-1 flex min-w-0 items-center gap-1 overflow-x-auto px-1 text-sm font-medium" aria-label="Main">
              {navItems.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === "/" || to === "/items"} viewTransition className="relative shrink-0 rounded-full px-3 py-2">
                  {({ isActive }) => (
                    <>
                      {isActive ? <span className="nav-pill absolute inset-0 rounded-full bg-ink" aria-hidden="true" /> : null}
                      <span className={`relative ${isActive ? "text-paper" : "text-ink-soft hover:text-ink"}`}>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-ink transition-transform duration-200 hover:rotate-12 active:scale-90"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {token ? (
              <button type="button" onClick={handleLogout} className="shrink-0 rounded-full border border-line px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink">
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 font-mono text-[0.68rem] tracking-[0.18em] text-ink-soft uppercase">
        Every item has an owner · Campus Recovery Desk
      </footer>
    </div>
  );
}
