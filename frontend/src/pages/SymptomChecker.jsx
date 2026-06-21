import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Stethoscope } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";

// Lightweight keyword → department mapping. This runs entirely client-side
// as a simple triage hint, not a medical diagnosis.
const RULES = [
  { keywords: ["chest pain", "chest", "heart", "palpitation", "breathless"], department: "Cardiology" },
  { keywords: ["headache", "migraine", "dizziness", "seizure", "numbness"], department: "Neurology" },
  { keywords: ["skin", "rash", "acne", "itch", "eczema"], department: "Dermatology" },
  { keywords: ["joint pain", "joint", "knee", "back pain", "fracture", "bone"], department: "Orthopedics" },
  { keywords: ["child", "infant", "baby", "fever in child"], department: "Pediatrics" },
  { keywords: ["fever", "cold", "cough", "sore throat", "fatigue"], department: "General Medicine" },
];

function suggestDepartment(text) {
  const lower = text.toLowerCase();
  const match = RULES.find((rule) => rule.keywords.some((kw) => lower.includes(kw)));
  return match?.department || "General Medicine";
}

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);

  function handleCheck(e) {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setResult(suggestDepartment(symptoms));
  }

  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-200">
            <Sparkles size={13} /> AI Symptom Checker
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-ink-800 dark:text-ink-50 sm:text-4xl">
            Not sure which doctor to see?
          </h1>
          <p className="mt-3 text-ink-400">
            Describe what you're feeling and we'll point you to the right department. This is a quick
            triage hint, not a medical diagnosis.
          </p>
        </div>

        <form onSubmit={handleCheck} className="card mt-10">
          <label className="label-text" htmlFor="symptoms">Describe your symptoms</label>
          <textarea
            id="symptoms"
            rows={4}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="input-field"
            placeholder="e.g. I've had a sharp chest pain and shortness of breath since this morning..."
          />
          <button type="submit" className="btn-primary mt-4">
            Check symptoms
          </button>
        </form>

        {result && (
          <div className="card mt-6 border-teal-200 bg-teal-50/60 dark:border-teal-800 dark:bg-teal-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white">
                <Stethoscope size={22} />
              </div>
              <div>
                <p className="text-sm text-ink-400">Suggested department</p>
                <p className="font-display text-xl font-bold text-ink-800 dark:text-ink-50">{result}</p>
              </div>
            </div>
            <Link
              to={`/doctors?department=${encodeURIComponent(result)}`}
              className="btn-primary mt-5 inline-flex"
            >
              View {result} doctors <ArrowRight size={16} />
            </Link>
            <p className="mt-4 text-xs text-ink-400">
              This suggestion is generated from keyword matching and is not a substitute for professional
              medical advice. If this is an emergency, please contact emergency services immediately.
            </p>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
