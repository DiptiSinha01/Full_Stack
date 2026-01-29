import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from "recharts";

import EmptyState from "./EmptyState";
import "../styles/graph.css";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    const value = data.value;
    const day = data.payload.day;

    // Determine if this is best or worst
    let badge = "";
    if (value === 100) badge = " 🏆 Perfect!";
    else if (value === 0) badge = " 📉 Off day";

    return (
      <div className="graph-tooltip">
        <div className="tooltip-day">Day {day}{badge}</div>
        <div className="tooltip-value">{value}% completion</div>
      </div>
    );
  }
  return null;
};

export default function ProgressGraph({ stats }) {
  // Handle empty stats
  if (!stats || stats.length === 0) {
    return (
      <div className="section">
        <h2>Monthly Progress</h2>
        <p className="subtitle">Average daily completion</p>
        <EmptyState
          icon="📊"
          title="No progress data yet"
          message="Start marking your daily goals to see your progress"
        />
      </div>
    );
  }

  // Find best and worst days
  const bestDay = stats.reduce((max, s) => s.value > max.value ? s : max, stats[0]);
  const worstDay = stats.reduce((min, s) => s.value < min.value ? s : min, stats[0]);

  return (
    <div className="section">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2>Monthly Progress</h2>
          <p className="subtitle">Average daily completion</p>
        </div>

        <div className="graph-stats">
          <div className="graph-stat-item best">
            <span className="stat-label">Best</span>
            <span className="stat-value">Day {bestDay.day}</span>
          </div>
          <div className="graph-stat-item worst">
            <span className="stat-label">Worst</span>
            <span className="stat-value">Day {worstDay.day}</span>
          </div>
        </div>
      </div>

      <div className="graph-inner">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickFormatter={(d) =>
                d % 7 === 1 ? `W${Math.ceil(d / 7)}` : ""
              }
              stroke="var(--text-muted)"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="var(--text-muted)"
              style={{ fontSize: "12px" }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Goal Line at 70% */}
            <ReferenceLine
              y={70}
              stroke="var(--primary)"
              strokeDasharray="5 5"
              label={{
                value: "Target 70%",
                position: "right",
                fill: "var(--primary)",
                fontSize: 12,
                fontWeight: 500,
                offset: 10
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--success)"
              fill="var(--success-soft)"
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
