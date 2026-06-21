import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Stethoscope, Briefcase, Search } from "lucide-react";
import toast from "react-hot-toast";
import PublicLayout from "../../layouts/PublicLayout";
import Loader from "../../components/Loader";
import { appointmentService } from "../../services/appointmentService";

const DEPARTMENTS = ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics"];

export default function Doctors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const department = searchParams.get("department") || "";
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    appointmentService
      .listDoctors(department || undefined)
      .then((data) => setDoctors(data.doctors || []))
      .catch(() => toast.error("Could not load doctors right now"))
      .finally(() => setLoading(false));
  }, [department]);

  const filtered = doctors.filter((d) => (d.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-teal-600">Our specialists</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-800 dark:text-ink-50">Meet our doctors</h1>
          <p className="mt-3 text-ink-400">Browse by department, then book directly from your patient dashboard.</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search doctor by name..."
              className="input-field !pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSearchParams({})}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                !department ? "bg-teal-500 text-white" : "bg-white text-ink-600 dark:bg-ink-800 dark:text-ink-200"
              }`}
            >
              All
            </button>
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                onClick={() => setSearchParams({ department: d })}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  department === d ? "bg-teal-500 text-white" : "bg-white text-ink-600 dark:bg-ink-800 dark:text-ink-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10">
          {loading ? (
            <Loader label="Loading doctors..." />
          ) : filtered.length === 0 ? (
            <div className="card text-center text-ink-400">
              No doctors found{department ? ` in ${department}` : ""}. Try a different search or department.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((doc) => (
                <div key={doc.id} className="card hover:shadow-card-hover">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
                    <Stethoscope size={24} />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink-800 dark:text-ink-50">
                    Dr. {doc.name}
                  </h3>
                  <p className="text-sm text-teal-600">{doc.specialization || doc.department}</p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-400">
                    <Briefcase size={13} /> {doc.experience ? `${doc.experience} years experience` : "Experienced specialist"}
                  </p>
                  <Link to="/login" className="btn-primary mt-5 w-full text-sm">
                    Book appointment
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
