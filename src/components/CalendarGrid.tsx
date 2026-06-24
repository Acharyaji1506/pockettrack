import { Expense } from "@/lib/types";

export default function CalendarGrid({
  year,
  month, // 0-indexed
  expenses,
  selectedDate,
  onSelectDate,
}: {
  year: number;
  month: number;
  expenses: Expense[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().slice(0, 10);

  const totalsByDay: Record<string, number> = {};
  for (const exp of expenses) {
    totalsByDay[exp.spent_on] = (totalsByDay[exp.spent_on] || 0) + Number(exp.amount);
  }

  const cells: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs text-muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
          const total = totalsByDay[dateStr];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(dateStr)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-xs transition ${
                isSelected
                  ? "border-accent bg-accent/10 text-text"
                  : isToday
                  ? "border-teal/60 bg-surface-2 text-text"
                  : "border-border bg-surface-2/60 text-muted hover:border-accent/50"
              }`}
            >
              <span className="font-medium">{day}</span>
              {total ? (
                <span className="mt-0.5 text-[10px] text-accent">
                  ₹{total >= 1000 ? `${(total / 1000).toFixed(1)}k` : total}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
