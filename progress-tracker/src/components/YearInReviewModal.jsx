import { useState } from "react";
import Heatmap from "./Heatmap";
import "../styles/year-in-review.css";

export default function YearInReviewModal({ isOpen, onClose, yearData, goals, MONTHS_2026 }) {
  if (!isOpen) return null;

  // Build heatmap data: overall completion % per day across all goals
  const heatmapData = [];
  const MONTHS = MONTHS_2026;

  MONTHS.forEach(month => {
    const monthData = yearData[month.key] || {};
    for (let day = 1; day <= month.days; day++) {
      let completed = 0;
      goals.forEach(goal => {
        if (monthData?.[goal]?.[day]) completed++;
      });
      const percent = goals.length > 0 ? (completed / goals.length) * 100 : 0;
      heatmapData.push(percent);
    }
  });

  // Calculate reflection stats
  const totalDays = heatmapData.length;
  const activeDays = heatmapData.filter(d => d > 0).length;
  const perfectDays = heatmapData.filter(d => d === 100).length;
  const avgCompletion = totalDays > 0 
    ? Math.round(heatmapData.reduce((a, b) => a + b, 0) / totalDays)
    : 0;

  // Calculate longest streak
  let longestStreak = 0;
  let currentStreak = 0;
  heatmapData.forEach(d => {
    if (d === 100) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  // Emotional reflection message
  const getReflectionMessage = () => {
    if (perfectDays === 0) {
      return "Every single day this year mattered. You showed up when it counted.";
    } else if (perfectDays <= 30) {
      return `${perfectDays} perfect days this year. Each one is a testament to your commitment.`;
    } else if (perfectDays <= 100) {
      return `${perfectDays} perfect days. That's a pattern now — you're building something real.`;
    } else {
      return `${perfectDays} perfect days. This is who you're becoming. Don't look away.`;
    }
  };

  return (
    <>
      {/* MODAL BACKDROP */}
      <div className="year-review-backdrop" onClick={onClose} />

      {/* MODAL CONTAINER */}
      <div className="year-review-modal">
        {/* CLOSE BUTTON */}
        <button className="year-review-close" onClick={onClose}>✕</button>

        {/* HEADER */}
        <div className="year-review-header">
          <h2 className="year-review-title">Year in Review</h2>
          <p className="year-review-subtitle">Look how far you've come.</p>
        </div>

        {/* HEATMAP SECTION */}
        <div className="year-review-heatmap-container">
          <Heatmap data={heatmapData} />
        </div>

        {/* REFLECTION STATS */}
        <div className="year-review-stats">
          <div className="stat-card">
            <div className="stat-value">{activeDays}</div>
            <div className="stat-label">Days Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{perfectDays}</div>
            <div className="stat-label">Perfect Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{longestStreak}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{avgCompletion}%</div>
            <div className="stat-label">Average</div>
          </div>
        </div>

        {/* EMOTIONAL MESSAGE */}
        <div className="year-review-reflection">
          {getReflectionMessage()}
        </div>

        {/* CLOSING THOUGHT */}
        <div className="year-review-closing">
          <p>This is the year you chose consistency over perfection.</p>
          <p>That's the whole story. That's enough.</p>
        </div>
      </div>
    </>
  );
}
