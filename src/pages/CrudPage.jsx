import { useEffect, useMemo, useState } from 'react'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import DataTable from '../components/common/DataTable'
import Input from '../components/common/Input'
import Modal from '../components/common/Modal'
import Select from '../components/common/Select'

function CrudPage({
  title,
  service,
  fields = [],
  columns = [],
  searchKeys = [],
  defaultValues = {},
  entityName = 'registro',
  idKey = 'id',
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(defaultValues)

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await service.getAll()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = useMemo(() => {
    const text = search.toLowerCase().trim()
    if (!text) return items
    return items.filter((item) =>
      searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(text)),
    )
  }, [items, search, searchKeys])

  const openCreate = () => {
    setSelected(null)
    setForm(defaultValues)
    setIsOpen(true)
  }

  const openEdit = (item) => {
    setSelected(item)
    setForm({ ...defaultValues, ...item })
    setIsOpen(true)
  }

  const onChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }))

  const onSubmit = async (event) => {
    event.preventDefault()
    try {
      // Excluir campos vacíos y null
      const payload = Object.entries(form).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {})

      if (selected?.[idKey]) {
        await service.update(selected[idKey], payload)
      } else {
        await service.create(payload)
      }
      setIsOpen(false)
      setForm(defaultValues)
      await loadData()
    } catch (err) {
      setError(err.message)
      console.error('Error al guardar:', err)
    }
  }

  const onDelete = async (id) => {
    const ok = window.confirm(`Seguro que deseas eliminar este ${entityName}?`)
    if (!ok) return
    try {
      await service.remove(id)
      await loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const actionColumn = {
    key: 'acciones',
    header: 'Acciones',
    render: (row) => (
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => openEdit(row)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => onDelete(row[idKey])}>
          Eliminar
        </Button>
      </div>
    ),
  }

  const normalizedColumns = [...columns, actionColumn].map((column) =>
    column.type === 'badge'
      ? {
          ...column,
          render: (row) => <Badge value={row[column.key]} />,
        }
      : column,
  )

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <Button onClick={openCreate}>Nuevo</Button>
        </div>
        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <DataTable columns={normalizedColumns} rows={filtered} loading={loading} />

      <Modal
        isOpen={isOpen}
        title={selected ? `Editar ${entityName}` : `Nuevo ${entityName}`}
        onClose={() => setIsOpen(false)}
      >
        <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onSubmit}>
          {fields.map((field) =>
            field.type === 'select' ? (
              (() => {
                const selectValue = form[field.name] == null ? '' : String(form[field.name])
                const baseOptions = field.options || [{ value: '', label: 'Seleccione...' }]
                const hasCurrentValue = baseOptions.some(
                  (option) => String(option.value) === selectValue,
                )
                const options =
                  selectValue && !hasCurrentValue
                    ? [{ value: selectValue, label: selectValue }, ...baseOptions]
                    : baseOptions

                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    value={selectValue}
                    onChange={(event) => onChange(field.name, event.target.value)}
                    options={options}
                  />
                )
              })()
            ) : field.type === 'checkbox' ? (
              <div key={field.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={field.name}
                  checked={form[field.name] ?? false}
                  onChange={(event) => onChange(field.name, event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor={field.name} className="text-sm font-medium text-slate-700">
                  {field.label}
                </label>
              </div>
            ) : (
              <Input
                key={field.name}
                label={field.label}
                type={field.type || 'text'}
                value={form[field.name] ?? ''}
                onChange={(event) => onChange(field.name, event.target.value)}
              />
            ),
          )}
          <div className="col-span-full flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </section>
  )
}

export default CrudPage
