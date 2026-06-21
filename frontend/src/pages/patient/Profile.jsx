import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserCircle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import Loader from "../../components/Loader";
import { patientService } from "../../services/patientService";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    patientService
      .getMyProfile()
      .then(({ profile }) => {
        setForm({
          name: profile.users?.name || "",
          email: profile.users?.email || "",
          phone: profile.phone || "",
          age: profile.age || "",
          gender: profile.gender || "",
          blood_group: profile.blood_group || "",
          address: profile.address || "",
        });
      })
      .catch(() => toast.error("Could not load your profile"))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await patientService.updateMyProfile(form);
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Could not save your profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !form) {
    return (
      <DashboardLayout title="Profile">
        <Loader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile" subtitle="Keep your contact and medical details up to date.">
      <div className="card max-w-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300">
              <UserCircle size={28} />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink-800 dark:text-ink-50">{form.name}</p>
              <p className="text-sm text-ink-400">{form.email}</p>
            </div>
          </div>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-secondary text-sm">
              Edit profile
            </button>
          )}
        </div>

        <form onSubmit={handleSave} className="mt-6 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="label-text" htmlFor="name">Full name</label>
            <input id="name" name="name" disabled={!editing} value={form.name} onChange={handleChange} className="input-field disabled:opacity-60" />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="label-text" htmlFor="phone">Phone</label>
            <input id="phone" name="phone" disabled={!editing} value={form.phone} onChange={handleChange} className="input-field disabled:opacity-60" />
          </div>
          <div>
            <label className="label-text" htmlFor="age">Age</label>
            <input id="age" name="age" type="number" disabled={!editing} value={form.age} onChange={handleChange} className="input-field disabled:opacity-60" />
          </div>
          <div>
            <label className="label-text" htmlFor="gender">Gender</label>
            <select id="gender" name="gender" disabled={!editing} value={form.gender} onChange={handleChange} className="input-field disabled:opacity-60">
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="label-text" htmlFor="blood_group">Blood group</label>
            <input id="blood_group" name="blood_group" disabled={!editing} value={form.blood_group} onChange={handleChange} className="input-field disabled:opacity-60" />
          </div>
          <div className="col-span-2">
            <label className="label-text" htmlFor="address">Address</label>
            <input id="address" name="address" disabled={!editing} value={form.address} onChange={handleChange} className="input-field disabled:opacity-60" />
          </div>

          {editing && (
            <div className="col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </DashboardLayout>
  );
}
