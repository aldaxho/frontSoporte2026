function Badge({ value }) {
  const isActive =
    value === true ||
    value === 1 ||
    ['ACTIVO', 'SI', 'S', 'TRUE'].includes(String(value).toUpperCase())

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-semibold ${
        isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
      }`}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  )
}

export default Badge
