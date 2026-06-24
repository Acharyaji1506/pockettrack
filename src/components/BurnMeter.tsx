export default function BurnMeter({
  spent,
  budget,
}: {
  spent: number;
  budget: number;
}) {
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const isOver = budget > 0 && spent > budget;

  return (
    <div className="flex items-center gap-5">
      <svg width="128" height="128" viewBox="0 0 128 128" className="-rotate-90">
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="10"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke={isOver ? "var(--danger)" : "var(--accent)"}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.6s ease, stroke 0.3s ease",
            filter: `drop-shadow(0 0 6px ${isOver ? "var(--danger)" : "var(--accent)"})`,
          }}
        />
      </svg>
      <div>
        <p className="display text-3xl font-semibold text-text">
          ₹{spent.toLocaleString("en-IN")}
        </p>
        <p className="text-sm text-muted">
          {budget > 0
            ? `of ₹${budget.toLocaleString("en-IN")} budget spent`
            : "spent this month"}
        </p>
        {budget > 0 && (
          <p className={`mt-1 text-xs ${isOver ? "text-danger" : "text-teal"}`}>
            {isOver ? "Over budget" : `${pct}% used`}
          </p>
        )}
      </div>
    </div>
  );
}
