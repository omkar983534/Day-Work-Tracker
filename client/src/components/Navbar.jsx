import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();

  // First name + initials for the avatar
  const firstName = user?.name?.split(" ")[0] || "there";
  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {initials}
            </span>
            <span className="hidden text-sm font-semibold text-slate-700 sm:block">
              {firstName}
            </span>
          </div>
          <button
            onClick={logout}
            className="btn-ghost px-3 py-2 text-xs"
            title="Log out"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
