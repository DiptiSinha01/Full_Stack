import { useState } from "react";

const LIFE_PHASES = [
  { value: "Placement grind", icon: "🚀", label: "Placement Grind" },
  { value: "Skill building", icon: "🔨", label: "Skill Building" },
  { value: "Recovery phase", icon: "🌱", label: "Recovery Phase" }
];

const DEFAULT_MOTTOS = [
  "No zero days.",
  "Discipline > Motivation.",
  "Consistency is kingdom.",
  "One step closer.",
  "Progress, not perfection."
];

export default function IdentityCard({ motto, setMotto, lifePhase, setLifePhase }) {
  const [isEditingMotto, setIsEditingMotto] = useState(false);
  const [tempMotto, setTempMotto] = useState(motto);

  const handleSaveMotto = () => {
    if (tempMotto.trim()) {
      setMotto(tempMotto.trim());
      setIsEditingMotto(false);
    }
  };

  const handleQuickMotto = (quickMotto) => {
    setMotto(quickMotto);
    setIsEditingMotto(false);
  };

  const currentPhase = LIFE_PHASES.find(p => p.value === lifePhase);

  return (
    <div className="identity-card card-gradient">
      {/* MOTTO SECTION */}
      <div className="identity-motto-section">
        <div className="identity-label">Your Motto</div>
        
        {!isEditingMotto ? (
          <div 
            className="identity-motto-display"
            onClick={() => setIsEditingMotto(true)}
            title="Click to edit"
          >
            <span className="motto-text">"{motto}"</span>
            <span className="motto-edit-hint">✎</span>
          </div>
        ) : (
          <div className="identity-motto-editor">
            <input
              type="text"
              value={tempMotto}
              onChange={(e) => setTempMotto(e.target.value)}
              placeholder="Your personal motto..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveMotto();
                if (e.key === 'Escape') setIsEditingMotto(false);
              }}
              className="motto-input"
            />
            <div className="motto-actions">
              <button onClick={handleSaveMotto} className="btn-save">Save</button>
              <button onClick={() => setIsEditingMotto(false)} className="btn-cancel">Cancel</button>
            </div>
            
            <div className="motto-suggestions">
              <div className="suggestions-label">Quick suggestions:</div>
              <div className="suggestions-list">
                {DEFAULT_MOTTOS.map(m => (
                  <button
                    key={m}
                    onClick={() => handleQuickMotto(m)}
                    className="suggestion-btn"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* LIFE PHASE SECTION */}
      <div className="identity-phase-section">
        <div className="identity-label">Current Phase</div>
        <div className="phase-selector">
          {LIFE_PHASES.map(phase => (
            <button
              key={phase.value}
              onClick={() => setLifePhase(phase.value)}
              className={`phase-btn ${lifePhase === phase.value ? 'active' : ''}`}
              title={phase.label}
            >
              <span className="phase-icon">{phase.icon}</span>
              <span className="phase-name">{phase.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PHASE CONTEXT */}
      <div className="identity-context">
        {lifePhase === "Placement grind" && (
          <div className="context-message">
            <span className="context-emoji">💼</span>
            <span>High intensity season. Every week counts toward your future.</span>
          </div>
        )}
        {lifePhase === "Skill building" && (
          <div className="context-message">
            <span className="context-emoji">📚</span>
            <span>Investing in yourself. Small daily wins compound over time.</span>
          </div>
        )}
        {lifePhase === "Recovery phase" && (
          <div className="context-message">
            <span className="context-emoji">🌿</span>
            <span>Healing & reflection. Progress at your own pace. Rest is productive.</span>
          </div>
        )}
      </div>
    </div>
  );
}
