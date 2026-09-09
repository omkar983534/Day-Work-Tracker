import { useState } from "react";
import { CATEGORY_OPTIONS } from "../utils/categories";

// Quick-add composer: type a task, pick a category, hit Add.
export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    setSaving(true);
    try {
      await onCreate({ title: trimmed, category });
      setTitle(""); // keep the chosen category for fast repeated entry
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-3 p-3 sm:flex-row sm:items-center"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do today?"
        className="input border-transparent bg-slate-50 shadow-none focus:bg-white"
        aria-label="Task title"
      />
      <div className="flex items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input w-auto border-transparent bg-slate-50 shadow-none focus:bg-white"
          aria-label="Category"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="btn-primary whitespace-nowrap"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
              d="M12 5v14M5 12h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          Add
        </button>
      </div>
    </form>
  );
}
