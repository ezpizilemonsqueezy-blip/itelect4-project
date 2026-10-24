import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useUiStore } from "../store/uiStore";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/items", label: "Items" },
  { to: "/claims", label: "Claims" },
  { to: "/login", label: "Login" },
];

export default function Layout() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">Lost & Found</p>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Campus Recovery Desk</h1>
          </div>

          <nav className="flex items-center gap-2 text-sm font-medium">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {token ? (
              <NavLink to="/review" className={({ isActive }) => `rounded-full px-3 py-2 transition ${isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"}`}>
                AI Review
              </NavLink>
            ) : null}

            {token ? (
              <NavLink
                to="/items/add"
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 transition ${
                    isActive
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  }`
                }
              >
                + Add Item
              </NavLink>
            ) : null}

            <div className="ml-2 flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  theme === "light"
                    ? "bg-amber-100 text-amber-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                }`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  theme === "dark"
                    ? "bg-slate-700 text-slate-50 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                }`}
              >
                Dark
              </button>
            </div>

            {token ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-slate-700 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
