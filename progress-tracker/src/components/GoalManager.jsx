import { useState } from "react";

export default function GoalManager({ goals, setGoals }) {
  const [value, setValue] = useState("");

  function addGoal() {
    if (!value.trim()) return;
    if (goals.includes(value.trim())) return;

    setGoals([...goals, value.trim()]);
    setValue("");
  }

  function removeGoal(goal) {
    setGoals(goals.filter(g => g !== goal));
  }

  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Add goal (e.g. DSA, Gym)"
        style={{
          padding: "6px 10px",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          fontSize: "13px",
          width: "200px"
        }}
      />

      <button
        onClick={addGoal}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "none",
          background: "var(--primary)",
          color: "#fff",
          cursor: "pointer",
          fontSize: "13px"
        }}
      >
        Add
      </button>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {goals.map(goal => (
          <span className="goal-chip"
            key={goal}
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-primary)"
            }}
          >
            {goal}
            <span
              onClick={() => removeGoal(goal)}
              style={{
                cursor: "pointer",
                color: "var(--text-muted)"
              }}
            >
              ✕
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
