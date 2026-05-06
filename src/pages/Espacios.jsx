import { useEffect, useMemo, useState } from 'react'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import DataTable from '../components/common/DataTable'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Select from '../components/common/Select'
import espacioService from '../services/espacioService'
import tipoEspacioService from '../services/tipoEspacioService'
import ubicacionService from '../services/ubicacionService'

const initialForm = {
  codigo: '',
  nombre: '',
  capacidad: '',
  piso: '',
  uso_para_clases: true,
  latitud: '',
  longitud: '',
  estado: 'ACTIVO',
  observaciones: '',
  ubicacion_id: '',
  tipo_espacio_id: '',
  activo: true,
}

function Espacios() {
  const [items, setItems] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])
  const [tipos, setTipos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [facultadFilter, setFacultadFilter] = useState('')
  const [estadoFilter, setEstadoFilter] = useState('')
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [showModal, setShowModal] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const loadLookups = async () => {
    try {
      setError('')
      const [ubicacionesResp, tiposResp] = await Promise.all([
        ubicacionService.getAll(),
        tipoEspacioService.getAll(),
      ])
      // normalize keys so UI expects `id`
      setUbicaciones(ubicacionesResp.map((u) => ({ ...u, id: u.id_ubicacion ?? u.id })))
      setTipos(tiposResp.map((t) => ({ ...t, id: t.id_tipo_espacio ?? t.id })))
    } catch (err) {
      setError(err.message)
    }
  }

  const loadItems = async (params = {}) => {
    try {
      setLoading(true)
      setError('')
      const espacios = await espacioService.getAll(params)
      // normalize espacios so UI can use `id` and `ubicacion_id`/`tipo_espacio_id`
      setItems(
        espacios.map((e) => ({
          ...e,
          id: e.id_espacio ?? e.id,
          ubicacion_id: e.id_ubicacion ?? e.ubicacion_id,
          tipo_espacio_id: e.id_tipo_espacio ?? e.tipo_espacio_id,
        })),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLookups()
    loadItems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const facultades = useMemo(
    () => ubicaciones.filter((u) => String(u.tipo).toUpperCase() === 'FACULTAD'),
    [ubicaciones],
  )

  const lugaresMap = useMemo(() => {
    const map = {}
    ubicaciones.forEach((u) => {
      map[u.id] = u
    })
    return map
  }, [ubicaciones])

  const withLabels = useMemo(
    () =>
      items.map((item) => {
        const facultad = lugaresMap[item.ubicacion_id]
        const lugar = facultad?.id_padre ? lugaresMap[facultad.id_padre] : null
        return {
          ...item,
          facultadNombre: facultad?.nombre || '-',
          lugarNombre: lugar?.nombre || '-',
          latLongPendiente: !item.latitud || !item.longitud,
        }
      }),
    [items, lugaresMap],
  )

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim()
    return withLabels.filter((item) => {
      const matchesSearch =
        !text ||
        String(item.codigo ?? '').toLowerCase().includes(text) ||
        String(item.nombre ?? '').toLowerCase().includes(text) ||
        String(item.facultadNombre ?? '').toLowerCase().includes(text) ||
        String(item.lugarNombre ?? '').toLowerCase().includes(text)

      const matchesFacultad =
        !facultadFilter || String(item.ubicacion_id) === String(facultadFilter)
      const matchesEstado =
        !estadoFilter || String(item.estado || '').toUpperCase() === estadoFilter

      return matchesSearch && matchesFacultad && matchesEstado
    })
  }, [withLabels, search, facultadFilter, estadoFilter])

  useEffect(() => {
    const params = {}
    if (search && String(search).trim()) params.search = String(search).trim()
    if (facultadFilter) params.id_ubicacion = facultadFilter
    if (estadoFilter) params.estado = estadoFilter
    loadItems(params)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, facultadFilter, estadoFilter])

  const openCreate = () => {
    setSelected(null)
    setForm(initialForm)
    setShowModal(true)
  }

  const openEdit = (row) => {
    setSelected(row)
    setForm({
      ...initialForm,
      ...row,
      uso_para_clases: Boolean(row.uso_para_clases),
      activo: Boolean(row.activo),
    })
    setShowModal(true)
  }

  const openDetail = (row) => {
    setSelected(row)
    setShowDetail(true)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!form.codigo || !form.nombre || !form.ubicacion_id) {
      setError('Aula, descripcion y facultad son obligatorios.')
      return
    }
    try {
      const payload = {
        codigo: form.codigo,
        nombre: form.nombre,
        capacidad: form.capacidad ? Number(form.capacidad) : null,
        piso: form.piso ? Number(form.piso) : null,
        uso_para_clases: form.uso_para_clases,
        latitud: form.latitud || null,
        longitud: form.longitud || null,
        estado: form.estado,
        observaciones: form.observaciones || null,
        id_ubicacion: form.ubicacion_id,
        id_tipo_espacio: form.tipo_espacio_id,
      }
      if (selected?.id) {
        await espacioService.update(selected.id, payload)
      } else {
        await espacioService.create(payload)
      }
      setShowModal(false)
      await loadItems()
    } catch (err) {
      setError(err.message)
    }
  }

  const onDelete = async (id) => {
    const ok = window.confirm(
      'Eliminar espacio? Solo se debe eliminar si no tiene asignaciones.',
    )
    if (!ok) return
    try {
      await espacioService.remove(id)
      await fetchData()
    } catch (err) {
      setError(err.message)
    }
  }

  const columns = [
    { key: 'codigo', header: 'Aula' },
    { key: 'nombre', header: 'Descripcion' },
    { key: 'lugarNombre', header: 'Lugar' },
    { key: 'facultadNombre', header: 'Facultad' },
    { key: 'capacidad', header: 'Capacidad' },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => <Badge value={row.estado} />,
    },
    {
      key: 'latitud',
      header: 'Latitud',
      render: (row) => row.latitud || <span className="text-amber-600">Pendiente</span>,
    },
    {
      key: 'longitud',
      header: 'Longitud',
      render: (row) => row.longitud || <span className="text-amber-600">Pendiente</span>,
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => openDetail(row)}>
            Ver
          </Button>
          <Button variant="secondary" onClick={() => openEdit(row)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => onDelete(row.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">Gestion de espacios</h2>
          <Button onClick={openCreate}>Nuevo espacio</Button>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <Input
            placeholder="Buscar por aula, facultad o lugar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Select
            value={facultadFilter}
            onChange={(event) => setFacultadFilter(event.target.value)}
            options={[
              { value: '', label: 'Todas las facultades' },
              ...facultades.map((f) => ({ value: String(f.id), label: f.nombre })),
            ]}
          />
          <Select
            value={estadoFilter}
            onChange={(event) => setEstadoFilter(event.target.value)}
            options={[
              { value: '', label: 'Todos los estados' },
              { value: 'ACTIVO', label: 'Activo' },
              { value: 'INACTIVO', label: 'Inactivo' },
            ]}
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <DataTable columns={columns} rows={filtered} loading={loading} />

      <Modal
        isOpen={showDetail}
        title="Detalle de espacio"
        onClose={() => setShowDetail(false)}
      >
        {selected ? (
          <div className="grid grid-cols-1 gap-2 text-sm text-slate-700 md:grid-cols-2">
            <p>
              <b>Aula:</b> {selected.codigo}
            </p>
            <p>
              <b>Descripcion:</b> {selected.nombre}
            </p>
            <p>
              <b>Capacidad:</b> {selected.capacidad || '-'}
            </p>
            <p>
              <b>Estado:</b> {selected.estado || '-'}
            </p>
            <p>
              <b>Latitud:</b> {selected.latitud || 'Pendiente'}
            </p>
            <p>
              <b>Longitud:</b> {selected.longitud || 'Pendiente'}
            </p>
            <p className="md:col-span-2">
              <b>Observaciones:</b> {selected.observaciones || '-'}
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={showModal}
        title={selected ? 'Editar espacio' : 'Nuevo espacio'}
        onClose={() => setShowModal(false)}
      >
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <Input
            label="Aula"
            value={form.codigo}
            onChange={(event) => setForm((s) => ({ ...s, codigo: event.target.value }))}
          />
          <Input
            label="Descripcion"
            value={form.nombre}
            onChange={(event) => setForm((s) => ({ ...s, nombre: event.target.value }))}
          />
          <Select
            label="Facultad"
            value={form.ubicacion_id}
            onChange={(event) =>
              setForm((s) => ({ ...s, ubicacion_id: event.target.value }))
            }
            options={[
              { value: '', label: 'Seleccione facultad...' },
              ...facultades.map((f) => ({ value: String(f.id), label: f.nombre })),
            ]}
          />
          <Select
            label="Tipo de espacio"
            value={form.tipo_espacio_id}
            onChange={(event) =>
              setForm((s) => ({ ...s, tipo_espacio_id: event.target.value }))
            }
            options={[
              { value: '', label: 'Seleccione tipo...' },
              ...tipos.map((t) => ({ value: String(t.id), label: t.nombre })),
            ]}
          />
          <Input
            label="Capacidad"
            type="number"
            value={form.capacidad}
            onChange={(event) => setForm((s) => ({ ...s, capacidad: event.target.value }))}
          />
          <Input
            label="Piso"
            type="number"
            value={form.piso}
            onChange={(event) => setForm((s) => ({ ...s, piso: event.target.value }))}
          />
          <Input
            label="Latitud"
            value={form.latitud}
            onChange={(event) => setForm((s) => ({ ...s, latitud: event.target.value }))}
          />
          <Input
            label="Longitud"
            value={form.longitud}
            onChange={(event) => setForm((s) => ({ ...s, longitud: event.target.value }))}
          />
          <Select
            label="Estado"
            value={form.estado}
            onChange={(event) => setForm((s) => ({ ...s, estado: event.target.value }))}
            options={[
              { value: 'ACTIVO', label: 'Activo' },
              { value: 'INACTIVO', label: 'Inactivo' },
            ]}
          />
          <Input
            label="Observaciones"
            value={form.observaciones}
            onChange={(event) =>
              setForm((s) => ({ ...s, observaciones: event.target.value }))
            }
          />
          <div className="col-span-full flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export default Espacios
