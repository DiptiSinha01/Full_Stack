import { useRef } from "react";

export default function MonthCardExport({ yearData, goals, activeMonth, MONTHS_2026, reflections, theme = "light" }) {
  const cardRef = useRef(null);

  // Calculate month statistics
  const getMonthStats = () => {
    const monthData = yearData[activeMonth] || {};
    const monthIndex = MONTHS_2026.findIndex(m => m.key === activeMonth);
    const monthInfo = MONTHS_2026[monthIndex];

    let totalDays = 0;
    let completedGoalDays = 0;
    let streak = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    for (let day = 1; day <= monthInfo.days; day++) {
      let completed = 0;
      goals.forEach(goal => {
        if (monthData?.[goal]?.[day]) completed++;
      });

      if (completed === goals.length) {
        completedGoalDays++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
      totalDays++;
    }

    const avgCompletion = totalDays > 0 ? Math.round((completedGoalDays / totalDays) * 100) : 0;

    return {
      avgCompletion,
      maxStreak,
      monthName: monthInfo.label,
      monthYear: `${monthInfo.label} 2026`
    };
  };

  // Get lessons from reflections
  const getLessons = () => {
    const today = new Date().toISOString().split("T")[0];
    const monthIndex = MONTHS_2026.findIndex(m => m.key === activeMonth);
    const [monthStr] = activeMonth.split("-").slice(0, 2);
    const monthNum = parseInt(monthStr.split("-")[1]);

    const monthReflections = Object.entries(reflections || {})
      .filter(([dateStr]) => {
        const reflectionMonth = parseInt(dateStr.split("-")[1]);
        return reflectionMonth === monthNum;
      })
      .map(([, data]) => data.text);

    return monthReflections.slice(0, 3); // Top 3 lessons
  };

  const stats = getMonthStats();
  const lessons = getLessons();

  const handleExport = async () => {
    try {
      // Dynamic import html2canvas
      const html2canvas = (await import("html2canvas")).default;

      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false
      });

      // Download image
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Progress-${stats.monthYear.replace(" ", "-")}.png`;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Make sure you have the required libraries.");
    }
  };

  return (
    <div className="month-card-export">
      <div className="export-header">
        <h3>📸 Month Card Export</h3>
        <button onClick={handleExport} className="export-btn">
          ↓ Export as Image
        </button>
      </div>

      {/* CARD TO EXPORT */}
      <div ref={cardRef} className="month-card-preview" data-theme={theme}>
        <div className="card-content">
          {/* HEADER */}
          <div className="card-month-header">
            <h2>{stats.monthYear}</h2>
            <div className="card-subtitle">Progress Summary</div>
          </div>

          {/* STATS GRID */}
          <div className="card-stats-grid">
            {/* AVERAGE */}
            <div className="card-stat-box">
              <div className="card-stat-value">{stats.avgCompletion}%</div>
              <div className="card-stat-label">Average Completion</div>
              <div className="card-stat-bar">
                <div
                  className="card-stat-bar-fill"
                  style={{
                    width: `${stats.avgCompletion}%`,
                    background: stats.avgCompletion >= 70 ? "#10b981" : stats.avgCompletion >= 50 ? "#f59e0b" : "#ef4444"
                  }}
                />
              </div>
            </div>

            {/* BEST STREAK */}
            <div className="card-stat-box">
              <div className="card-stat-value">{stats.maxStreak}</div>
              <div className="card-stat-label">Best Streak</div>
              <div className="card-stat-sublabel">consecutive perfect days</div>
            </div>

            {/* GOALS */}
            <div className="card-stat-box">
              <div className="card-stat-value">{goals.length}</div>
              <div className="card-stat-label">Active Goals</div>
              <div className="card-stat-sublabel">{goals.join(" • ")}</div>
            </div>
          </div>

          {/* LESSONS LEARNED */}
          {lessons.length > 0 && (
            <div className="card-lessons">
              <div className="lessons-header">💡 Lessons Learned</div>
              <div className="lessons-list">
                {lessons.map((lesson, idx) => (
                  <div key={idx} className="lesson-item">
                    <span className="lesson-dot">•</span>
                    <span className="lesson-text">{lesson}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="card-footer">
            <div className="footer-text">Progress OS • 2026</div>
            <div className="footer-subtext">One step closer, every day</div>
          </div>
        </div>
      </div>

      {/* PREVIEW NOTE */}
      <div className="export-note">
        💡 This preview shows what you'll export. Click the button above to save as PNG.
      </div>
    </div>
  );
}
