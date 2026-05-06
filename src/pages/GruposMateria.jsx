import { useEffect, useState } from 'react'
import CrudPage from './CrudPage'
import grupoMateriaService from '../services/grupoMateriaService'
import materiaService from '../services/materiaService'

function GruposMateria() {
  const [materias, setMaterias] = useState([])

  useEffect(() => {
    async function load() {
      const data = await materiaService.getAll()
      setMaterias(data)
    }
    load()
  }, [])

  return (
    <CrudPage
      title="Gestion de grupos de materia"
      service={grupoMateriaService}
      entityName="grupo de materia"
      defaultValues={{
        materia_id: '',
        grupo: '',
        docente: '',
        gestion: '',
        periodo: '',
        cantidad_estudiantes: '',
        activo: true,
      }}
      searchKeys={['grupo', 'docente', 'gestion', 'periodo']}
      columns={[
        { key: 'materia_id', header: 'Materia' },
        { key: 'grupo', header: 'Grupo' },
        { key: 'docente', header: 'Docente' },
        { key: 'gestion', header: 'Gestion' },
        { key: 'periodo', header: 'Periodo' },
        { key: 'cantidad_estudiantes', header: 'Cant. estudiantes' },
        { key: 'activo', header: 'Estado', type: 'badge' },
      ]}
      fields={[
        {
          name: 'materia_id',
          label: 'Materia',
          type: 'select',
          options: [
            { value: '', label: 'Seleccione materia...' },
            ...materias.map((m) => ({ value: String(m.id), label: `${m.sigla} - ${m.nombre}` })),
          ],
        },
        { name: 'grupo', label: 'Grupo' },
        { name: 'docente', label: 'Docente' },
        { name: 'gestion', label: 'Gestion' },
        { name: 'periodo', label: 'Periodo' },
        { name: 'cantidad_estudiantes', label: 'Cantidad estudiantes', type: 'number' },
      ]}
    />
  )
}

export default GruposMateria
