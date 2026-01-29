import { useState, useEffect } from "react";

export default function ReflectionPrompt({ reflections, setReflections }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Check if user has already answered today
  useEffect(() => {
    const hasAnsweredToday = reflections?.[today];
    // Show prompt if they haven't answered today and it's not already shown in this session
    if (!hasAnsweredToday && !sessionStorage.getItem("reflection-shown-today")) {
      // Show after 2 seconds of page load for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [today, reflections]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      const updatedReflections = {
        ...reflections,
        [today]: {
          text: inputValue.trim(),
          timestamp: new Date().toISOString()
        }
      };
      setReflections(updatedReflections);
      setInputValue("");
      setIsOpen(false);
      sessionStorage.setItem("reflection-shown-today", "true");
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    sessionStorage.setItem("reflection-shown-today", "true");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* OVERLAY */}
      <div className="reflection-overlay" onClick={handleSkip} />

      {/* MODAL */}
      <div className="reflection-modal">
        <div className="reflection-header">
          <h2>✨ Daily Reflection</h2>
          <button className="reflection-close" onClick={handleSkip}>✕</button>
        </div>

        <div className="reflection-content">
          <p className="reflection-prompt">
            "What made today easier than yesterday?"
          </p>
          <p className="reflection-subtitle">
            Small observations compound. What did you learn?
          </p>

          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="I found that... / I realized... / I noticed..."
            className="reflection-textarea"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSubmit();
              }
            }}
          />

          <div className="reflection-hint">
            💡 Tip: Compare today vs yesterday. What changed?
          </div>
        </div>

        <div className="reflection-footer">
          <button onClick={handleSkip} className="reflection-skip">
            Skip for today
          </button>
          <button 
            onClick={handleSubmit} 
            className="reflection-submit"
            disabled={!inputValue.trim()}
          >
            Save & Continue →
          </button>
        </div>
      </div>
    </>
  );
}
