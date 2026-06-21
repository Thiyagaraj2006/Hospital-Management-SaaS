import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 text-center dark:bg-ink-900">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500 text-white">
        <Stethoscope size={26} />
      </span>
      <h1 className="mt-6 font-display text-5xl font-bold text-ink-800 dark:text-ink-50">404</h1>
      <p className="mt-2 text-ink-400">This page took a wrong turn at the hospital corridor.</p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
