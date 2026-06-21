import { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";
import { notificationService } from "../services/notificationService";
import { useAuth } from "../context/AuthContext";

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);

  async function load() {
    try {
      const data = await notificationService.list();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // Silently ignore — the bell just stays at its last known state
    }
  }

  useEffect(() => {
    if (!user) return;
    load();
    const interval = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleMarkAllRead() {
    await notificationService.markAllAsRead();
    load();
  }

  async function handleMarkRead(id) {
    await notificationService.markAsRead(id);
    load();
  }

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-700"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card-hover dark:border-ink-700 dark:bg-ink-800">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-ink-700">
            <p className="font-display text-sm font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-medium text-teal-600 hover:underline dark:text-teal-300">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-ink-400">You're all caught up.</p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.is_read && handleMarkRead(n.id)}
                  className={`flex w-full items-start gap-2 border-b border-ink-50 px-4 py-3 text-left text-sm last:border-0 dark:border-ink-700/60 ${
                    n.is_read ? "text-ink-400" : "bg-teal-50/60 font-medium text-ink-700 dark:bg-teal-900/10 dark:text-ink-100"
                  }`}
                >
                  {!n.is_read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />}
                  <span className="flex-1">{n.message}</span>
                  {n.is_read && <Check size={14} className="mt-0.5 shrink-0 text-ink-300" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
