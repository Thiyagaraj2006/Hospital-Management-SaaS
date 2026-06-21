import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users, Stethoscope, CalendarClock, CalendarDays } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import Loader from "../../components/Loader";
import { adminService } from "../../services/adminService";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [activity, setActivity] = useState({ newRegistrations: [], newAppointments: [] });

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, activityRes] = await Promise.all([
          adminService.getStats(),
          adminService.getActivity(),
        ]);
        setStats(statsRes.stats);
        setTrends(statsRes.appointmentTrends || []);
        setActivity(activityRes);
      } catch {
        toast.error("Could not load admin dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <DashboardLayout title="Admin overview" subtitle="Hospital-wide stats and recent activity.">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard label="Total patients" value={stats.totalPatients} icon={Users} accent="teal" />
            <DashboardCard label="Total doctors" value={stats.totalDoctors} icon={Stethoscope} accent="amber" />
            <DashboardCard label="Total appointments" value={stats.totalAppointments} icon={CalendarClock} accent="emerald" />
            <DashboardCard label="Today's appointments" value={stats.todayAppointments} icon={CalendarDays} accent="rose" />
          </div>

          <div className="mt-8 card">
            <h2 className="font-display text-lg font-semibold text-ink-800 dark:text-ink-50">Appointment trends (last 7 days)</h2>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-100 dark:text-ink-700" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="currentColor" className="text-ink-400" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke="currentColor" className="text-ink-400" />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #EEF3F2", fontSize: 13 }}
                  />
                  <Bar dataKey="count" fill="#0E7C7B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h3 className="font-display text-base font-semibold text-ink-800 dark:text-ink-50">New registrations</h3>
              <div className="mt-4 space-y-3">
                {activity.newRegistrations.length === 0 ? (
                  <p className="text-sm text-ink-400">No recent registrations.</p>
                ) : (
                  activity.newRegistrations.map((u) => (
                    <div key={u.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink-700 dark:text-ink-100">{u.name}</span>
                      <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs capitalize text-ink-500 dark:bg-ink-700 dark:text-ink-200">
                        {u.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card">
              <h3 className="font-display text-base font-semibold text-ink-800 dark:text-ink-50">New appointments</h3>
              <div className="mt-4 space-y-3">
                {activity.newAppointments.length === 0 ? (
                  <p className="text-sm text-ink-400">No recent appointments.</p>
                ) : (
                  activity.newAppointments.map((a) => (
                    <div key={a.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium text-ink-700 dark:text-ink-100">
                        {a.patients?.users?.name || "Patient"} → Dr. {a.doctors?.users?.name || "—"}
                      </span>
                      <span className="text-xs text-ink-400">{a.appointment_date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
