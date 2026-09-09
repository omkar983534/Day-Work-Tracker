import { CATEGORY_OPTIONS } from "../utils/categories";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Done" },
];

export default function Filters({
  search,
  status,
  category,
  onSearch,
  onStatus,
  onCategory,
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative flex-1">
        <svg
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search tasks…"
          className="input pl-10"
          aria-label="Search tasks"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Status segmented control */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => onStatus(t.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                status === t.key
                  ? "bg-brand-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="input w-auto"
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
