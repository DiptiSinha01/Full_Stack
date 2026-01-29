import { useState } from "react";
import MonthSwitcher from "./MonthSwitcher";

export default function LeftRail({ 
  theme, 
  setTheme, 
  activeMonth, 
  setActiveMonth, 
  MONTHS_2026,
  lifePhase,
  streak,
  level,
  totalXP,
  currentDay,
  goals = [],
  setGoals = () => {}
}) {
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  const xpForLevel = (level - 1) * 500;

  const addGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal("");
      setShowGoalInput(false);
    }
  };

  const removeGoal = (index) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  return (
    <div className="left-rail">
      {/* LOGO & APP NAME */}
      <div className="rail-section rail-header">
        <div className="app-logo">⚡</div>
        <div className="app-name">Progress OS</div>
      </div>

      {/* TODAY'S DATE */}
      <div className="rail-section">
        <div className="rail-label">TODAY</div>
        <div className="rail-date">{dateStr}</div>
      </div>

      {/* CURRENT PHASE */}
      <div className="rail-section">
        <div className="rail-label">PHASE</div>
        <div className="rail-phase">
          {lifePhase === "Placement grind" && <span className="phase-icon">🚀</span>}
          {lifePhase === "Skill building" && <span className="phase-icon">🔨</span>}
          {lifePhase === "Recovery phase" && <span className="phase-icon">🌿</span>}
          <span className="phase-text">{lifePhase}</span>
        </div>
      </div>

      {/* STREAK */}
      <div className="rail-section">
        <div className="rail-label">STREAK</div>
        <div className="rail-streak">
          <span className="flame-flicker">🔥</span>
          <span className="streak-num">{streak}</span>
          <span className="streak-label">days</span>
        </div>
      </div>

      {/* LEVEL & XP */}
      <div className="rail-section">
        <div className="rail-label">LEVEL</div>
        <div className="rail-level">
          <div className="level-badge">{level}</div>
        </div>
        <div className="rail-xp">
          <div className="xp-bar">
            <div 
              className="xp-bar-fill"
              style={{
                width: `${((totalXP - xpForLevel) / 500) * 100}%`
              }}
            />
          </div>
          <div className="xp-text">{totalXP - xpForLevel} / 500 XP</div>
        </div>
      </div>

      {/* MONTH SELECTOR */}
      <div className="rail-section rail-month">
        <div className="rail-label">MONTH</div>
        <MonthSwitcher
          months={MONTHS_2026}
          active={activeMonth}
          setActive={setActiveMonth}
          variant="compact"
        />
      </div>

      {/* GOALS MANAGER */}
      <div className="rail-section rail-goals">
        <div className="rail-label">GOALS</div>
        <div className="goals-list">
          {goals.map((goal, idx) => (
            <div key={idx} className="goal-item">
              <span className="goal-text">{goal}</span>
              <button
                className="goal-remove"
                onClick={() => removeGoal(idx)}
                title="Remove goal"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {showGoalInput ? (
          <div className="goal-input-form">
            <input
              type="text"
              className="goal-input"
              placeholder="Enter new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") addGoal();
              }}
              autoFocus
            />
            <div className="goal-form-actions">
              <button className="goal-add-btn" onClick={addGoal}>
                ✓
              </button>
              <button
                className="goal-cancel-btn"
                onClick={() => {
                  setShowGoalInput(false);
                  setNewGoal("");
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button
            className="goal-add-trigger"
            onClick={() => setShowGoalInput(true)}
          >
            + Add Goal
          </button>
        )}
      </div>

      {/* THEME TOGGLE */}
      <div className="rail-section rail-footer">
        <button
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
          className="theme-btn-rail"
        >
          {theme === "light" ? "🌙" : "☀️"}
          <span className="theme-label">
            {theme === "light" ? "Dark" : "Light"}
          </span>
        </button>
      </div>
    </div>
  );
}
