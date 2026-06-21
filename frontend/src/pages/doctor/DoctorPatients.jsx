import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserCircle, Phone, Droplet } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader";
import { doctorService } from "../../services/doctorService";

export default function DoctorPatients() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    doctorService
      .getMyPatients()
      .then((data) => setPatients(data.patients || []))
      .catch(() => toast.error("Could not load your patients"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter((p) =>
    (p.users?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="My patients" subtitle="Everyone you've consulted with, in one list.">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search patients..."
        className="input-field mb-5 max-w-sm"
      />

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="card text-center text-ink-400">No patients found.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div key={p.id} className="card hover:shadow-card-hover">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
                  <UserCircle size={24} />
                </div>
                <div>
                  <p className="font-semibold text-ink-800 dark:text-ink-50">{p.users?.name}</p>
                  <p className="text-xs text-ink-400">{p.users?.email}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-sm text-ink-400">
                {p.phone && (
                  <p className="flex items-center gap-1.5"><Phone size={13} /> {p.phone}</p>
                )}
                {p.blood_group && (
                  <p className="flex items-center gap-1.5"><Droplet size={13} /> {p.blood_group} · Age {p.age || "—"}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
