import { useEffect, useState } from 'react'
import CrudPage from './CrudPage'
import ubicacionService from '../services/ubicacionService'

function Ubicaciones() {
  const [lugares, setLugares] = useState([])

  useEffect(() => {
    async function load() {
      const data = await ubicacionService.getAll()
      setLugares(data.filter((u) => String(u.tipo).toUpperCase() === 'LUGAR'))
    }
    load()
  }, [])

  return (
    <CrudPage
      title="Gestion de ubicaciones"
      service={ubicacionService}
      entityName="ubicacion"
      idKey="id_ubicacion"
      defaultValues={{ nombre: '', tipo: 'LUGAR', id_padre: '', descripcion: '', activo: 'SI' }}
      searchKeys={['nombre', 'tipo', 'descripcion']}
      columns={[
        { key: 'nombre', header: 'Nombre' },
        { key: 'tipo', header: 'Tipo' },
        { key: 'id_padre', header: 'Id padre' },
        { key: 'descripcion', header: 'Descripcion' },
        { key: 'activo', header: 'Estado', type: 'badge' },
      ]}
      fields={[
        { name: 'nombre', label: 'Nombre' },
        {
          name: 'tipo',
          label: 'Tipo',
          type: 'select',
          options: [
            { value: 'LUGAR', label: 'LUGAR' },
            { value: 'FACULTAD', label: 'FACULTAD' },
          ],
        },
        {
          name: 'id_padre',
          label: 'Lugar padre (si es FACULTAD)',
          type: 'select',
          options: [
            { value: '', label: 'Sin padre' },
            ...lugares.map((l) => ({ value: String(l.id_ubicacion), label: l.nombre })),
          ],
        },
        { name: 'descripcion', label: 'Descripcion' },
        {
          name: 'activo',
          label: 'Activo',
          type: 'select',
          options: [
            { value: 'SI', label: 'Activo' },
            { value: 'NO', label: 'Inactivo' },
          ],
        },
      ]}
    />
  )
}

export default Ubicaciones
