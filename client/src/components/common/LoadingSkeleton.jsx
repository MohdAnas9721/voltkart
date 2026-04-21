export default function LoadingSkeleton({ rows = 8, className = '' }) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-200" />
      ))}
    </div>
  );
}
