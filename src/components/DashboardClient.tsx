"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Category, Expense } from "@/lib/types";
import CalendarGrid from "@/components/CalendarGrid";
import DayPanel from "@/components/DayPanel";
import BurnMeter from "@/components/BurnMeter";
import SettingsBar from "@/components/SettingsBar";
import ReminderSetup from "@/components/ReminderSetup";

const todayStr = new Date().toISOString().slice(0, 10);

export default function DashboardClient({ username }: { username: string }) {
  const router = useRouter();
  const [view, setView] = useState(new Date());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [reminderTime, setReminderTime] = useState("20:00");
  const [loading, setLoading] = useState(true);

  const monthKey = `${view.getFullYear()}-${String(view.getMonth() + 1).padStart(2, "0")}`;

  const loadExpenses = useCallback(async () => {
    const res = await fetch(`/api/expenses?month=${monthKey}`);
    const data = await res.json();
    setExpenses(data.expenses || []);
  }, [monthKey]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: show a loader while the month's data refetches
    setLoading(true);
    loadExpenses().finally(() => setLoading(false));
  }, [loadExpenses]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setDailyBudget(Number(d.settings.daily_budget) || 0);
          setReminderTime(d.settings.reminder_time || "20:00");
        }
      });
  }, []);

  async function handleAddExpense(amount: number, categoryId: string, note: string) {
    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, categoryId, note, spentOn: selectedDate }),
    });
    loadExpenses();
  }

  async function handleDeleteExpense(id: string) {
    await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    loadExpenses();
  }

  async function handleSaveSettings(budget: number, time: string) {
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyBudget: budget, reminderTime: time }),
    });
    setDailyBudget(budget);
    setReminderTime(time);
  }

  async function handleAddCategory(name: string) {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (data.category) setCategories((c) => [...c, data.category]);
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const monthTotal = expenses.reduce((s, e) => s + Number(e.amount), 0);

  const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    const name = e.categories?.name || "Other";
    acc[name] = (acc[name] || 0) + Number(e.amount);
    return acc;
  }, {});
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  function changeMonth(delta: number) {
    setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 md:px-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">Welcome back,</p>
          <h1 className="display text-xl font-semibold text-text">{username}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ReminderSetup reminderTime={reminderTime} />
          <SettingsBar
            dailyBudget={dailyBudget}
            reminderTime={reminderTime}
            onSaveSettings={handleSaveSettings}
            onAddCategory={handleAddCategory}
          />
          <button
            onClick={handleLogout}
            className="rounded-full border border-border px-4 py-1.5 text-xs text-muted transition hover:text-danger hover:border-danger"
          >
            Log out
          </button>
        </div>
      </header>

      <section className="rounded-2xl border border-border bg-surface p-5">
        <BurnMeter spent={monthTotal} budget={dailyBudget} />
        {topCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topCategories.map(([name, total]) => (
              <span
                key={name}
                className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted"
              >
                {name} · ₹{total.toLocaleString("en-IN")}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={() => changeMonth(-1)} className="text-muted hover:text-text">
              ←
            </button>
            <h2 className="display text-base font-medium text-text">
              {view.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </h2>
            <button onClick={() => changeMonth(1)} className="text-muted hover:text-text">
              →
            </button>
          </div>
          {loading ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : (
            <CalendarGrid
              year={view.getFullYear()}
              month={view.getMonth()}
              expenses={expenses}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
        </div>

        <DayPanel
          date={selectedDate}
          expenses={expenses}
          categories={categories}
          onAdd={handleAddExpense}
          onDelete={handleDeleteExpense}
        />
      </section>
    </div>
  );
}
