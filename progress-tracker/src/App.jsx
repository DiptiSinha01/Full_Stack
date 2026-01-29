import { useEffect, useState } from "react";

import LeftRail from "./components/LeftRail";
import RightRail from "./components/RightRail";
import ViewToggle from "./components/ViewToggle";
import YearInReviewModal from "./components/YearInReviewModal";
import TrackerGrid from "./components/TrackerGrid";
import TodaySummary from "./components/TodaySummary";
import WeeklyReward from "./components/WeeklyReward";
import ReflectionPrompt from "./components/ReflectionPrompt";
import ReflectionRail from "./components/ReflectionRail";
import ProgressGraph from "./components/ProgressGraph";
import EmptyState from "./components/EmptyState";
import FocusPanel from "./components/FocusPanel";
import FocusButton from "./components/FocusButton";
import useLocalStorage from "./hooks/useLocalStorage";

import "./styles/app.css";
import "./styles/view-toggle.css";
import "./styles/focus-panel.css";
import "./styles/reflection-rail.css";

/* ---------------- CONSTANTS ---------------- */

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

/* ---------------- HELPERS ---------------- */

function WeeklySnapshot({ stats }) {
  const weeks = {};

  stats.forEach(s => {
    const w = Math.ceil(s.day / 7);
    weeks[w] = weeks[w] || [];
    weeks[w].push(s.value);
  });

  const weekArray = Object.entries(weeks).map(([w, vals]) => {
    const avg = Math.round(
      vals.reduce((a, b) => a + b, 0) / vals.length
    );
    return { week: parseInt(w), avg, vals };
  });

  return (
    <div className="weekly-stats-grid">
      {weekArray.map((weekData, idx) => {
        const prevWeekAvg = idx > 0 ? weekArray[idx - 1].avg : weekData.avg;
        const diff = weekData.avg - prevWeekAvg;
        const isUp = diff > 0;
        const isDown = diff < 0;

        return (
          <div key={weekData.week} className="weekly-stat-card">
            <div className="week-header">
              <span className="week-number">Week {weekData.week}</span>
              <span className="week-trend">
                {isUp && <span className="trend-up">⬆️ +{diff}%</span>}
                {isDown && <span className="trend-down">⬇️ {diff}%</span>}
                {!isUp && !isDown && <span className="trend-flat">➡️ Same</span>}
              </span>
            </div>
            <div className="week-stat">
              <div className="week-value">{weekData.avg}%</div>
              <div className="week-label">Average</div>
            </div>
            <div className="week-bar">
              <div 
                className="week-bar-fill" 
                style={{ width: `${weekData.avg}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function calculateDailyProgress(monthData, goals, daysInMonth) {
  const stats = [];

  for (let day = 1; day <= daysInMonth; day++) {
    let done = 0;

    goals.forEach(goal => {
      if (monthData?.[goal]?.[day]) done++;
    });

    const percent = goals.length
      ? Math.round((done / goals.length) * 100)
      : 0;

    stats.push({ day, value: percent });
  }

  return stats;
}

function buildYearHeatmap(yearData, goals, months) {
  const heatmap = [];

  months.forEach(month => {
    const mData = yearData[month.key] || {};

    for (let day = 1; day <= month.days; day++) {
      let done = 0;

      goals.forEach(goal => {
        if (mData?.[goal]?.[day]) done++;
      });

      heatmap.push(
        goals.length ? Math.round((done / goals.length) * 100) : 0
      );
    }
  });

  return heatmap;
}

/* ---------------- APP ---------------- */

export default function App() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [goals, setGoals] = useLocalStorage("goals-2026", [
    "DSA",
    "Project",
    "Reading"
  ]);
  const [yearData, setYearData] = useLocalStorage("year-2026-data", {});
  const [activeMonth, setActiveMonth] = useLocalStorage(
    "active-month-2026",
    "2026-01"
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showFocusPanel, setShowFocusPanel] = useState(false);
  const [showRightRail, setShowRightRail] = useState(true);
  const [motto, setMotto] = useLocalStorage("motto-2026", "No zero days.");
  const [lifePhase, setLifePhase] = useLocalStorage("life-phase-2026", "Skill building");
  const [reflections, setReflections] = useLocalStorage("reflections-2026", {});
  const [currentView, setCurrentView] = useState("today");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Smooth transition on month switch
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [activeMonth]);

  const currentMonth = MONTHS_2026.find(m => m.key === activeMonth);
  const monthData = yearData[activeMonth] || {};

  const stats = calculateDailyProgress(
    monthData,
    goals,
    currentMonth.days
  );

  const heatmapData = buildYearHeatmap(
    yearData,
    goals,
    MONTHS_2026
  );

  // Calculate current streak
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    let currentDay = today.getDate();
    let currentMonthKey = activeMonth;

    while (currentDay > 0) {
      const mData = yearData[currentMonthKey] || {};
      let dayCompleted = 0;
      let dayTotal = 0;

      goals.forEach(goal => {
        dayTotal++;
        if (mData?.[goal]?.[currentDay]) dayCompleted++;
      });

      if (dayCompleted === dayTotal && dayTotal > 0) {
        streak++;
        currentDay--;
      } else {
        break;
      }

      if (currentDay === 0) {
        const monthIndex = MONTHS_2026.findIndex(m => m.key === currentMonthKey);
        if (monthIndex > 0) {
          currentMonthKey = MONTHS_2026[monthIndex - 1].key;
          const prevMonth = MONTHS_2026[monthIndex - 1];
          currentDay = prevMonth.days;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  // Calculate total XP (10 points per completed goal)
  const calculateTotalXP = () => {
    let totalXP = 0;
    Object.values(yearData).forEach(monthData => {
      Object.values(monthData).forEach(goalData => {
        Object.values(goalData).forEach(completed => {
          if (completed) totalXP += 10;
        });
      });
    });
    return totalXP;
  };

  // Calculate level (every 500 XP = 1 level)
  const totalXP = calculateTotalXP();
  const currentLevel = Math.floor(totalXP / 500) + 1;
  const streak = calculateStreak();
  const todayXP = (() => {
    let xp = 0;
    const today = new Date();
    const currentDay = today.getDate();
    goals.forEach(goal => {
      if (monthData?.[goal]?.[currentDay]) xp += 10;
    });
    return xp;
  })();

  return (
    <div className={`os-shell ${!showRightRail ? 'right-rail-closed' : ''}`}>
      {/* FOCUS PANEL */}
      <FocusPanel 
        isOpen={showFocusPanel} 
        onClose={() => setShowFocusPanel(false)}
        onStartSession={() => {
          setIsFocusMode(true);
          setCurrentView("today");
        }}
      />

      {/* FOCUS BUTTON */}
      <FocusButton 
        onClick={() => setShowFocusPanel(true)}
        isActive={isFocusMode}
      />

      {/* VIEW TOGGLE */}
      <ViewToggle
        currentView={currentView}
        onViewChange={setCurrentView}
      />

      {/* REFLECTION PROMPT - Once per day */}
      <ReflectionPrompt reflections={reflections} setReflections={setReflections} />

      {/* YEAR IN REVIEW MODAL */}
      <YearInReviewModal
        isOpen={currentView === "review"}
        onClose={() => setCurrentView("today")}
        yearData={yearData}
        goals={goals}
        MONTHS_2026={MONTHS_2026}
      />

      {/* LEFT RAIL - Persistent Sidebar */}
      <LeftRail
        theme={theme}
        setTheme={setTheme}
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
        MONTHS_2026={MONTHS_2026}
        lifePhase={lifePhase}
        streak={streak}
        level={currentLevel}
        totalXP={totalXP}
        currentDay={new Date().getDate()}
        goals={goals}
        setGoals={setGoals}
      />

      {currentView === "today" && <div />} {/* left gutter - only show with today */}

      {currentView === "today" && (
        <div className={`os-center ${isTransitioning ? 'fade-out' : 'fade-in'} ${isFocusMode ? 'focus-mode' : ''}`}>
          {/* TODAY SUMMARY - Command Center */}
          <TodaySummary
            goals={goals}
            monthData={monthData}
            currentDay={new Date().getDate()}
            streak={streak}
            xp={todayXP}
            level={currentLevel}
            totalXP={totalXP}
            lifePhase={lifePhase}
          />

          {/* DAILY EXECUTION - The Ritual */}
          <div className={`section card-solid execution-section ${isFocusMode ? 'focus-active' : ''}`}>
            <div className="execution-header">
              <div>
                <h2>Daily Execution</h2>
                {isFocusMode ? (
                  <p className="focus-message">Just show up. Nothing else matters.</p>
                ) : (
                  <p className="subtitle">Mark what you showed up for</p>
                )}
              </div>
              <button 
                className={`focus-toggle ${isFocusMode ? 'active' : ''}`}
                onClick={() => setIsFocusMode(!isFocusMode)}
                title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
              >
                🎯 {isFocusMode ? 'Focus ON' : 'Focus'}
              </button>
            </div>

            {goals.length === 0 ? (
              <EmptyState
                icon="🎯"
                title="No goals yet"
                message="Start by adding your first goal in the left sidebar"
              />
            ) : (
              <div style={{ overflowX: "auto" }}>
                <TrackerGrid
                  goals={goals}
                  days={currentMonth.days}
                  data={monthData}
                  setData={(updatedMonth) =>
                    setYearData(prev => ({
                      ...prev,
                      [activeMonth]: updatedMonth
                    }))
                  }
                />
              </div>
            )}
          </div>

          {/* MONTHLY PROGRESS GRAPH */}
          <ProgressGraph stats={stats} />

          {/* WEEKLY CHECK-IN */}
          <div className="card-gradient-wrap">
            <WeeklyReward 
              monthData={monthData} 
              goals={goals} 
              currentDay={new Date().getDate()}
              lifePhase={lifePhase}
            />
          </div>
        </div>
      )}

      {currentView === "today" && showRightRail && <div />} {/* center-right gutter - only show with today when right rail visible */}

      {showRightRail && (
        <RightRail
          monthData={monthData}
          goals={goals}
          yearData={yearData}
          activeMonth={activeMonth}
          currentDay={new Date().getDate()}
          theme={theme}
          MONTHS_2026={MONTHS_2026}
          lifePhase={lifePhase}
          reflections={reflections}
          setReflections={setReflections}
          currentView={currentView}
          onClose={() => setShowRightRail(false)}
        />
      )}
    </div>
  );
}
