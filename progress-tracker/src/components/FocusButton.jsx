export default function FocusButton({ onClick, isActive }) {
  return (
    <button 
      className={`focus-header-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
      title="Start a focus session"
    >
      🎯
      <span className="focus-btn-text">Start Focus</span>
    </button>
  );
}
