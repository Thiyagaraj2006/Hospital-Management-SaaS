import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TicketCheck, UserPlus } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { appointmentService } from "../../services/appointmentService";
import { receptionService } from "../../services/receptionService";

export default function ReceptionDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", age: "", gender: "", doctor_id: "" });

  async function loadAll() {
    try {
      const [doctorsRes, tokensRes] = await Promise.all([
        appointmentService.listDoctors(),
        receptionService.getTodayTokens(),
      ]);
      setDoctors(doctorsRes.doctors || []);
      setTokens(tokensRes.tokens || []);
    } catch {
      toast.error("Could not load reception data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.doctor_id) {
      toast.error("Name, email and doctor are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await receptionService.registerWalkIn(form);
      toast.success(`Registered — token #${res.tokenNumber}`);
      setForm({ name: "", email: "", phone: "", age: "", gender: "", doctor_id: "" });
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not register walk-in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout title="Reception" subtitle="Register walk-ins and track today's token queue.">
      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="card lg:col-span-2">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-teal-600" />
              <h2 className="font-display text-base font-semibold text-ink-800 dark:text-ink-50">Walk-in registration</h2>
            </div>

            <div className="mt-4 space-y-3">
              <input name="name" placeholder="Patient name" value={form.name} onChange={handleChange} className="input-field" />
              <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-field" />
              <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} className="input-field" />
                <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                  <option value="">Gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <select name="doctor_id" value={form.doctor_id} onChange={handleChange} className="input-field">
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>Dr. {d.name} — {d.department}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full">
              {submitting ? "Registering..." : "Register & issue token"}
            </button>
          </form>

          <div className="lg:col-span-3">
            <div className="flex items-center gap-2">
              <TicketCheck size={18} className="text-teal-600" />
              <h2 className="font-display text-base font-semibold text-ink-800 dark:text-ink-50">Today's token queue</h2>
            </div>
            <div className="mt-4 space-y-3">
              {tokens.length === 0 ? (
                <div className="card text-center text-ink-400">No walk-ins registered yet today.</div>
              ) : (
                tokens.map((t) => (
                  <div key={t.id} className="card flex items-center justify-between !p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 font-mono text-sm font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                        {t.token_number}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-800 dark:text-ink-50">
                          {t.patients?.users?.name || "Patient"}
                        </p>
                        <p className="text-xs text-ink-400">Dr. {t.doctors?.users?.name || "—"}</p>
                      </div>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
