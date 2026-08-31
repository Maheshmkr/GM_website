import { useState } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Heart, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { getSession } from "@/lib/auth-client";

export const Route = createFileRoute("/login")({
  loader: async ({ request }) => {
    const { role } = await getSession(request);
    if (role === "admin") {
      throw redirect({ to: "/admin" });
    }
    if (role === "user") {
      throw redirect({ to: "/" });
    }
    return {};
  },
  component: LoginComponent,
});

function LoginComponent() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Please enter a password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Welcome back 💖");
        router.invalidate(); // Refetch root loader to update session state
        
        // Redirect based on role returned
        if (data.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
      } else {
        toast.error(data.error || "Incorrect password");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Background Hearts decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <Heart
            key={i}
            className="animate-float-up absolute bottom-0 size-6 text-primary/10"
            fill="currentColor"
            style={{
              left: `${15 + i * 20}%`,
              animationDuration: `${12 + i * 3}s`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md glass rounded-[32px] p-8 sm:p-10 border border-border shadow-2xl relative z-10 animate-letter-open text-center space-y-8">
        <div className="flex flex-col items-center">
          <div className="size-16 rounded-3xl bg-[var(--gradient-love)] text-primary-foreground grid place-items-center shadow-lg animate-pulse">
            <Heart className="size-8" fill="currentColor" />
          </div>
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display">
            Our Love Story
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter password to unlock our shared memories
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
              <Lock className="size-4" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full pl-11 pr-4 py-3.5 text-sm bg-surface/30 border border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold btn-love shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
          >
            {loading ? "Unlocking..." : "Unlock Story"}
            {!loading && <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="text-xs text-muted-foreground">
          Made with love, forever and always.
        </p>
      </div>
    </div>
  );
}
