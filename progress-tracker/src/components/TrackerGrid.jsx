import { useEffect } from "react";
import "../styles/grid.css";

// Key habits that should be visually emphasized
const KEY_HABITS = ["Projects", "Core Skill"];

export default function TrackerGrid({ goals, days, data, setData }) {
  const today = new Date().getDate();

  const handleClick = (goal, day) => {
    // ALWAYS derive from current data (no prev callbacks)
    const nextMonthData = {
      ...data,
      [goal]: {
        ...(data[goal] || {}),
        [day]: data?.[goal]?.[day] ? 0 : 1
      }
    };

    setData(nextMonthData);
  };

  // Keyboard shortcuts: 1-7 to toggle today's completion for each habit
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if user isn't typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const key = parseInt(e.key);
      if (key >= 1 && key <= goals.length) {
        e.preventDefault();
        const goalIndex = key - 1;
        const goal = goals[goalIndex];
        handleClick(goal, today);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [goals, today, data, setData]);

  return (
    <div>
      <div className="grid-legend">
        <div className="legend-item">
          <div className="legend-color legend-done"></div>
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <div className="legend-color legend-empty"></div>
          <span>Not done</span>
        </div>
        <div className="legend-item">
          <span className="legend-emoji">⭐</span>
          <span>High-focus day</span>
        </div>
        <div className="legend-item">
          <span className="legend-emoji">🔥</span>
          <span>Streak day</span>
        </div>
      </div>
      <div className="grid-wrapper">
        <table className="tracker-grid">
        <thead>
          {/* WEEK LABELS ROW */}
          <tr className="week-labels-row">
            <th className="week-label-cell"></th>
            {Array.from({ length: Math.ceil(days / 7) }).map((_, weekIdx) => {
              const weekStart = weekIdx * 7 + 1;
              const weekEnd = Math.min((weekIdx + 1) * 7, days);
              const daysInWeek = weekEnd - weekStart + 1;
              return (
                <th key={`week-${weekIdx}`} colSpan={daysInWeek} className="week-header-cell">
                  Week {weekIdx + 1}
                </th>
              );
            })}
          </tr>

          {/* DAY NAMES ROW */}
          <tr className="day-names-row">
            <th></th>
            {Array.from({ length: days }, (_, i) => i + 1).map(day => {
              const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
              const dayOfWeek = dayNames[(day - 1) % 7];
              return (
                <th key={`dayname-${day}`} className="day-name-cell">{dayOfWeek}</th>
              );
            })}
          </tr>

          {/* DAY NUMBERS ROW */}
          <tr>
            <th>Goal</th>
            {Array.from({ length: days }, (_, i) => i + 1).map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {goals.map(goal => {
            const isKeyHabit = KEY_HABITS.some(k => goal.toLowerCase().includes(k.toLowerCase()));
            
            // Calculate completion percentage for this goal
            let completedDays = 0;
            for (let d = 1; d <= days; d++) {
              if (data?.[goal]?.[d]) completedDays++;
            }
            const completionPercent = days > 0 ? Math.round((completedDays / days) * 100) : 0;
            
            return (
              <tr key={goal}>
                <td className={`goal-name ${isKeyHabit ? "key-habit" : ""}`}>{goal}</td>

                {Array.from({ length: days }, (_, i) => i + 1).map(day => (
                  <td
                    key={day}
                    className={`cell ${
                      data?.[goal]?.[day] ? "done" : ""
                    } ${day === today ? "today-column" : ""}`}
                    onClick={() => handleClick(goal, day)}
                  />
                ))}
                
                {/* COMPLETION RING */}
                <td className="completion-ring-cell">
                  <div className="completion-ring">
                    <svg viewBox="0 0 40 40" width="40" height="40">
                      <circle cx="20" cy="20" r="18" className="ring-bg" />
                      <circle 
                        cx="20" 
                        cy="20" 
                        r="18" 
                        className="ring-fill" 
                        style={{
                          strokeDashoffset: 113.1 * (1 - completionPercent / 100)
                        }}
                      />
                    </svg>
                    <div className="ring-percent">{completionPercent}%</div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>

      {/* PROGRESS TRACKING TABLE */}
      <div className="progress-tracking-section">
        <div className="grid-wrapper">
          <table className="tracker-grid progress-table">
            <tbody>
              {/* COMPLETION % ROW */}
              <tr>
                <td className="metric-name">%</td>
                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  let completed = 0;
                  goals.forEach(goal => {
                    if (data?.[goal]?.[day]) completed++;
                  });
                  const percentage = goals.length ? Math.round((completed / goals.length) * 100) : 0;
                  return (
                    <td key={`pct-${day}`} className="metric-cell percentage-cell">
                      {percentage}%
                    </td>
                  );
                })}
                <td className="completion-ring-placeholder"></td>
              </tr>

              {/* DONE ROW */}
              <tr>
                <td className="metric-name">✓</td>
                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  let completed = 0;
                  goals.forEach(goal => {
                    if (data?.[goal]?.[day]) completed++;
                  });
                  return (
                    <td key={`done-${day}`} className="metric-cell done-count-cell">
                      {completed}
                    </td>
                  );
                })}
                <td className="completion-ring-placeholder"></td>
              </tr>

              {/* NOT DONE ROW */}
              <tr>
                <td className="metric-name">✗</td>
                {Array.from({ length: days }, (_, i) => i + 1).map(day => {
                  let completed = 0;
                  goals.forEach(goal => {
                    if (data?.[goal]?.[day]) completed++;
                  });
                  const notDone = goals.length - completed;
                  return (
                    <td key={`notdone-${day}`} className="metric-cell notdone-count-cell">
                      {notDone}
                    </td>
                  );
                })}
                <td className="completion-ring-placeholder"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* KEYBOARD SHORTCUTS HINT */}
      <div className="keyboard-hint">
        💡 Pro tip: Press <strong>1–{goals.length}</strong> to toggle today's tasks
      </div>
    </div>
  );
}
