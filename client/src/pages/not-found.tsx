import { useLocation } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto text-center">
      <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
      <p className="text-muted-foreground mb-6">This page doesn't exist. Let's get you back home.</p>
      <button
        onClick={() => setLocation("/")}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
      >
        <Home className="w-4 h-4" />
        Go Home
      </button>
    </div>
  );
}
