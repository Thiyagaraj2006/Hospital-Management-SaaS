import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CalendarClock, CalendarCheck, Users, FileText } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import DashboardCard from "../../components/DashboardCard";
import AppointmentCard from "../../components/AppointmentCard";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { doctorService } from "../../services/doctorService";
import { appointmentService } from "../../services/appointmentService";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ today: [], upcoming: [], total: 0 });
  const [noteFor, setNoteFor] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function load() {
    try {
      const res = await doctorService.getMyDashboard();
      setData(res);
    } catch {
      toast.error("Could not load your dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleStatus(appointmentId, status) {
    setBusyId(appointmentId);
    try {
      await appointmentService.updateStatus(appointmentId, status);
      toast.success(`Marked as ${status}`);
      load();
    } catch {
      toast.error("Could not update status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleComplete(appointmentId) {
    setBusyId(appointmentId);
    try {
      await doctorService.markCompleted(appointmentId);
      toast.success("Appointment marked completed");
      load();
    } catch {
      toast.error("Could not mark as completed");
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveNote(appointmentId) {
    if (!noteText.trim()) {
      toast.error("Note can't be empty");
      return;
    }
    try {
      await doctorService.addNote(appointmentId, noteText.trim());
      toast.success("Consultation note saved");
      setNoteFor(null);
      setNoteText("");
    } catch {
      toast.error("Could not save note");
    }
  }

  function renderActions(appointment) {
    const isBusy = busyId === appointment.id;
    return (
      <div className="flex flex-wrap items-center gap-2">
        {appointment.status === "pending" && (
          <button
            disabled={isBusy}
            onClick={() => handleStatus(appointment.id, "confirmed")}
            className="rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-200"
          >
            Confirm
          </button>
        )}
        {appointment.status !== "completed" && appointment.status !== "cancelled" && (
          <button
            disabled={isBusy}
            onClick={() => handleComplete(appointment.id)}
            className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-200"
          >
            Mark complete
          </button>
        )}
        <button
          onClick={() => {
            setNoteFor(appointment.id);
            setNoteText("");
          }}
          className="flex items-center gap-1 rounded-lg bg-ink-100 px-2.5 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-200 dark:bg-ink-700 dark:text-ink-100"
        >
          <FileText size={13} /> Note
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout title={`Hello, Dr. ${user?.name?.split(" ").pop()}`} subtitle="Here's your schedule for today.">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <DashboardCard label="Today's appointments" value={data.today.length} icon={CalendarClock} accent="teal" />
            <DashboardCard label="Upcoming" value={data.upcoming.length} icon={CalendarCheck} accent="amber" />
            <DashboardCard label="Total patients seen" value={data.total} icon={Users} accent="emerald" />
          </div>

          <h2 className="mt-8 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">Today</h2>
          <div className="mt-4 space-y-3">
            {data.today.length === 0 ? (
              <div className="card text-center text-ink-400">No appointments scheduled for today.</div>
            ) : (
              data.today.map((a) => (
                <div key={a.id}>
                  <AppointmentCard appointment={a} perspective="doctor" actions={renderActions(a)} />
                  {noteFor === a.id && (
                    <div className="card mt-2 !p-4">
                      <textarea
                        autoFocus
                        rows={3}
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        className="input-field"
                        placeholder="Consultation notes..."
                      />
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => handleSaveNote(a.id)} className="btn-primary !px-4 !py-2 text-xs">
                          Save note
                        </button>
                        <button onClick={() => setNoteFor(null)} className="btn-secondary !px-4 !py-2 text-xs">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <h2 className="mt-8 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">Upcoming</h2>
          <div className="mt-4 space-y-3">
            {data.upcoming.length === 0 ? (
              <div className="card text-center text-ink-400">Nothing else on the calendar yet.</div>
            ) : (
              data.upcoming.slice(0, 8).map((a) => <AppointmentCard key={a.id} appointment={a} perspective="doctor" />)
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
