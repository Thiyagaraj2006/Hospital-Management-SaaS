import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import PublicLayout from "../../layouts/PublicLayout";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent — our team will get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 600);
  }

  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-teal-600">Get in touch</span>
          <h1 className="mt-3 font-display text-4xl font-bold text-ink-800 dark:text-ink-50">Contact us</h1>
          <p className="mt-3 text-ink-400">Questions about a booking, a partnership, or anything else — we're listening.</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="card lg:col-span-3">
            <div>
              <label className="label-text" htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Jane Doe" />
            </div>
            <div className="mt-4">
              <label className="label-text" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="jane@example.com" />
            </div>
            <div className="mt-4">
              <label className="label-text" htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} className="input-field" placeholder="How can we help?" />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>

          <div className="space-y-4 lg:col-span-2">
            <div className="card flex items-start gap-3">
              <Phone size={18} className="mt-0.5 text-teal-600" />
              <div>
                <p className="font-semibold text-ink-800 dark:text-ink-50">Phone</p>
                <p className="text-sm text-ink-400">+91 98765 43210</p>
              </div>
            </div>
            <div className="card flex items-start gap-3">
              <Mail size={18} className="mt-0.5 text-teal-600" />
              <div>
                <p className="font-semibold text-ink-800 dark:text-ink-50">Email</p>
                <p className="text-sm text-ink-400">care@medicare.app</p>
              </div>
            </div>
            <div className="card flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-teal-600" />
              <div>
                <p className="font-semibold text-ink-800 dark:text-ink-50">Address</p>
                <p className="text-sm text-ink-400">MediCare HQ, Chennai, Tamil Nadu, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
