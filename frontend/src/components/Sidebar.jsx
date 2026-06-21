import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarPlus,
  CalendarClock,
  UserCircle,
  Users,
  BarChart3,
  TicketCheck,
} from "lucide-react";

const LINKS = {
  patient: [
    { to: "/patient/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/patient/book", label: "Book Appointment", icon: CalendarPlus },
    { to: "/patient/appointments", label: "My Appointments", icon: CalendarClock },
    { to: "/patient/profile", label: "Profile", icon: UserCircle },
  ],
  doctor: [
    { to: "/doctor/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/doctor/patients", label: "My Patients", icon: Users },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Overview", icon: BarChart3 },
  ],
  reception: [
    { to: "/reception/dashboard", label: "Walk-in & Tokens", icon: TicketCheck },
  ],
};

export default function Sidebar({ role }) {
  const links = LINKS[role] || [];

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-100 bg-white px-4 py-6 dark:border-ink-700 dark:bg-ink-900 lg:block">
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200"
                  : "text-ink-600 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
              }`
            }
          >
            <link.icon size={17} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
