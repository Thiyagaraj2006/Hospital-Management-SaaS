import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Stethoscope, CalendarDays } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader";
import { appointmentService } from "../../services/appointmentService";

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
];

export default function BookAppointment() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const minDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    appointmentService
      .listDoctors()
      .then((data) => setDoctors(data.doctors || []))
      .catch(() => toast.error("Could not load doctors"))
      .finally(() => setLoadingDoctors(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedDoctor || !date || !time) {
      toast.error("Please select a doctor, date and time slot");
      return;
    }
    setSubmitting(true);
    try {
      await appointmentService.book({
        doctor_id: selectedDoctor.id,
        appointment_date: date,
        appointment_time: time,
      });
      toast.success("Appointment booked! We've sent a confirmation.");
      navigate("/patient/appointments");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed, please try again");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="Book an appointment" subtitle="Choose a doctor, then pick a date and time that works for you.">
      {loadingDoctors ? (
        <Loader />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <p className="label-text">1. Select a doctor</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {doctors.map((doc) => (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`card flex items-center gap-3 text-left transition ${
                    selectedDoctor?.id === doc.id ? "ring-2 ring-teal-500" : "hover:shadow-card-hover"
                  }`}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800 dark:text-ink-50">Dr. {doc.name}</p>
                    <p className="text-xs text-ink-400">{doc.specialization || doc.department}</p>
                  </div>
                </button>
              ))}
              {doctors.length === 0 && (
                <p className="text-sm text-ink-400">No doctors available right now.</p>
              )}
            </div>
          </div>

          <div>
            <label className="label-text" htmlFor="date">2. Select a date</label>
            <div className="relative max-w-xs">
              <CalendarDays size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                id="date"
                type="date"
                min={minDate}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field !pl-10"
              />
            </div>
          </div>

          <div>
            <p className="label-text">3. Select a time slot</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
              {TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    time === slot
                      ? "border-teal-500 bg-teal-500 text-white"
                      : "border-ink-100 text-ink-600 hover:border-teal-300 dark:border-ink-700 dark:text-ink-200"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "Booking..." : "Confirm appointment"}
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
