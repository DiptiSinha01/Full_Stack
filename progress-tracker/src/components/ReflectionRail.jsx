import { useState, useEffect } from "react";

export default function ReflectionRail({ 
  reflections = {}, 
  setReflections,
  currentDay,
  activeMonth,
  MONTHS_2026 = []
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
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

  // Get past reflections (last 5, excluding today)
  const getPastReflections = () => {
    return Object.entries(reflections)
      .filter(([date]) => date !== `${activeMonth}-${String(currentDay).padStart(2, '0')}`)
      .sort((a, b) => new Date(b[1].timestamp || 0) - new Date(a[1].timestamp || 0))
      .slice(0, 5)
      .map(([date, data]) => ({
        date,
        ...data
      }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const [month, day] = dateStr.split('-').slice(1);
    const monthIndex = parseInt(month) - 1;
    const monthName = MONTHS_2026[monthIndex]?.label || "Month";
    return `${monthName} ${parseInt(day)}`;
  };

  const getMoodEmoji = (mood) => {
    const moods = {
      fire: "🔥",
      neutral: "😐",
      tired: "😓"
    };
    return moods[mood] || "";
  };

  const pastReflections = getPastReflections();

  // If rail is closed, show re-open button
  if (!isVisible) {
    return (
      <button
        className="reflection-reopen-btn"
        onClick={() => setIsVisible(true)}
        title="Open reflection panel"
      >
        📝
      </button>
    );
  }

  return (
    <div className={`reflection-rail ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Toggle Button */}
      <button
        className="reflection-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? "Collapse reflections" : "Expand reflections"}
      >
        <span className="reflection-toggle-icon">📝</span>
      </button>

      {/* Rail Content */}
      <div className="reflection-rail-content">
        {/* Header */}
        <div className="reflection-header">
          <h3>Today's Reflection</h3>
          <button
            className="reflection-close-btn"
            onClick={() => setIsVisible(false)}
            title="Close reflection panel"
          >
            ✕
          </button>
        </div>

        <p className="reflection-subtitle">How are you feeling?</p>

        {/* Today's Reflection */}
        <div className="reflection-today">
          {isEditingToday ? (
            <div className="reflection-edit-form">
              <textarea
                className="reflection-textarea"
                value={todayNote}
                onChange={(e) => setTodayNote(e.target.value)}
                placeholder="What's on your mind today? (optional)"
                maxLength={300}
              />
              
              {/* Mood Selector */}
              <div className="mood-selector">
                <p className="mood-label">How's your energy?</p>
                <div className="mood-buttons">
                  <button
                    className={`mood-btn ${todayMood === "fire" ? "active" : ""}`}
                    onClick={() => setTodayMood(todayMood === "fire" ? "" : "fire")}
                    title="Energized"
                  >
                    🔥
                  </button>
                  <button
                    className={`mood-btn ${todayMood === "neutral" ? "active" : ""}`}
                    onClick={() => setTodayMood(todayMood === "neutral" ? "" : "neutral")}
                    title="Steady"
                  >
                    😐
                  </button>
                  <button
                    className={`mood-btn ${todayMood === "tired" ? "active" : ""}`}
                    onClick={() => setTodayMood(todayMood === "tired" ? "" : "tired")}
                    title="Tired"
                  >
                    😓
                  </button>
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="reflection-actions">
                <button
                  className="reflection-save"
                  onClick={saveReflection}
                >
                  ✓ Save
                </button>
                <button
                  className="reflection-cancel"
                  onClick={() => setIsEditingToday(false)}
                >
                  ✕ Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="reflection-display">
              {todayNote ? (
                <>
                  <p className="reflection-note">{todayNote}</p>
                  {todayMood && (
                    <div className="reflection-mood-tag">
                      {getMoodEmoji(todayMood)}
                    </div>
                  )}
                </>
              ) : (
                <p className="reflection-empty">No reflection yet today.</p>
              )}
              <button
                className="reflection-edit-btn"
                onClick={() => setIsEditingToday(true)}
              >
                {todayNote ? "Edit" : "Add Note"}
              </button>
            </div>
          )}
        </div>

        {/* Past Reflections */}
        {pastReflections.length > 0 && (
          <div className="reflection-history">
            <h4 className="history-header">Recent Reflections</h4>
            <div className="reflection-list">
              {pastReflections.map((reflection, idx) => (
                <div key={idx} className="reflection-item">
                  <div className="reflection-item-header">
                    <span className="reflection-date">
                      {formatDate(reflection.date)}
                    </span>
                    {reflection.mood && (
                      <span className="reflection-item-mood">
                        {getMoodEmoji(reflection.mood)}
                      </span>
                    )}
                  </div>
                  <p className="reflection-excerpt">
                    {reflection.text.substring(0, 80)}
                    {reflection.text.length > 80 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Encouraging Message */}
        <div className="reflection-footer">
          <p className="reflection-tip">
            {pastReflections.length === 0
              ? "💭 Your first note will appear here."
              : pastReflections.length < 3
              ? "✨ Keep building your reflection habit."
              : "🌱 You're building meaningful habits."}
          </p>
        </div>
      </div>
    </div>
  );
}
