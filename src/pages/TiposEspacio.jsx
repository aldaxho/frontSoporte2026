import CrudPage from './CrudPage'
import tipoEspacioService from '../services/tipoEspacioService'

function TiposEspacio() {
  return (
    <CrudPage
      title="Gestion de tipos de espacio"
      service={tipoEspacioService}
      entityName="tipo de espacio"
      defaultValues={{ nombre: '' }}
      searchKeys={['nombre']}
      columns={[{ key: 'nombre', header: 'Nombre' }]}
      fields={[{ name: 'nombre', label: 'Nombre' }]}
    />
  )
}

export default TiposEspacio
