import { useState } from "react";

export default function ShadowMetrics({ yearData, goals, activeMonth, MONTHS_2026 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate consistency score (standard deviation of weekly completion percentages)
  const calculateConsistencyScore = () => {
    const monthData = yearData[activeMonth] || {};
    const weeks = {};

    // Group days into weeks
    const monthIndex = MONTHS_2026.findIndex(m => m.key === activeMonth);
    const monthInfo = MONTHS_2026[monthIndex];

    for (let day = 1; day <= monthInfo.days; day++) {
      const weekNum = Math.ceil(day / 7);
      if (!weeks[weekNum]) weeks[weekNum] = [];

      let completed = 0;
      goals.forEach(goal => {
        if (monthData?.[goal]?.[day]) completed++;
      });

      const dayCompletion = goals.length ? (completed / goals.length) * 100 : 0;
      weeks[weekNum].push(dayCompletion);
    }

    // Calculate weekly averages
    const weeklyAvgs = Object.values(weeks).map(days => {
      const sum = days.reduce((a, b) => a + b, 0);
      return sum / days.length;
    });

    // Calculate standard deviation
    const mean = weeklyAvgs.reduce((a, b) => a + b, 0) / weeklyAvgs.length;
    const variance = weeklyAvgs.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / weeklyAvgs.length;
    const stdDev = Math.sqrt(variance);

    // Normalize to 0-100 scale (lower is more consistent)
    const consistencyScore = Math.max(0, 100 - stdDev);
    return Math.round(consistencyScore);
  };

  // Calculate volatility score (how much completion swings between weeks)
  const calculateVolatilityScore = () => {
    const monthData = yearData[activeMonth] || {};
    const monthIndex = MONTHS_2026.findIndex(m => m.key === activeMonth);
    const monthInfo = MONTHS_2026[monthIndex];

    const weeks = {};
    for (let day = 1; day <= monthInfo.days; day++) {
      const weekNum = Math.ceil(day / 7);
      if (!weeks[weekNum]) weeks[weekNum] = { completed: 0, total: 0 };

      goals.forEach(goal => {
        weeks[weekNum].total++;
        if (monthData?.[goal]?.[day]) weeks[weekNum].completed++;
      });
    }

    // Calculate week-to-week changes
    const weeklyCompletion = Object.values(weeks).map(w =>
      w.total ? (w.completed / w.total) * 100 : 0
    );

    let totalSwing = 0;
    for (let i = 1; i < weeklyCompletion.length; i++) {
      totalSwing += Math.abs(weeklyCompletion[i] - weeklyCompletion[i - 1]);
    }

    const avgSwing = weeklyCompletion.length > 1 ? totalSwing / (weeklyCompletion.length - 1) : 0;

    // Volatility: inverse of swing (lower swing = lower volatility)
    const volatilityScore = Math.max(0, 100 - avgSwing * 2);
    return Math.round(volatilityScore);
  };

  // Calculate recovery time (days to return to average after a bad week)
  const calculateRecoveryTime = () => {
    const monthData = yearData[activeMonth] || {};
    const monthIndex = MONTHS_2026.findIndex(m => m.key === activeMonth);
    const monthInfo = MONTHS_2026[monthIndex];

    const dailyCompletions = [];

    for (let day = 1; day <= monthInfo.days; day++) {
      let completed = 0;
      goals.forEach(goal => {
        if (monthData?.[goal]?.[day]) completed++;
      });
      const dayCompletion = goals.length ? (completed / goals.length) * 100 : 0;
      dailyCompletions.push(dayCompletion);
    }

    // Calculate average
    const average = dailyCompletions.reduce((a, b) => a + b, 0) / dailyCompletions.length;

    // Find worst day
    let worstIndex = 0;
    let worstValue = 100;
    for (let i = 0; i < dailyCompletions.length; i++) {
      if (dailyCompletions[i] < worstValue) {
        worstValue = dailyCompletions[i];
        worstIndex = i;
      }
    }

    // Count days to recover to average after worst day
    let recoveryDays = 0;
    for (let i = worstIndex + 1; i < dailyCompletions.length; i++) {
      recoveryDays++;
      if (dailyCompletions[i] >= average) {
        break;
      }
    }

    return worstValue === 100 ? 0 : recoveryDays; // Perfect month = 0 recovery time needed
  };

  const consistencyScore = calculateConsistencyScore();
  const volatilityScore = calculateVolatilityScore();
  const recoveryTime = calculateRecoveryTime();

  const getConsistencyLevel = (score) => {
    if (score >= 85) return "Exceptional";
    if (score >= 70) return "Strong";
    if (score >= 50) return "Moderate";
    return "Variable";
  };

  const getVolatilityLevel = (score) => {
    if (score >= 85) return "Rock solid";
    if (score >= 70) return "Stable";
    if (score >= 50) return "Fluctuating";
    return "Volatile";
  };

  return (
    <div className="shadow-metrics">
      <button 
        className="shadow-metrics-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>📊 Advanced Metrics</span>
        <span className={`toggle-icon ${isExpanded ? 'open' : ''}`}>⌄</span>
      </button>

      {isExpanded && (
        <div className="shadow-metrics-content">
          {/* CONSISTENCY SCORE */}
          <div className="metric-item">
            <div className="metric-header">
              <div className="metric-label">Consistency Score</div>
              <div className="metric-value" style={{
                color: consistencyScore >= 70 ? '#10b981' : consistencyScore >= 50 ? '#f59e0b' : '#ef4444'
              }}>
                {consistencyScore}
              </div>
            </div>
            <div className="metric-bar">
              <div 
                className="metric-bar-fill"
                style={{
                  width: `${consistencyScore}%`,
                  background: consistencyScore >= 70 ? '#10b981' : consistencyScore >= 50 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
            <div className="metric-description">
              {getConsistencyLevel(consistencyScore)} week-to-week variation
            </div>
          </div>

          {/* VOLATILITY SCORE */}
          <div className="metric-item">
            <div className="metric-header">
              <div className="metric-label">Stability Score</div>
              <div className="metric-value" style={{
                color: volatilityScore >= 70 ? '#10b981' : volatilityScore >= 50 ? '#f59e0b' : '#ef4444'
              }}>
                {volatilityScore}
              </div>
            </div>
            <div className="metric-bar">
              <div 
                className="metric-bar-fill"
                style={{
                  width: `${volatilityScore}%`,
                  background: volatilityScore >= 70 ? '#10b981' : volatilityScore >= 50 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
            <div className="metric-description">
              {getVolatilityLevel(volatilityScore)} daily performance
            </div>
          </div>

          {/* RECOVERY TIME */}
          <div className="metric-item">
            <div className="metric-header">
              <div className="metric-label">Recovery Time</div>
              <div className="metric-value">
                {recoveryTime === 0 ? "Perfect" : `${recoveryTime} days`}
              </div>
            </div>
            <div className="metric-description">
              {recoveryTime === 0 
                ? "No bad weeks — flawless month"
                : `Days to recover after worst week`}
            </div>
          </div>

          {/* INSIGHT */}
          <div className="metric-insight">
            <div className="insight-emoji">💡</div>
            <div className="insight-text">
              {consistencyScore >= 70 && volatilityScore >= 70
                ? "You're rock solid. This is elite-level consistency."
                : consistencyScore >= 70
                ? "Strong performance overall. Smooth out those weekly swings."
                : volatilityScore >= 70
                ? "You have momentum, but week-to-week is unpredictable. Try anchoring habits."
                : "High variation detected. Focus on one habit at a time."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
