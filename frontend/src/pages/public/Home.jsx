import { Link } from "react-router-dom";
import {
  CalendarCheck,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Brain,
  Bone,
  Baby,
  Eye,
  ArrowRight,
  Quote,
} from "lucide-react";
import PublicLayout from "../../layouts/PublicLayout";

const FEATURES = [
  {
    icon: CalendarCheck,
    title: "Book in under a minute",
    desc: "Pick a department, choose an available doctor and time slot, and you're confirmed — no phone calls.",
  },
  {
    icon: HeartPulse,
    title: "Your full history, in one place",
    desc: "Every visit, consultation note and prescription lives in your dashboard, ready when a doctor needs it.",
  },
  {
    icon: ShieldCheck,
    title: "Built on hospital-grade security",
    desc: "Role-based access, encrypted credentials and audited routes keep patient data where it belongs.",
  },
];

const DEPARTMENTS = [
  { icon: Stethoscope, name: "Cardiology" },
  { icon: Brain, name: "Neurology" },
  { icon: Bone, name: "Orthopedics" },
  { icon: Eye, name: "Dermatology" },
  { icon: Baby, name: "Pediatrics" },
];

const TESTIMONIALS = [
  {
    quote: "I booked a cardiology appointment during my lunch break and got a WhatsApp confirmation before I'd even left the cafeteria.",
    name: "Ananya R.",
    role: "Patient",
  },
  {
    quote: "Walk-ins finally don't derail my schedule — reception gives them a token and I see exactly where they slot in.",
    name: "Dr. Karthik Iyer",
    role: "Cardiologist",
  },
  {
    quote: "The admin dashboard tells me at a glance which departments are getting overbooked. That used to take a Friday afternoon.",
    name: "Meera S.",
    role: "Hospital Administrator",
  },
];

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white dark:from-ink-800 dark:to-ink-900">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
              Now scheduling across 5 departments
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold leading-tight text-ink-800 dark:text-ink-50 sm:text-5xl">
              Hospital care, coordinated from one calm dashboard.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-400">
              MediCare connects patients, doctors and front-desk staff so appointments, notes and
              notifications stay in sync — without another spreadsheet or sticky note.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn-primary text-base">
                Get started <ArrowRight size={17} />
              </Link>
              <Link to="/doctors" className="btn-secondary text-base">
                Browse doctors
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-ink-400">
              <div>
                <p className="font-display text-2xl font-bold text-ink-800 dark:text-ink-50">12k+</p>
                <p>Appointments booked</p>
              </div>
              <div className="h-10 w-px bg-ink-100 dark:bg-ink-700" />
              <div>
                <p className="font-display text-2xl font-bold text-ink-800 dark:text-ink-50">40+</p>
                <p>Specialists onboard</p>
              </div>
              <div className="h-10 w-px bg-ink-100 dark:bg-ink-700" />
              <div>
                <p className="font-display text-2xl font-bold text-ink-800 dark:text-ink-50">4.8/5</p>
                <p>Patient rating</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="card !p-7">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold text-ink-800 dark:text-ink-50">Today's appointments</p>
                <span className="text-xs text-ink-400">Live</span>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { name: "Rahul Menon", dept: "Cardiology", time: "10:30 AM", status: "Confirmed" },
                  { name: "Sara Khan", dept: "Dermatology", time: "11:15 AM", status: "Pending" },
                  { name: "Devika Nair", dept: "Pediatrics", time: "1:00 PM", status: "Confirmed" },
                ].map((row) => (
                  <div key={row.name} className="flex items-center justify-between rounded-xl border border-ink-50 px-3.5 py-3 dark:border-ink-700">
                    <div>
                      <p className="text-sm font-semibold text-ink-800 dark:text-ink-50">{row.name}</p>
                      <p className="text-xs text-ink-400">{row.dept} · {row.time}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        row.status === "Confirmed"
                          ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden h-24 w-24 rounded-2xl bg-amber-200/60 blur-2xl sm:block" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink-800 dark:text-ink-50">Why hospitals choose MediCare</h2>
          <p className="mt-3 text-ink-400">A focused toolset for the three people who keep a hospital running smoothly.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card hover:shadow-card-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="bg-white py-20 dark:bg-ink-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink-800 dark:text-ink-50">Departments</h2>
            <p className="mt-3 text-ink-400">Find the right specialist, fast.</p>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {DEPARTMENTS.map((d) => (
              <Link
                key={d.name}
                to={`/doctors?department=${encodeURIComponent(d.name)}`}
                className="card flex flex-col items-center gap-3 text-center hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                  <d.icon size={22} />
                </div>
                <p className="text-sm font-semibold text-ink-800 dark:text-ink-50">{d.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-ink-800 dark:text-ink-50">From the people who use it daily</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card">
              <Quote size={20} className="text-teal-300" />
              <p className="mt-3 text-sm leading-relaxed text-ink-600 dark:text-ink-200">"{t.quote}"</p>
              <p className="mt-4 text-sm font-semibold text-ink-800 dark:text-ink-50">{t.name}</p>
              <p className="text-xs text-ink-400">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="card flex flex-col items-center justify-between gap-6 bg-teal-500 !p-10 text-center text-white sm:flex-row sm:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold">Ready to bring your hospital online?</h2>
            <p className="mt-2 text-teal-50">Create your account in minutes — patients, doctors and staff all welcome.</p>
          </div>
          <Link to="/register" className="btn-accent shrink-0 text-base">
            Create free account <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
