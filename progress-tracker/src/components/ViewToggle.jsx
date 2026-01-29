export default function ViewToggle({ currentView, onViewChange }) {
  return (
    <div className="view-toggle">
      <button
        className={`toggle-btn ${currentView === "today" ? "active" : ""}`}
        onClick={() => onViewChange("today")}
        title="Today's ritual"
      >
        📅 Today
      </button>
      <button
        className={`toggle-btn ${currentView === "insights" ? "active" : ""}`}
        onClick={() => onViewChange("insights")}
        title="Analytics & insights"
      >
        📊 Insights
      </button>
      <button
        className={`toggle-btn ${currentView === "review" ? "active" : ""}`}
        onClick={() => onViewChange("review")}
        title="Year in review"
      >
        🎯 Review
      </button>
    </div>
  );
}
