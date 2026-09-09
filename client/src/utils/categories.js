// Preset categories the user can pick from. Category is stored as a plain
// string on each task, so you can add more here freely.
export const CATEGORY_OPTIONS = [
  "General",
  "Work",
  "Personal",
  "Study",
  "Health",
  "Shopping",
  "Errands",
];

// Tailwind classes for each category's colored chip.
const STYLES = {
  General: "bg-slate-100 text-slate-600",
  Work: "bg-blue-100 text-blue-700",
  Personal: "bg-violet-100 text-violet-700",
  Study: "bg-amber-100 text-amber-700",
  Health: "bg-emerald-100 text-emerald-700",
  Shopping: "bg-pink-100 text-pink-700",
  Errands: "bg-cyan-100 text-cyan-700",
};

const FALLBACKS = [
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-fuchsia-100 text-fuchsia-700",
  "bg-lime-100 text-lime-700",
  "bg-rose-100 text-rose-700",
];

// Returns chip classes for any category, including custom ones (hashed
// deterministically so the same name always gets the same color).
export function categoryStyle(name = "General") {
  if (STYLES[name]) return STYLES[name];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return FALLBACKS[hash % FALLBACKS.length];
}
