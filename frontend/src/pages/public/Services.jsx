import { CalendarCheck, FileText, Bell, Activity, Users, ShieldCheck } from "lucide-react";
import PublicLayout from "../../layouts/PublicLayout";

const SERVICES = [
  {
    icon: CalendarCheck,
    title: "Online appointment booking",
    desc: "Choose a department, doctor and time slot, and get instant confirmation by email and WhatsApp.",
  },
  {
    icon: FileText,
    title: "Consultation records",
    desc: "Doctors log notes after every visit, building a complete, searchable medical history.",
  },
  {
    icon: Bell,
    title: "Real-time notifications",
    desc: "Status changes, reminders and updates land in your notification center the moment they happen.",
  },
  {
    icon: Activity,
    title: "AI symptom checker",
    desc: "Describe what you're feeling and get pointed toward the right department before you book.",
  },
  {
    icon: Users,
    title: "Walk-in & token management",
    desc: "Reception staff register walk-ins and issue queue tokens that doctors see live on their dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access control",
    desc: "Patients, doctors, reception and admins each see exactly the data relevant to their role.",
  },
];

export default function Services() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-teal-600">What we offer</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-800 dark:text-ink-50">Services</h1>
          <p className="mt-3 text-ink-400">Everything a modern hospital front-of-house needs, in one platform.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div key={s.title} className="card hover:shadow-card-hover">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-300">
                <s.icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
