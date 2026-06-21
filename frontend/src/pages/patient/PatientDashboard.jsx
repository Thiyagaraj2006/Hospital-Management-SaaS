import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarClock, CalendarCheck, Clock3, ArrowRight } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import AppointmentCard from "../../components/AppointmentCard";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { patientService } from "../../services/patientService";
import { appointmentService } from "../../services/appointmentService";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const { profile } = await patientService.getMyProfile();
        const data = await appointmentService.getPatientAppointments(profile.id);
        setAppointments(data.appointments || []);
      } catch {
        toast.error("Could not load your dashboard data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = appointments.filter((a) => a.appointment_date >= today && a.status !== "cancelled");
  const completed = appointments.filter((a) => a.status === "completed");
  const pending = appointments.filter((a) => a.status === "pending");

  return (
    <DashboardLayout title={`Welcome back, ${user?.name?.split(" ")[0]}`} subtitle="Here's what's coming up for you.">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <DashboardCard label="Upcoming" value={upcoming.length} icon={CalendarClock} accent="teal" />
            <DashboardCard label="Completed visits" value={completed.length} icon={CalendarCheck} accent="emerald" />
            <DashboardCard label="Pending confirmation" value={pending.length} icon={Clock3} accent="amber" />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink-800 dark:text-ink-50">Upcoming appointments</h2>
            <Link to="/patient/book" className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:underline">
              Book new <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <div className="card text-center text-ink-400">
                No upcoming appointments yet.{" "}
                <Link to="/patient/book" className="font-semibold text-teal-600 hover:underline">
                  Book one now
                </Link>
                .
              </div>
            ) : (
              upcoming.slice(0, 5).map((a) => <AppointmentCard key={a.id} appointment={a} perspective="patient" />)
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
