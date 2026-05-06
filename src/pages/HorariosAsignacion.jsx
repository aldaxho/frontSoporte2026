import { useEffect, useMemo, useState } from 'react'
import Button from '../components/common/Button'
import DataTable from '../components/common/DataTable'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Select from '../components/common/Select'
import espacioService from '../services/espacioService'
import grupoMateriaService from '../services/grupoMateriaService'
import horarioAsignacionService from '../services/horarioAsignacionService'
import { validateTimeRange } from '../utils/validators'

const initial = {
  espacio_id: '',
  grupo_materia_id: '',
  dia_semana: '',
  hora_inicio: '',
  hora_fin: '',
  modalidad: '',
  observaciones: '',
  activo: true,
}

function HorariosAsignacion() {
  const [items, setItems] = useState([])
  const [espacios, setEspacios] = useState([])
  const [grupos, setGrupos] = useState([])
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(initial)

  const load = async () => {
    try {
      const [asig, esp, grp] = await Promise.all([
        horarioAsignacionService.getAll(),
        espacioService.getAll(),
        grupoMateriaService.getAll(),
      ])
      setItems(
        asig.map((a) => ({
          ...a,
          id: a.id_horario ?? a.id,
          espacio_id: a.id_espacio ?? a.espacio_id,
          grupo_materia_id: a.id_grupo_materia ?? a.grupo_materia_id,
        })),
      )
      setEspacios(esp.map((e) => ({ ...e, id: e.id_espacio ?? e.id })))
      setGrupos(grp.map((g) => ({ ...g, id: g.id_grupo_materia ?? g.id })))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const espacioOptions = useMemo(
    () =>
      espacios.map((e) => ({
        value: String(e.id),
        label: `${e.codigo} - ${e.nombre}`,
      })),
    [espacios],
  )

  const grupoOptions = useMemo(
    () =>
      grupos.map((g) => ({
        value: String(g.id),
        label: `${g.grupo} - ${g.docente || 'Sin docente'}`,
      })),
    [grupos],
  )

  const openCreate = () => {
    setSelected(null)
    setForm(initial)
    setOpen(true)
  }

  const openEdit = (row) => {
    setSelected(row)
    setForm({
      ...initial,
      espacio_id: row.espacio_id ?? row.id_espacio,
      grupo_materia_id: row.grupo_materia_id ?? row.id_grupo_materia,
      dia_semana: row.dia_semana,
      hora_inicio: row.hora_inicio,
      hora_fin: row.hora_fin,
      modalidad: row.modalidad,
      observaciones: row.observaciones,
      activo: row.activo ?? true,
    })
    setOpen(true)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!form.espacio_id || !form.grupo_materia_id || !form.dia_semana) {
      setError('Espacio, grupo y dia son obligatorios.')
      return
    }
    const timeError = validateTimeRange(form.hora_inicio, form.hora_fin)
    if (timeError) {
      setError(timeError)
      return
    }
    try {
      const payload = {
        id_espacio: form.espacio_id,
        id_grupo_materia: form.grupo_materia_id,
        dia_semana: form.dia_semana,
        hora_inicio: form.hora_inicio,
        hora_fin: form.hora_fin,
        modalidad: form.modalidad || null,
        observaciones: form.observaciones || null,
        activo: form.activo,
      }
      if (selected?.id) {
        await horarioAsignacionService.update(selected.id, payload)
      } else {
        await horarioAsignacionService.create(payload)
      }
      setOpen(false)
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm('Eliminar asignacion de horario?')) return
    await horarioAsignacionService.remove(id)
    await load()
  }

  const columns = [
    { key: 'espacio_id', header: 'Espacio' },
    { key: 'grupo_materia_id', header: 'Grupo materia' },
    { key: 'dia_semana', header: 'Dia' },
    { key: 'hora_inicio', header: 'Inicio' },
    { key: 'hora_fin', header: 'Fin' },
    { key: 'modalidad', header: 'Modalidad' },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Asignaciones de horario</h2>
          <Button onClick={openCreate}>Nueva asignacion</Button>
        </div>
      </div>
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      <DataTable columns={columns} rows={items} />
      <Modal
        isOpen={open}
        title={selected ? 'Editar asignacion' : 'Nueva asignacion'}
        onClose={() => setOpen(false)}
      >
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          <Select
            label="Espacio"
            value={form.espacio_id}
            onChange={(event) => setForm((s) => ({ ...s, espacio_id: event.target.value }))}
            options={[{ value: '', label: 'Seleccione...' }, ...espacioOptions]}
          />
          <Select
            label="Grupo materia"
            value={form.grupo_materia_id}
            onChange={(event) =>
              setForm((s) => ({ ...s, grupo_materia_id: event.target.value }))
            }
            options={[{ value: '', label: 'Seleccione...' }, ...grupoOptions]}
          />
          <Select
            label="Dia semana"
            value={form.dia_semana}
            onChange={(event) => setForm((s) => ({ ...s, dia_semana: event.target.value }))}
            options={[
              { value: '', label: 'Seleccione dia...' },
              { value: 'LUNES', label: 'Lunes' },
              { value: 'MARTES', label: 'Martes' },
              { value: 'MIERCOLES', label: 'Miercoles' },
              { value: 'JUEVES', label: 'Jueves' },
              { value: 'VIERNES', label: 'Viernes' },
              { value: 'SABADO', label: 'Sabado' },
            ]}
          />
          <Input
            label="Modalidad"
            value={form.modalidad}
            onChange={(event) => setForm((s) => ({ ...s, modalidad: event.target.value }))}
          />
          <Input
            label="Hora inicio"
            type="time"
            value={form.hora_inicio}
            onChange={(event) => setForm((s) => ({ ...s, hora_inicio: event.target.value }))}
          />
          <Input
            label="Hora fin"
            type="time"
            value={form.hora_fin}
            onChange={(event) => setForm((s) => ({ ...s, hora_fin: event.target.value }))}
          />
          <Input
            label="Observaciones"
            value={form.observaciones}
            onChange={(event) =>
              setForm((s) => ({ ...s, observaciones: event.target.value }))
            }
          />
          <div className="col-span-full flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export default HorariosAsignacion
