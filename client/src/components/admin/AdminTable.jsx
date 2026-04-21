export default function AdminTable({ columns, rows, renderActions }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left font-bold text-slate-700">{column.label}</th>
              ))}
              {renderActions && <th className="px-4 py-3 text-right font-bold text-slate-700">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row._id} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3 text-slate-700">{column.render ? column.render(row) : row[column.key]}</td>
                ))}
                {renderActions && <td className="px-4 py-3 text-right">{renderActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
