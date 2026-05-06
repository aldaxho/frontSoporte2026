import { useEffect, useState } from 'react'
import CrudPage from './CrudPage'
import carreraService from '../services/carreraService'
import materiaService from '../services/materiaService'

function Materias() {
  const [carreras, setCarreras] = useState([])

  useEffect(() => {
    async function load() {
      const data = await carreraService.getAll()
      setCarreras(data)
    }
    load()
  }, [])

  return (
    <CrudPage
      title="Gestion de materias"
      service={materiaService}
      entityName="materia"
      defaultValues={{ carrera_id: '', sigla: '', nombre: '', activo: true }}
      searchKeys={['sigla', 'nombre']}
      columns={[
        { key: 'carrera_id', header: 'Carrera' },
        { key: 'sigla', header: 'Sigla' },
        { key: 'nombre', header: 'Nombre' },
      ]}
      fields={[
        {
          name: 'carrera_id',
          label: 'Carrera',
          type: 'select',
          options: [
            { value: '', label: 'Seleccione carrera...' },
            ...carreras.map((c) => ({ value: String(c.id), label: c.nombre })),
          ],
        },
        { name: 'sigla', label: 'Sigla' },
        { name: 'nombre', label: 'Nombre' },
      ]}
    />
  )
}

export default Materias
