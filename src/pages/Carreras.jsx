import CrudPage from './CrudPage'
import carreraService from '../services/carreraService'

function Carreras() {
  return (
    <CrudPage
      title="Gestion de carreras"
      service={carreraService}
      entityName="carrera"
      defaultValues={{ nombre: '', sigla: '', activo: true }}
      searchKeys={['nombre', 'sigla']}
      columns={[
        { key: 'nombre', header: 'Nombre' },
        { key: 'sigla', header: 'Sigla' },
      ]}
      fields={[
        { name: 'nombre', label: 'Nombre' },
        { name: 'sigla', label: 'Sigla' },
      ]}
    />
  )
}

export default Carreras
