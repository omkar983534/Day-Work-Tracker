import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps private pages. Sends signed-out users to /login and shows a
// lightweight loader while we verify an existing session.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
