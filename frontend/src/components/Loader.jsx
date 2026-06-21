export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-ink-400">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-teal-200 border-t-teal-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
