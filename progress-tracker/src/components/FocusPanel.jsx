import { useState, useEffect } from "react";

export default function FocusPanel({ isOpen, onClose, onStartSession }) {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [currentTask, setCurrentTask] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(selectedDuration * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          // Play notification sound
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj==');
          audio.play().catch(() => {});
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  // Reset timer when duration changes
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(selectedDuration * 60);
    }
  }, [selectedDuration, isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((selectedDuration * 60 - timeRemaining) / (selectedDuration * 60)) * 100;

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDuration * 60);
  };

  const handleClose = () => {
    setIsRunning(false);
    setTimeRemaining(selectedDuration * 60);
    setCurrentTask("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dimmed Background */}
      <div className="focus-panel-backdrop" onClick={handleClose} />

      {/* Focus Panel */}
      <div className="focus-panel">
        {/* Header */}
        <div className="focus-panel-header">
          <h3>🎯 Focus Session</h3>
          <button className="focus-panel-close" onClick={handleClose}>✕</button>
        </div>

        {/* Progress Ring */}
        <div className="focus-progress-container">
          <svg className="focus-progress-ring" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--border)"
              strokeWidth="2"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercent / 100)}`}
              strokeLinecap="round"
              className="progress-ring-fill"
            />
          </svg>
          <div className="focus-timer">{formatTime(timeRemaining)}</div>
        </div>

        {/* Duration Selection */}
        <div className="focus-durations">
          {[25, 45, 60].map(duration => (
            <button
              key={duration}
              className={`duration-btn ${selectedDuration === duration ? 'active' : ''}`}
              onClick={() => {
                if (!isRunning) {
                  setSelectedDuration(duration);
                }
              }}
              disabled={isRunning}
            >
              {duration}m
            </button>
          ))}
        </div>

        {/* Current Task Input */}
        <input
          type="text"
          className="focus-task-input"
          placeholder="What's your focus? (optional)"
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          disabled={isRunning}
        />

        {/* Action Buttons */}
        <div className="focus-controls">
          <button
            className={`focus-action-btn start-btn ${isRunning ? 'running' : ''}`}
            onClick={handleStart}
          >
            {isRunning ? '⏸ Pause' : '▶ Start'}
          </button>
          <button
            className="focus-action-btn reset-btn"
            onClick={handleReset}
            disabled={isRunning}
          >
            ↻ Reset
          </button>
        </div>

        {/* Focus Tips */}
        <div className="focus-tips">
          <p className="tip-label">💡 Focus Tips:</p>
          <ul>
            <li>Close distracting tabs</li>
            <li>Put your phone away</li>
            <li>Take a sip of water</li>
          </ul>
        </div>
      </div>
    </>
  );
}
