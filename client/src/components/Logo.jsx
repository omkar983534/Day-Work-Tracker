// Reusable brand mark: a gradient rounded square with a check, plus the wordmark.
export default function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 shadow-float">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M6 12.5l3.5 3.5L18 7"
            fill="none"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="text-xl font-extrabold tracking-tight text-slate-900">
          Dayly
        </span>
      )}
    </span>
  );
}
