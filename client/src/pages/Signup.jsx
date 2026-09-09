import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not create account. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning your day in under a minute."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-pop-in"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="input"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="input"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="6+ characters"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Confirm
            </label>
            <input
              id="confirm"
              name="confirm"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={handleChange}
              placeholder="Repeat password"
              className="input"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          <input
            type="checkbox"
            checked={showPass}
            onChange={() => setShowPass((s) => !s)}
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          />
          Show password
        </label>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
