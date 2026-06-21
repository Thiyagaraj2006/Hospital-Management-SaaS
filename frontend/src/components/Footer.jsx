import { Link } from "react-router-dom";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white dark:border-ink-700 dark:bg-ink-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white">
              <Stethoscope size={18} />
            </span>
            <span className="font-display text-lg font-bold text-ink-800 dark:text-ink-50">MediCare</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-400">
            A connected hospital management platform for patients, doctors and front-desk teams.
          </p>
        </div>

        <div>
          <p className="font-display text-sm font-semibold text-ink-800 dark:text-ink-50">Navigate</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
            <li><Link to="/about" className="hover:text-teal-600">About</Link></li>
            <li><Link to="/doctors" className="hover:text-teal-600">Doctors</Link></li>
            <li><Link to="/services" className="hover:text-teal-600">Services</Link></li>
            <li><Link to="/symptom-checker" className="hover:text-teal-600">Symptom Checker</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold text-ink-800 dark:text-ink-50">Account</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
            <li><Link to="/login" className="hover:text-teal-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-teal-600">Register</Link></li>
            <li><Link to="/contact" className="hover:text-teal-600">Contact Support</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm font-semibold text-ink-800 dark:text-ink-50">Reach us</p>
          <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
            <li className="flex items-center gap-2"><Phone size={15} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={15} /> care@medicare.app</li>
            <li className="flex items-center gap-2"><MapPin size={15} /> Chennai, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100 py-5 text-center text-xs text-ink-400 dark:border-ink-700">
        © {new Date().getFullYear()} MediCare SaaS. Built for portfolio & internship evaluation.
      </div>
    </footer>
  );
}
