export default function MonthSwitcher({ months, active, setActive, variant = "default" }) {
  const isCompact = variant === "compact";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: isCompact ? "repeat(3, 1fr)" : "repeat(auto-fit, minmax(45px, 1fr))",
        gap: isCompact ? "4px" : "6px"
      }}
    >
      {months.map(m => (
        <button
          key={m.key}
          onClick={() => setActive(m.key)}
          style={{
            padding: isCompact ? "6px 8px" : "6px 12px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: active === m.key ? "var(--primary)" : "var(--card)",
            color: active === m.key ? "#ffffff" : "var(--text-primary)",
            cursor: "pointer",
            fontSize: isCompact ? "11px" : "13px",
            fontWeight: 500,
            transition: "all 0.2s ease"
          }}
          title={m.label}
        >
          {isCompact ? m.label.slice(0, 1) : m.label}
        </button>
      ))}
    </div>
  );
}
