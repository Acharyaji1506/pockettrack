"use client";

import { useState } from "react";
import { Category, Expense } from "@/lib/types";

export default function DayPanel({
  date,
  expenses,
  categories,
  onAdd,
  onDelete,
}: {
  date: string;
  expenses: Expense[];
  categories: Category[];
  onAdd: (amount: number, categoryId: string, note: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const dayExpenses = expenses.filter((e) => e.spent_on === date);
  const dayTotal = dayExpenses.reduce((s, e) => s + Number(e.amount), 0);

  const prettyDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setSaving(true);
    await onAdd(Number(amount), categoryId, note);
    setAmount("");
    setNote("");
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between">
        <h3 className="display text-lg font-medium text-text">{prettyDate}</h3>
        <span className="text-sm text-accent">₹{dayTotal.toLocaleString("en-IN")}</span>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            type="number"
            inputMode="decimal"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount (₹)"
            required
            className="w-28 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What was it for? (optional)"
          className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-accent py-2 text-sm font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Adding…" : "Add expense"}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {dayExpenses.length === 0 && (
          <p className="text-sm text-muted">Nothing logged for this day yet.</p>
        )}
        {dayExpenses.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm"
          >
            <div>
              <span className="text-text">₹{Number(exp.amount).toLocaleString("en-IN")}</span>
              <span className="ml-2 text-muted">{exp.categories?.name || "Other"}</span>
              {exp.note && <span className="ml-2 text-muted">· {exp.note}</span>}
            </div>
            <button
              onClick={() => onDelete(exp.id)}
              aria-label="Delete expense"
              className="text-muted transition hover:text-danger"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
