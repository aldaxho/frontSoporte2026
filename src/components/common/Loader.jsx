function Loader({ message = 'Cargando...' }) {
  return (
    <div className="flex items-center gap-2 text-slate-600">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <span className="text-sm">{message}</span>
    </div>
  )
}

export default Loader
