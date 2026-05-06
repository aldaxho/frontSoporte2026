import Loader from './Loader'

function DataTable({
  columns = [],
  rows = [],
  loading = false,
  emptyText = 'Sin datos disponibles.',
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {loading ? (
        <div className="p-4">
          <Loader message="Cargando datos..." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-3 py-2 text-left font-semibold">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length ? (
                rows.map((row, index) => (
                  <tr key={row.id ?? index} className="border-t border-slate-100">
                    {columns.map((column) => (
                      <td key={column.key} className="px-3 py-2 text-slate-700">
                        {column.render ? column.render(row) : row[column.key] ?? '-'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-6 text-center text-slate-500" colSpan={columns.length}>
                    {emptyText}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DataTable
