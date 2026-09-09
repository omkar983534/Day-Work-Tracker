import { useState } from "react";
import { categoryStyle } from "../utils/categories";

export default function TaskItem({ task, onToggle, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [busy, setBusy] = useState(false);

  const saveEdit = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === task.title) {
      setEditing(false);
      setDraft(task.title);
      return;
    }
    setBusy(true);
    try {
      await onUpdate(task._id, { title: trimmed });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") {
      setDraft(task.title);
      setEditing(false);
    }
  };

  return (
    <li className="group flex items-center gap-3 px-4 py-3 transition hover:bg-slate-50/70">
      {/* Toggle done */}
      <button
        onClick={() => onToggle(task._id)}
        aria-label={task.completed ? "Mark as not done" : "Mark as done"}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition ${
          task.completed
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 text-transparent hover:border-brand-400"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
          <path
            d="M6 12.5l3.5 3.5L18 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Title (or edit field) */}
      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            disabled={busy}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKey}
            className="input py-1.5"
          />
        ) : (
          <button
            onDoubleClick={() => setEditing(true)}
            className={`block w-full truncate text-left text-sm ${
              task.completed
                ? "text-slate-400 line-through"
                : "text-slate-800"
            }`}
            title="Double-click to edit"
          >
            {task.title}
          </button>
        )}
      </div>

      {/* Category chip */}
      <span className={`chip shrink-0 ${categoryStyle(task.category)}`}>
        {task.category}
      </span>

      {/* Row actions (appear on hover / focus) */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <button
          onClick={() => setEditing(true)}
          aria-label="Edit task"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" strokeLinecap="round" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(task._id)}
          aria-label="Delete task"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </li>
  );
}
