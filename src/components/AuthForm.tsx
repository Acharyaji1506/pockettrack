"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-2xl shadow-black/40">
      <div className="mb-6 flex rounded-full bg-surface-2 p-1">
        {(["signup", "login"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              mode === m ? "bg-accent text-bg" : "text-muted hover:text-text"
            }`}
          >
            {m === "signup" ? "Create account" : "Log in"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            autoComplete="username"
            placeholder="e.g. jatin_a"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="At least 6 characters"
            className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 rounded-lg bg-accent py-2.5 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Please wait…" : mode === "signup" ? "Start tracking" : "Log in"}
        </button>
      </form>
    </div>
  );
}
