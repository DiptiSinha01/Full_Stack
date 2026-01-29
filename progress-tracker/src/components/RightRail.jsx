import { useState, useEffect } from "react";
import MonthCardExport from "./MonthCardExport";

export default function RightRail({
  monthData,
  goals,
  yearData,
  activeMonth,
  currentDay,
  theme,
  MONTHS_2026,
  lifePhase,
  reflections = {},
  setReflections = () => {},
  currentView = "today",
  onClose = () => {}
}) {
  const [showMetrics, setShowMetrics] = useState(false);
  const [todayNote, setTodayNote] = useState("");
  const [todayMood, setTodayMood] = useState("");
  const [isEditingToday, setIsEditingToday] = useState(false);

  // Load today's reflection
  useEffect(() => {
    const today = `${activeMonth}-${String(currentDay).padStart(2, '0')}`;
    const todayData = reflections[today];
    if (todayData) {
      setTodayNote(todayData.text || "");
      setTodayMood(todayData.mood || "");
    } else {
      setTodayNote("");
      setTodayMood("");
    }
  }, [currentDay, activeMonth, reflections]);

  // Save today's reflection
  const saveReflection = () => {
    if (!todayNote.trim() && !todayMood) {
      setIsEditingToday(false);
      return;
    }

    const today = `${activeMonth}-${String(currentDay).padStart(2, '0')}`;
    setReflections(prev => ({
      ...prev,
      [today]: {
        text: todayNote.trim(),
        mood: todayMood,
        timestamp: new Date().toISOString()
      }
    }));
    setIsEditingToday(false);
  };

  /* ========== CALCULATIONS ========== */

  // Calculate weekly trends
  const calculateWeeklyTrends = () => {
    const weeks = {};
    const days = currentDay;

    for (let d = 1; d <= days; d++) {
      const week = Math.ceil(d / 7);
      if (!weeks[week]) weeks[week] = { week, completed: 0, total: 0 };

      goals.forEach(goal => {
        weeks[week].total++;
        if (monthData?.[goal]?.[d]) weeks[week].completed++;
      });
    }

    return Object.values(weeks)
      .map(w => ({
        ...w,
        percent: Math.round((w.completed / (w.total || 1)) * 100)
      }))
      .slice(0, -1); // Remove current incomplete week
  };

  // Find best and worst days
  const calculateBestWorstDays = () => {
    const dayScores = {};

    for (let d = 1; d <= currentDay; d++) {
      let completed = 0;
      goals.forEach(goal => {
        if (monthData?.[goal]?.[d]) completed++;
      });
      dayScores[d] = {
        day: d,
        completed,
        dayName: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(2026, 0, d).getDay()]
      };
    }

    const sorted = Object.values(dayScores).sort((a, b) => b.completed - a.completed);
    return {
      best: sorted[0],
      worst: sorted[sorted.length - 1]
    };
  };

  // Calculate XP breakdown
  const calculateXPBreakdown = () => {
    const breakdown = {};
    goals.forEach(goal => {
      let xp = 0;
      for (let d = 1; d <= currentDay; d++) {
        if (monthData?.[goal]?.[d]) xp += 10;
      }
      breakdown[goal] = xp;
    });
    return breakdown;
  };

  // Calculate total XP across all months
  const calculateTotalXP = () => {
    let totalXP = 0;
    Object.values(yearData).forEach(mData => {
      Object.values(mData).forEach(goalData => {
        Object.values(goalData).forEach(completed => {
          if (completed) totalXP += 10;
        });
      });
    });
    return totalXP;
  };

  // Get past reflections (last 5 entries before today)
  const getPastReflections = () => {
    const allReflections = Object.entries(reflections)
      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
      .slice(1, 6); // Skip today, get next 5
    return allReflections;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const [month, day] = dateStr.split('-');
    const monthIndex = Object.values(MONTHS_2026).indexOf(activeMonth);
    const date = new Date(2026, monthIndex, parseInt(day));
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
    return `${dayName} ${day}`;
  };

  // Get mood emoji
  const getMoodEmoji = (mood) => {
    const moods = {
      'fire': '🔥',
      'neutral': '😐',
      'tired': '😓'
    };
    return moods[mood] || '😐';
  };

  const weeklyTrends = calculateWeeklyTrends();
  const { best, worst } = calculateBestWorstDays();
  const xpBreakdown = calculateXPBreakdown();
  const totalXP = calculateTotalXP();
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const pastReflections = getPastReflections();

  return (
    <div className="right-rail">
      {/* CLOSE BUTTON */}
      <button className="rail-close-btn" onClick={onClose} title="Close right panel">
        ✕
      </button>
      {/* WEEKLY TRENDS */}
      <div className="rail-section">
        <div className="rail-label">WEEKLY TRENDS</div>
        <div className="weekly-trend-cards">
          {weeklyTrends.map(w => (
            <div key={w.week} className="trend-card">
              <div className="trend-week">W{w.week}</div>
              <div className={`trend-percent ${w.percent === 100 ? 'perfect' : w.percent >= 70 ? 'strong' : 'needs-work'}`}>
                {w.percent}%
              </div>
              <div className="trend-detail">{w.completed}/{w.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BEST / WORST DAYS */}
      <div className="rail-section">
        <div className="rail-label">BEST vs WORST</div>
        <div className="best-worst-container">
          {best && (
            <div className="best-day">
              <div className="bw-label">🏆 Best Day</div>
              <div className="bw-content">
                <div className="bw-day">{best.dayName} {best.day}</div>
                <div className="bw-score">{best.completed}/{goals.length} goals</div>
              </div>
            </div>
          )}
          {worst && (
            <div className="worst-day">
              <div className="bw-label">📉 Tough Day</div>
              <div className="bw-content">
                <div className="bw-day">{worst.dayName} {worst.day}</div>
                <div className="bw-score">{worst.completed}/{goals.length} goals</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* XP BREAKDOWN */}
      <div className="rail-section">
        <div className="rail-label">XP BREAKDOWN</div>
        <div className="xp-breakdown">
          {goals.map(goal => {
            const xp = xpBreakdown[goal] || 0;
            const percent = goals.length > 0 ? Math.round((xp / Object.values(xpBreakdown).reduce((a, b) => a + b, 1)) * 100) : 0;
            return (
              <div key={goal} className="xp-item">
                <div className="xp-label">{goal}</div>
                <div className="xp-bar">
                  <div className="xp-fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="xp-amount">{xp} XP</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADVANCED METRICS - COLLAPSIBLE */}
      <div className="rail-section">
        <button
          className="rail-label collapsible-btn"
          onClick={() => setShowMetrics(!showMetrics)}
        >
          ADVANCED METRICS {showMetrics ? '▼' : '▶'}
        </button>
        {showMetrics && (
          <div className="metrics-content">
            <div className="metric-item">
              <div className="metric-label">Total XP</div>
              <div className="metric-value">{totalXP}</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Current Level</div>
              <div className="metric-value">{currentLevel}</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Days Tracked</div>
              <div className="metric-value">{currentDay}</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Avg. Completion</div>
              <div className="metric-value">
                {goals.length > 0 
                  ? Math.round(
                      Object.values(xpBreakdown).reduce((a, b) => a + b, 0) / 
                      (goals.length * currentDay * 10) * 100
                    )
                  : 0
                }%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MONTH CARD EXPORT */}
      <div className="rail-section">
        <MonthCardExport
          yearData={yearData}
          goals={goals}
          activeMonth={activeMonth}
          MONTHS_2026={MONTHS_2026}
          reflections={reflections}
          theme={theme}
        />
      </div>

      {/* REFLECTION SECTION */}
      {currentView === "today" && (
        <div className="rail-section reflection-section">
          <div className="rail-label">TODAY'S REFLECTION</div>
          
          {!isEditingToday ? (
            // Display Mode
            <div className="reflection-display">
              {todayNote || todayMood ? (
                <>
                  {todayMood && (
                    <div className="reflection-mood-badge">
                      {getMoodEmoji(todayMood)} {todayMood.charAt(0).toUpperCase() + todayMood.slice(1)}
                    </div>
                  )}
                  {todayNote && (
                    <div className="reflection-note-display">{todayNote}</div>
                  )}
                  <button
                    className="reflection-edit-btn"
                    onClick={() => setIsEditingToday(true)}
                  >
                    Edit
                  </button>
                </>
              ) : (
                <button
                  className="reflection-add-btn"
                  onClick={() => setIsEditingToday(true)}
                >
                  + Add reflection
                </button>
              )}
            </div>
          ) : (
            // Edit Mode
            <div className="reflection-edit">
              <textarea
                className="reflection-textarea"
                value={todayNote}
                onChange={(e) => setTodayNote(e.target.value.slice(0, 300))}
                placeholder="How did today go? What did you learn?"
                maxLength="300"
              />
              <div className="reflection-char-count">
                {todayNote.length}/300
              </div>

              <div className="reflection-mood-selector">
                <div className="mood-label">Mood:</div>
                <div className="mood-buttons">
                  {['fire', 'neutral', 'tired'].map(mood => (
                    <button
                      key={mood}
                      className={`mood-btn ${todayMood === mood ? 'active' : ''}`}
                      onClick={() => setTodayMood(todayMood === mood ? '' : mood)}
                      title={mood.charAt(0).toUpperCase() + mood.slice(1)}
                    >
                      {getMoodEmoji(mood)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="reflection-actions">
                <button
                  className="reflection-save-btn"
                  onClick={saveReflection}
                >
                  Save
                </button>
                <button
                  className="reflection-cancel-btn"
                  onClick={() => setIsEditingToday(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Past Reflections */}
          {pastReflections.length > 0 && (
            <div className="past-reflections">
              <div className="past-reflections-label">Recent Notes</div>
              {pastReflections.map(([date, data]) => (
                <div key={date} className="past-reflection-item">
                  <div className="past-reflection-header">
                    <span className="past-reflection-date">{formatDate(date)}</span>
                    {data.mood && (
                      <span className="past-reflection-mood">{getMoodEmoji(data.mood)}</span>
                    )}
                  </div>
                  {data.text && (
                    <div className="past-reflection-text">{data.text}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* YEAR IN REVIEW - Now handled by ViewToggle in header */}
    </div>
  );
}
