import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, FolderKanban, User, Users, ClipboardList, Menu, Sun, Moon, LogOut } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppHooks";
import { logout, restoreSession } from "../../features/auth/authSlice";
import { useColorMode } from "../../styles/theme";
import NotificationBell from "../common/NotificationBell";

const buildNavigation = (role) => {
  const items = [];

  if (role === "Admin") {
    items.push({ label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" });
  }

  items.push({ label: "Projects", icon: <FolderKanban size={20} />, path: "/projects" });

  if (role === "Admin") {
    items.push({ label: "Users", icon: <Users size={20} />, path: "/users" });
  }

  items.push({ label: "Profile", icon: <User size={20} />, path: "/profile" });

  if (role === "Admin") {
    items.push({ label: "Activities", icon: <ClipboardList size={20} />, path: "/activities" });
  }

  return items;
};

function AppShell() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { mode, toggleMode } = useColorMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navigationItems = buildNavigation(user?.role);

  const navContent = (
    <div className="flex h-full flex-col gap-8 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
          <FolderKanban size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-300 dark:to-brand-500">
            HAR
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Workspace
          </p>
        </div>
      </div>
      <nav className="space-y-2 mt-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-white/60 text-brand-700 shadow-sm dark:bg-slate-800/60 dark:text-brand-400 border border-white/50 dark:border-white/10"
                  : "text-slate-600 hover:bg-white/40 dark:text-slate-400 dark:hover:bg-slate-800/40 border border-transparent"
              }`
            }
          >
            <span className="text-base transition-transform group-hover:scale-110">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-transparent transition-colors duration-300">
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm md:hidden animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div
            className="h-full w-72 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex h-full max-w-[1600px] w-full overflow-hidden">
        <aside className="hidden w-72 shrink-0 border-r border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/40 md:block h-full overflow-y-auto">
          {navContent}
        </aside>

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="shrink-0 border-b border-white/20 bg-white/40 backdrop-blur-xl dark:border-white/5 dark:bg-slate-900/40">
            <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-8">
              <div className="flex items-center gap-3">
                <button className="btn-secondary !p-2.5 md:hidden" onClick={() => setMobileOpen(true)} type="button">
                  <Menu size={20} />
                </button>
                <div>
                  <h1 className="text-xl font-bold">Project Overview</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user?.role} Portal</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <NotificationBell />
                <button className="btn-secondary !p-2.5" onClick={toggleMode} type="button" aria-label="Toggle theme">
                  {mode === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
                {user?.avatar ? (
                  <img
                    alt={user?.name}
                    className="h-11 w-11 rounded-full border-2 border-white shadow-sm object-cover dark:border-slate-800"
                    src={user.avatar.startsWith("http") ? user.avatar : `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:5000"}${user.avatar}`}
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-bold text-white shadow-sm border-2 border-white dark:border-slate-800">
                    {user?.name?.[0] || "U"}
                  </div>
                )}
                <button className="btn-secondary !p-2.5" onClick={handleLogout} type="button" aria-label="Logout">
                  <LogOut size={18} className="text-red-500 dark:text-red-400" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-6 py-8 md:px-8 flex-1 overflow-y-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppShell;
