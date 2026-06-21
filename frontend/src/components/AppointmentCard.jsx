import { Calendar, Clock, User } from "lucide-react";
import StatusBadge from "./StatusBadge";

/**
 * appointment: { id, appointment_date, appointment_time, status, doctors?, patients? }
 * perspective: "patient" | "doctor" — controls whose name is shown
 * actions: optional React node rendered on the right (buttons etc.)
 */
export default function AppointmentCard({ appointment, perspective = "patient", actions }) {
  const counterpart =
    perspective === "patient"
      ? appointment.doctors?.users?.name
        ? `Dr. ${appointment.doctors.users.name}`
        : "Doctor"
      : appointment.patients?.users?.name || "Patient";

  const subLabel =
    perspective === "patient" ? appointment.doctors?.department || appointment.doctors?.specialization : appointment.patients?.phone;

  return (
    <div className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:shadow-card-hover">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
          <User size={20} />
        </div>
        <div>
          <p className="font-display font-semibold text-ink-800 dark:text-ink-50">{counterpart}</p>
          {subLabel && <p className="text-sm text-ink-400">{subLabel}</p>}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-ink-400">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> {appointment.appointment_date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} /> {appointment.appointment_time}
            </span>
            {appointment.token_number && (
              <span className="font-mono text-xs font-semibold text-amber-600">
                Token #{appointment.token_number}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={appointment.status} />
        {actions}
      </div>
    </div>
  );
}
