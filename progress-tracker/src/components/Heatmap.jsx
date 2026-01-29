import { useState } from "react";
import EmptyState from "./EmptyState";
import "../styles/heatmap.css";

const MONTHS_2026 = [
  { key: "2026-01", label: "Jan", days: 31 },
  { key: "2026-02", label: "Feb", days: 28 },
  { key: "2026-03", label: "Mar", days: 31 },
  { key: "2026-04", label: "Apr", days: 30 },
  { key: "2026-05", label: "May", days: 31 },
  { key: "2026-06", label: "Jun", days: 30 },
  { key: "2026-07", label: "Jul", days: 31 },
  { key: "2026-08", label: "Aug", days: 31 },
  { key: "2026-09", label: "Sep", days: 30 },
  { key: "2026-10", label: "Oct", days: 31 },
  { key: "2026-11", label: "Nov", days: 30 },
  { key: "2026-12", label: "Dec", days: 31 }
];

export default function Heatmap({ data }) {
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [clickedDay, setClickedDay] = useState(null);

  // Calculate stats
  const activeDays = data.filter(d => d > 0).length;
  
  // Calculate longest streak
  const calculateLongestStreak = () => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    data.forEach(d => {
      if (d >= 50) { // Consider 50% as "active"
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  };

  // Calculate best month
  const calculateBestMonth = () => {
    let bestMonth = { label: "—", avg: 0 };
    let dayIndex = 0;

    MONTHS_2026.forEach(month => {
      let monthSum = 0;
      for (let i = 0; i < month.days; i++) {
        monthSum += data[dayIndex] || 0;
        dayIndex++;
      }
      const monthAvg = Math.round(monthSum / month.days);
      
      if (monthAvg > bestMonth.avg) {
        bestMonth = { label: month.label, avg: monthAvg };
      }
    });

    return bestMonth;
  };

  const longestStreak = calculateLongestStreak();
  const bestMonth = calculateBestMonth();

  const handleMouseEnter = (day, percentage, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: rect.left,
      y: rect.top - 40
    });
    setHoveredDay({ day, percentage });
  };

  const getDateForDay = (dayNum) => {
    let dayCount = dayNum;
    for (const month of MONTHS_2026) {
      if (dayCount <= month.days) {
        return `${month.label} ${dayCount}`;
      }
      dayCount -= month.days;
    }
    return `Day ${dayNum}`;
  };

  const getCompletedTasks = (percentage, goalCount = 3) => {
    return Math.round((percentage / 100) * goalCount);
  };

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="🗓️"
        title="No data for 2026 yet"
        message="Start tracking to see your full year visualized"
      />
    );
  }

  return (
    <div className="heatmap-container">
      <div>
        <h2>2026 Heatmap</h2>

        {/* HEATMAP STATS */}
        <div className="heatmap-stats">
          <div className="heatmap-stat">
            <div className="heatmap-stat-value">{activeDays}</div>
            <div className="heatmap-stat-label">Active Days</div>
          </div>
          <div className="heatmap-stat">
            <div className="heatmap-stat-value">🔥 {longestStreak}</div>
            <div className="heatmap-stat-label">Longest Streak</div>
          </div>
          <div className="heatmap-stat">
            <div className="heatmap-stat-value">{bestMonth.label}</div>
            <div className="heatmap-stat-label">Best Month</div>
          </div>
        </div>

        {/* HEATMAP GRID */}
        <div className="heatmap-wrapper">
          <div className="heatmap-year">
            {data.map((d, i) => (
              <div
                key={i}
                className={`heat ${
                  d === 0 ? "zero" :
                  d <= 25 ? "low" :
                  d <= 50 ? "mid" :
                  d < 100 ? "high" : "perfect"
                } ${clickedDay === i ? "locked-in" : ""}`}
                onMouseEnter={(e) => handleMouseEnter(i + 1, d, e)}
                onMouseLeave={() => setHoveredDay(null)}
                onClick={() => {
                  setClickedDay(i);
                  setTimeout(() => setClickedDay(null), 600);
                }}
                title={`${getDateForDay(i + 1)} – ${d}% completed`}
              />
            ))}
          </div>

          {/* TOOLTIP */}
          {hoveredDay && (
            <div 
              className="heatmap-tooltip"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`
              }}
            >
              <div className="tooltip-date">{getDateForDay(hoveredDay.day)}</div>
              <div className="tooltip-detail">
                {hoveredDay.percentage}% completion
              </div>
              <div className="tooltip-tasks">
                {getCompletedTasks(hoveredDay.percentage)} tasks completed
              </div>
            </div>
          )}
        </div>

        {/* LEGEND */}
        <div className="heatmap-legend">
          <span className="legend-item">
            <span className="legend-square zero"></span>
            <span>0%</span>
          </span>
          <span className="legend-item">
            <span className="legend-square low"></span>
            <span>1-25%</span>
          </span>
          <span className="legend-item">
            <span className="legend-square mid"></span>
            <span>26-50%</span>
          </span>
          <span className="legend-item">
            <span className="legend-square high"></span>
            <span>51-99%</span>
          </span>
          <span className="legend-item">
            <span className="legend-square perfect"></span>
            <span>100%</span>
          </span>
        </div>

        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "12px" }}>
          Each square represents one day in 2026
        </p>
      </div>
    </div>
  );
}
