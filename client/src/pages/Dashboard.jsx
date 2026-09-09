import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Filters from "../components/Filters";

// Time-of-day greeting
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const todayLabel = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("All");

  // Load all of the user's tasks once; filtering happens on the client
  // so the progress ring always reflects the full day.
  useEffect(() => {
    let active = true;
    api
      .get("/tasks")
      .then((res) => active && setTasks(res.data))
      .catch(() => active && setError("Could not load your tasks."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  // ----- CRUD helpers -----
  const createTask = async ({ title, category }) => {
    const res = await api.post("/tasks", { title, category });
    setTasks((prev) => [res.data, ...prev]);
  };

  const toggleTask = async (id) => {
    // optimistic flip, reconciled with the server response
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const res = await api.patch(`/tasks/${id}/toggle`);
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
    } catch {
      // revert on failure
      setTasks((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed: !t.completed } : t))
      );
    }
  };

  const updateTask = async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data);
    setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    const prev = tasks;
    setTasks((p) => p.filter((t) => t._id !== id)); // optimistic remove
    try {
      await api.delete(`/tasks/${id}`);
    } catch {
      setTasks(prev); // restore on failure
    }
  };

  // ----- Derived data -----
  const { total, done, percent } = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.completed).length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    return { total, done, percent };
  }, [tasks]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (status === "active" && t.completed) return false;
        if (status === "completed" && !t.completed) return false;
        if (category !== "All" && t.category !== category) return false;
        if (q) {
          const hay = `${t.title} ${t.notes || ""}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
  }, [tasks, search, status, category]);

  const hasFilters = search.trim() || status !== "all" || category !== "All";

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        {/* Greeting + progress — the signature block */}
        <section className="card animate-fade-in overflow-hidden p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-600">{todayLabel}</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {getGreeting()}, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {total === 0
                  ? "Nothing planned yet — add your first task below."
                  : done === total
                  ? "Everything's done. Enjoy the rest of your day!"
                  : `You've got ${total - done} task${
                      total - done === 1 ? "" : "s"
                    } left today.`}
              </p>
            </div>

            {/* Progress ring */}
            <div className="relative grid h-20 w-20 shrink-0 place-items-center">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(percent / 100) * 97.4} 97.4`}
                  className="transition-all duration-500"
                />
              </svg>
              <span className="absolute text-sm font-extrabold text-slate-800">
                {percent}%
              </span>
            </div>
          </div>

          {/* Linear progress bar */}
          <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {done} of {total} done
          </p>
        </section>

        {/* Add task */}
        <div className="mt-6">
          <TaskForm onCreate={createTask} />
        </div>

        {/* Filters */}
        <div className="mt-6">
          <Filters
            search={search}
            status={status}
            category={category}
            onSearch={setSearch}
            onStatus={setStatus}
            onCategory={setCategory}
          />
        </div>

        {/* List / states */}
        <div className="mt-4">
          {loading ? (
            <div className="card grid place-items-center gap-3 p-12 text-slate-400">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
              <p className="text-sm">Loading your tasks…</p>
            </div>
          ) : error ? (
            <div className="card p-8 text-center text-sm text-red-600">{error}</div>
          ) : filtered.length > 0 ? (
            <TaskList
              tasks={filtered}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ) : (
            <EmptyState hasFilters={hasFilters} />
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({ hasFilters }) {
  return (
    <div className="card grid place-items-center gap-3 p-12 text-center animate-pop-in">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="M8.5 12.5l2.2 2.2 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <p className="font-semibold text-slate-700">No tasks match your filters</p>
          <p className="max-w-xs text-sm text-slate-500">
            Try a different search or clear the filters to see everything.
          </p>
        </>
      ) : (
        <>
          <p className="font-semibold text-slate-700">Your day is a blank canvas</p>
          <p className="max-w-xs text-sm text-slate-500">
            Add your first task above and start ticking things off.
          </p>
        </>
      )}
    </div>
  );
}
