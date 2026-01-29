export default function SkeletonLoader({ count = 5 }) {
  return (
    <div className="skeleton-container">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-line"></div>
      ))}
    </div>
  );
}
