import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/common/DataTable'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import registroEspacioService from '../services/registroEspacioService'
import { formatDate } from '../utils/formatDate'

function AuditoriaEspacios() {
  const [items, setItems] = useState([])
  const [filters, setFilters] = useState({
    usuario: '',
    accion: '',
    fecha: '',
    espacio: '',
  })

  useEffect(() => {
    async function load() {
      const data = await registroEspacioService.getAll()
      setItems(data)
    }
    load()
  }, [])

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesUsuario =
          !filters.usuario ||
          String(item.usuario || '').toLowerCase().includes(filters.usuario.toLowerCase())
        const matchesAccion =
          !filters.accion ||
          String(item.accion || '').toLowerCase().includes(filters.accion.toLowerCase())
        const matchesFecha = !filters.fecha || String(item.fecha || '').startsWith(filters.fecha)
        const matchesEspacio =
          !filters.espacio ||
          String(item.espacio || '').toLowerCase().includes(filters.espacio.toLowerCase())
        return matchesUsuario && matchesAccion && matchesFecha && matchesEspacio
      }),
    [items, filters],
  )

  return (
    <section className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-4">
        <Input
          placeholder="Filtrar por usuario"
          value={filters.usuario}
          onChange={(event) => setFilters((s) => ({ ...s, usuario: event.target.value }))}
        />
        <Input
          placeholder="Filtrar por accion"
          value={filters.accion}
          onChange={(event) => setFilters((s) => ({ ...s, accion: event.target.value }))}
        />
        <Input
          type="date"
          value={filters.fecha}
          onChange={(event) => setFilters((s) => ({ ...s, fecha: event.target.value }))}
        />
        <Input
          placeholder="Filtrar por espacio"
          value={filters.espacio}
          onChange={(event) => setFilters((s) => ({ ...s, espacio: event.target.value }))}
        />
      </div>
      <DataTable
        columns={[
          { key: 'fecha', header: 'Fecha', render: (row) => formatDate(row.fecha) },
          { key: 'usuario', header: 'Usuario' },
          { key: 'accion', header: 'Accion' },
          { key: 'detalle', header: 'Detalle' },
          { key: 'espacio', header: 'Espacio' },
        ]}
        rows={filtered}
      />
    </section>
  )
}

export default AuditoriaEspacios
