import Logo from "./Logo";

// Split-screen shell shared by the Login and Signup pages.
// Left: a brand panel that previews the "plan your day" idea.
// Right: whatever form is passed in as children.
export default function AuthLayout({ title, subtitle, children }) {
  const sample = [
    { text: "Morning workout", done: true },
    { text: "Finish project proposal", done: true },
    { text: "Reply to Sara's email", done: false },
    { text: "Grocery run after 6pm", done: false },
  ];

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand / preview panel */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-violet-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative">
          <Logo />
        </div>

        <div className="relative">
          <h2 className="max-w-sm text-3xl font-extrabold leading-tight">
            Plan your whole day, then tick it off.
          </h2>
          <p className="mt-3 max-w-sm text-brand-100">
            Jot down everything you need to do, sort it by category, and watch
            your day fill up with done.
          </p>

          {/* Little preview card — the signature element */}
          <div className="mt-8 w-full max-w-sm rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20">
            <div className="mb-3 flex items-center justify-between text-sm font-semibold">
              <span>Today</span>
              <span className="text-brand-100">2 of 4 done</span>
            </div>
            <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-1/2 rounded-full bg-white" />
            </div>
            <ul className="space-y-2.5">
              {sample.map((t) => (
                <li key={t.text} className="flex items-center gap-3 text-sm">
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-md ${
                      t.done ? "bg-white text-brand-600" : "ring-1 ring-white/40"
                    }`}
                  >
                    {t.done && (
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
                    )}
                  </span>
                  <span className={t.done ? "text-brand-100 line-through" : ""}>
                    {t.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="relative text-sm text-brand-100">
          Your tasks are private to your account.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
