import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title = 'Nothing found', message = 'Try changing filters or search terms.', action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <PackageSearch className="h-10 w-10 text-slate-400" />
      <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      <p className="max-w-md text-sm text-slate-500">{message}</p>
      {action}
    </div>
  );
}
