"use client";

import { useState } from "react";

export default function SettingsBar({
  dailyBudget,
  reminderTime,
  onSaveSettings,
  onAddCategory,
}: {
  dailyBudget: number;
  reminderTime: string;
  onSaveSettings: (budget: number, time: string) => void;
  onAddCategory: (name: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [budget, setBudget] = useState(String(dailyBudget || ""));
  const [time, setTime] = useState(reminderTime);
  const [newCategory, setNewCategory] = useState("");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-full border border-border bg-surface-2 px-4 py-1.5 text-xs text-muted transition hover:text-text"
      >
        Settings
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-2xl">
          <p className="mb-1 text-xs text-muted">Monthly budget (₹)</p>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 8000"
            className="mb-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm outline-none focus:border-accent"
          />
          <p className="mb-1 text-xs text-muted">Daily reminder time</p>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mb-3 w-full rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm outline-none focus:border-accent"
          />
          <button
            onClick={() => {
              onSaveSettings(Number(budget) || 0, time);
              setOpen(false);
            }}
            className="mb-4 w-full rounded-lg bg-accent py-1.5 text-sm font-semibold text-bg"
          >
            Save
          </button>

          <p className="mb-1 text-xs text-muted">Add a category</p>
          <div className="flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Gym"
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm outline-none focus:border-accent"
            />
            <button
              onClick={() => {
                if (!newCategory.trim()) return;
                onAddCategory(newCategory.trim());
                setNewCategory("");
              }}
              className="rounded-lg border border-border px-3 text-sm text-teal hover:border-teal"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
