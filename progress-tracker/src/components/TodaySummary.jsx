export default function TodaySummary({ goals, monthData, currentDay, streak, xp, level, totalXP, lifePhase = "Skill building" }) {
  // Calculate today's completion
  let completedToday = 0;
  goals.forEach(goal => {
    if (monthData?.[goal]?.[currentDay]) {
      completedToday++;
    }
  });

  const todayCompletion = goals.length
    ? Math.round((completedToday / goals.length) * 100)
    : 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  // XP bar calculation: how much XP until next level
  const xpPerLevel = 500;
  const currentLevelStart = (level - 1) * xpPerLevel;
  const nextLevelStart = level * xpPerLevel;
  const xpProgress = totalXP - currentLevelStart;
  const xpToNextLevel = xpPerLevel;
  const xpProgressPercent = Math.min((xpProgress / xpToNextLevel) * 100, 100);

  // Context-aware motivational micro copy with personality + life phase adaptation
  let microCopy = "";

  // Perfect day messaging
  if (todayCompletion === 100) {
    if (lifePhase === "Placement grind") {
      microCopy = streak >= 14 
        ? "Full day executed. This is what winners look like. 🚀"
        : "Another perfect day locked in. Placement trajectory intact. 🎯";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "You showed up for yourself today. That's the real win. 🌿";
    } else {
      // Skill building
      microCopy = streak >= 14 
        ? "Two weeks of showing up. This is discipline becoming skill. 🔥"
        : "You showed up even when it was optional. That matters. 🙏";
    }
  } 
  // One goal away
  else if (completedToday === goals.length - 1) {
    if (lifePhase === "Placement grind") {
      microCopy = "One more goal. Let's finish strong. 💪";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "Almost there. Take your time, finish at your pace. 🌱";
    } else {
      microCopy = "One more. That's the difference between wanting and doing. 👀";
    }
  }
  // No progress yet
  else if (completedToday === 0 && todayCompletion === 0) {
    if (lifePhase === "Placement grind") {
      microCopy = "Clock is ticking. Every day is a competitive advantage. 🚀";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "No rush. Start when you're ready. One action is enough. 🌱";
    } else {
      microCopy = "The first step is hardest. Start with one. 🌱";
    }
  }
  // High completion (66%+)
  else if (todayCompletion >= 66) {
    if (lifePhase === "Placement grind") {
      microCopy = "Most of the way there. Don't leave this incomplete. 🎯";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "You're doing great. Finish when it feels right. 💚";
    } else {
      microCopy = "Most of the way there. Finish what you started. 💪";
    }
  }
  // Medium completion (33%+)
  else if (todayCompletion >= 33) {
    if (lifePhase === "Placement grind") {
      microCopy = "Halfway there. Placement aspirants don't stop here. 🔥";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "You're building back. That's strength in itself. 💚";
    } else {
      microCopy = "Something beats nothing. Keep building. 🧱";
    }
  }
  // Streak-based messaging when not hitting completion targets
  else if (streak >= 14) {
    if (lifePhase === "Placement grind") {
      microCopy = "Two weeks of grind. Protect this momentum. 🚀";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "14 days of consistency. You're healing beautifully. 🌿";
    } else {
      microCopy = "Two weeks of consistency. Don't break it now. 🔥";
    }
  }
  else if (streak >= 7) {
    if (lifePhase === "Placement grind") {
      microCopy = "One week in. This momentum will compound. 📈";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "A week of gentleness to yourself. Keep going. 🌿";
    } else {
      microCopy = "A week of momentum. Guard it. 🛡️";
    }
  }
  else if (streak >= 3) {
    if (lifePhase === "Placement grind") {
      microCopy = "Three days of grind. This is where champions are made. 💪";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "Three days of showing up. You're stronger than you think. 💚";
    } else {
      microCopy = "Three days in. This is where it gets real. 💪";
    }
  }
  else if (streak === 1) {
    if (lifePhase === "Placement grind") {
      microCopy = "Day one executed. Day two determines if you're serious. 🚀";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "Day one done. You're already moving forward. 🌱";
    } else {
      microCopy = "Day one doesn't matter much. Day two proves you meant it. 🌱";
    }
  }
  else {
    if (lifePhase === "Placement grind") {
      microCopy = "First move wins. Start your placement grind now. 🚀";
    } else if (lifePhase === "Recovery phase") {
      microCopy = "Ready to begin? One action at a time. 🌿";
    } else {
      microCopy = "Momentum is quiet. One action wakes it up. ⚡";
    }
  }

  return (
    <div className="today-summary" style={{
      background: todayCompletion <= 33 
        ? 'linear-gradient(135deg, #cffafe 0%, #e0f2fe 100%)'
        : todayCompletion <= 66 
        ? 'linear-gradient(135deg, #a5f3fc 0%, #67e8f9 100%)'
        : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    }}>
      <div className="summary-header">
        <div>
          <h2 className="summary-date">{dateStr}</h2>
          <p className="summary-subtitle">Today's Focus</p>
        </div>
        <div className="level-badge">
          <div className="badge-value">LVL {level}</div>
        </div>
      </div>

      {/* XP BAR */}
      <div className="xp-section">
        <div className="xp-header">
          <span className="xp-label">Experience</span>
          <span className="xp-text">{xpProgress} / {xpToNextLevel} XP</span>
        </div>
        <div className="xp-bar">
          <div 
            className="xp-bar-fill" 
            style={{ width: `${xpProgressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="summary-grid">
        <div className="summary-card completion">
          <div className="summary-stat-value">{todayCompletion}%</div>
          <div className="summary-stat-label">Completed</div>
          <div className="summary-stat-progress">
            <div 
              className="summary-progress-bar" 
              style={{ width: `${todayCompletion}%` }}
            ></div>
          </div>
          <div className="summary-progress-text">{completedToday}/{goals.length} goals</div>
        </div>

        <div className="summary-card streak">
          <div className="summary-stat-value flame-flicker">🔥 {streak}</div>
          <div className="summary-stat-label">Day Streak</div>
        </div>

        <div className="summary-card xp">
          <div className="summary-stat-value">+{xp}</div>
          <div className="summary-stat-label">XP Today</div>
        </div>

        <div className="summary-card level">
          <div className="summary-stat-value">⭐</div>
          <div className="summary-stat-label">Keep Going</div>
        </div>
      </div>

      {todayCompletion === 100 && (
        <div className="summary-celebration slide-up">
          ✨ Perfect day! Keep the momentum going! ✨
        </div>
      )}

      {/* MICRO COPY - Motivational Message */}
      <div className="summary-micro-copy">
        {microCopy}
      </div>

      {/* EMOTIONAL TAGLINE */}
      <div className="summary-tagline">
        One more action closes today.
      </div>
    </div>
  );
}
