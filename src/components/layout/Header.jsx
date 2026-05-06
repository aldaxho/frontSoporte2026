function Header({ title }) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
    </header>
  )
}

export default Header
