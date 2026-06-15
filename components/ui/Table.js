export default function Table({ columns, data, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-white shadow-card ${className}`}>
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-surface">
          <tr>
            {columns.map((column) => (
              <th key={column.accessor} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-surface">
              {columns.map((column) => (
                <td key={column.accessor} className="px-4 py-4 text-sm text-primary">
                  {row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
