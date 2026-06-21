import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Stethoscope } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const DASHBOARD_PATH = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
  reception: "/reception/dashboard",
};

const ROLES = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "reception", label: "Reception" },
  { value: "admin", label: "Admin" },
];

const DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    phone: "",
    age: "",
    gender: "",
    blood_group: "",
    address: "",
    specialization: "",
    department: "",
    experience: "",
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await register(form);
      toast.success(`Account created. Welcome, ${user.name.split(" ")[0]}!`);
      navigate(DASHBOARD_PATH[user.role] || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-teal-50 to-white px-4 py-10 dark:from-ink-800 dark:to-ink-900">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-white">
            <Stethoscope size={20} />
          </span>
          <span className="font-display text-xl font-bold text-ink-800 dark:text-ink-50">MediCare</span>
        </Link>

        <div className="card">
          <h1 className="font-display text-2xl font-bold text-ink-800 dark:text-ink-50">Create your account</h1>
          <p className="mt-1 text-sm text-ink-400">Choose your role to see the relevant fields.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label-text">I am a</label>
              <div className="grid grid-cols-4 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                    className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                      form.role === r.value
                        ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200"
                        : "border-ink-100 text-ink-500 dark:border-ink-700 dark:text-ink-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="label-text" htmlFor="name">Full name</label>
                <input id="name" name="name" required value={form.name} onChange={handleChange} className="input-field" placeholder="Jane Doe" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="label-text" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" placeholder="jane@example.com" />
              </div>
              <div className="col-span-2">
                <label className="label-text" htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required minLength={6} value={form.password} onChange={handleChange} className="input-field" placeholder="At least 6 characters" />
              </div>
            </div>

            {form.role === "patient" && (
              <div className="grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 dark:border-ink-700">
                <div>
                  <label className="label-text" htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 9876543210" />
                </div>
                <div>
                  <label className="label-text" htmlFor="age">Age</label>
                  <input id="age" name="age" type="number" min="0" value={form.age} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="label-text" htmlFor="gender">Gender</label>
                  <select id="gender" name="gender" value={form.gender} onChange={handleChange} className="input-field">
                    <option value="">Select</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label-text" htmlFor="blood_group">Blood group</label>
                  <input id="blood_group" name="blood_group" value={form.blood_group} onChange={handleChange} className="input-field" placeholder="O+" />
                </div>
                <div className="col-span-2">
                  <label className="label-text" htmlFor="address">Address</label>
                  <input id="address" name="address" value={form.address} onChange={handleChange} className="input-field" />
                </div>
              </div>
            )}

            {form.role === "doctor" && (
              <div className="grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 dark:border-ink-700">
                <div>
                  <label className="label-text" htmlFor="specialization">Specialization</label>
                  <input id="specialization" name="specialization" value={form.specialization} onChange={handleChange} className="input-field" placeholder="Cardiologist" />
                </div>
                <div>
                  <label className="label-text" htmlFor="department">Department</label>
                  <select id="department" name="department" value={form.department} onChange={handleChange} className="input-field">
                    <option value="">Select</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text" htmlFor="experience">Years of experience</label>
                  <input id="experience" name="experience" type="number" min="0" value={form.experience} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="label-text" htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
                </div>
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-400">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-teal-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
