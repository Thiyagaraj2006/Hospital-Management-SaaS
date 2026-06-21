import { Link, NavLink, useNavigate } from "react-router-dom";
import { Moon, Sun, Stethoscope, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/doctors", label: "Doctors" },
  { to: "/services", label: "Services" },
  { to: "/symptom-checker", label: "Symptom Checker" },
  { to: "/contact", label: "Contact" },
];

const DASHBOARD_PATH = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
  reception: "/reception/dashboard",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/80 backdrop-blur dark:border-ink-700 dark:bg-ink-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white">
            <Stethoscope size={18} />
          </span>
          <span className="font-display text-lg font-bold text-ink-800 dark:text-ink-50">MediCare</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-teal-600 ${
                  isActive ? "text-teal-600" : "text-ink-600 dark:text-ink-200"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user && <NotificationBell />}

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to={DASHBOARD_PATH[user.role] || "/"} className="btn-secondary !px-4 !py-2 text-sm">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-primary !px-4 !py-2 text-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link to="/login" className="btn-secondary !px-4 !py-2 text-sm">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Get Started
              </Link>
            </div>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-ink-100 px-4 py-4 dark:border-ink-700 lg:hidden">
          <nav className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-ink-600 dark:text-ink-200"
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Link to={DASHBOARD_PATH[user.role] || "/"} className="btn-secondary flex-1 text-sm">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-primary flex-1 text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary flex-1 text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary flex-1 text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
