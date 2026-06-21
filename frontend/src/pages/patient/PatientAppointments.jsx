import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DashboardLayout from "../../layouts/DashboardLayout";
import AppointmentCard from "../../components/AppointmentCard";
import Loader from "../../components/Loader";
import { patientService } from "../../services/patientService";
import { appointmentService } from "../../services/appointmentService";

const FILTERS = ["all", "pending", "confirmed", "completed", "cancelled"];

export default function PatientAppointments() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const { profile } = await patientService.getMyProfile();
        const data = await appointmentService.getPatientAppointments(profile.id);
        setAppointments(data.appointments || []);
      } catch {
        toast.error("Could not load your appointments");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <DashboardLayout title="My appointments" subtitle="Your full appointment history, past and upcoming.">
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f ? "bg-teal-500 text-white" : "bg-white text-ink-600 dark:bg-ink-800 dark:text-ink-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="card text-center text-ink-400">No appointments in this category.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <AppointmentCard key={a.id} appointment={a} perspective="patient" />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
