import { Star } from 'lucide-react';

export default function Rating({ value = 0, count }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
        />
      ))}
      <span className="ml-1 text-slate-500">{value?.toFixed ? value.toFixed(1) : value}{count ? ` (${count})` : ''}</span>
    </div>
  );
}
