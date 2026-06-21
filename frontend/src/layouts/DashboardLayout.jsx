import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ children, title, subtitle }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar role={user?.role} />
        <main className="flex-1 bg-ink-50 px-4 py-8 dark:bg-ink-900 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            {(title || subtitle) && (
              <div className="mb-7">
                {title && <h1 className="font-display text-2xl font-bold text-ink-800 dark:text-ink-50">{title}</h1>}
                {subtitle && <p className="mt-1 text-sm text-ink-400">{subtitle}</p>}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
