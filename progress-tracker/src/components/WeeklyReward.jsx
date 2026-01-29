export default function WeeklyReward({ monthData, goals, currentDay, lifePhase = "Skill building" }) {
  // Calculate this week's completion (last 7 days)
  const calculateWeekCompletion = (startDay) => {
    let totalCompleted = 0;
    let totalGoals = 0;

    for (let day = Math.max(1, startDay - 6); day <= startDay; day++) {
      goals.forEach(goal => {
        totalGoals++;
        if (monthData?.[goal]?.[day]) totalCompleted++;
      });
    }

    return totalGoals > 0 ? Math.round((totalCompleted / totalGoals) * 100) : 0;
  };

  // Calculate last week's completion
  const thisWeekStart = Math.max(1, currentDay - 6);
  const lastWeekStart = Math.max(1, currentDay - 13);
  const lastWeekEnd = Math.min(currentDay - 7, thisWeekStart - 1);

  const thisWeekCompletion = calculateWeekCompletion(currentDay);
  const lastWeekCompletion = lastWeekEnd > 0 
    ? calculateWeekCompletion(lastWeekEnd) 
    : 0;

  const difference = thisWeekCompletion - lastWeekCompletion;
  const isImprovement = difference > 0;

  // Life phase-aware messaging
  const getWeeklyMessage = () => {
    if (isImprovement) {
      if (lifePhase === "Placement grind") {
        return "This week rose. You're building momentum when it matters most.";
      } else if (lifePhase === "Recovery phase") {
        return "This week rose. You're healing, one day at a time.";
      }
      return "This week rose. That's not luck — that's you showing up better.";
    } else if (difference === 0) {
      if (lifePhase === "Placement grind") {
        return "This week held steady. Consistency beats brilliance in placement season.";
      } else if (lifePhase === "Recovery phase") {
        return "This week held steady. That's strength, even if it doesn't feel like it.";
      }
      return "This week held steady. Consistency is its own victory.";
    } else {
      if (lifePhase === "Placement grind") {
        return "This week dipped. That's information — not judgment. Recalibrate tomorrow.";
      } else if (lifePhase === "Recovery phase") {
        return "This week dipped. That's information — not failure. Restart gently.";
      }
      return "This week dipped. That's information — not judgment. What will shift tomorrow?";
    }
  };

  const weeklyMessage = getWeeklyMessage();

  return (
    <div className="weekly-reward">
      <div className="reward-content">
        <div className="reward-main">
          <h3 className="reward-title">This Week</h3>
          <div className="reward-value">{thisWeekCompletion}%</div>
        </div>
      </div>

      <div className="reward-message">
        {weeklyMessage}
      </div>
    </div>
  );
}
