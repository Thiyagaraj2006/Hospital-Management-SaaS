import { Target, Eye, Heart } from "lucide-react";
import PublicLayout from "../../layouts/PublicLayout";

export default function About() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-teal-600">About MediCare</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-800 dark:text-ink-50">
            Software that gets out of the way of care.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-400">
            MediCare started as a simple question: why does booking a doctor's appointment still feel
            harder than booking a flight? We built a platform that keeps patients, doctors, reception
            and administrators on the same page — literally — from the first booking to the final
            consultation note.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="card">
            <Target size={22} className="text-teal-600" />
            <h3 className="mt-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">Our mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Remove the administrative friction between a patient needing care and a doctor able to give it.
            </p>
          </div>
          <div className="card">
            <Eye size={22} className="text-teal-600" />
            <h3 className="mt-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">Our vision</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              A hospital operating system that's just as comfortable in a single clinic as a multi-department hospital.
            </p>
          </div>
          <div className="card">
            <Heart size={22} className="text-teal-600" />
            <h3 className="mt-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">Our values</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Patient data is treated as sensitive by default — every role sees only what it needs to.
            </p>
          </div>
        </div>

        <div className="mt-16 card !p-10">
          <h2 className="font-display text-2xl font-bold text-ink-800 dark:text-ink-50">Built for three audiences</h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-display font-semibold text-teal-600">Patients</p>
              <p className="mt-1.5 text-sm text-ink-400">Book, track and revisit appointments without picking up a phone.</p>
            </div>
            <div>
              <p className="font-display font-semibold text-teal-600">Doctors</p>
              <p className="mt-1.5 text-sm text-ink-400">See today's queue, patient history and consultation notes in one view.</p>
            </div>
            <div>
              <p className="font-display font-semibold text-teal-600">Admin & Reception</p>
              <p className="mt-1.5 text-sm text-ink-400">Track hospital-wide metrics and manage walk-ins with live token numbers.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
