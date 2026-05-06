import CrudPage from './CrudPage'
import usuarioService from '../services/usuarioService'

function Usuarios() {
  return (
    <CrudPage
      title="Gestion de usuarios"
      service={usuarioService}
      entityName="usuario"
      defaultValues={{
        nombre_completo: '',
        correo: '',
        telefono: '',
        rol: 'RELEVADOR',
        activo: true,
      }}
      searchKeys={['nombre_completo', 'correo', 'rol']}
      columns={[
        { key: 'nombre_completo', header: 'Nombre completo' },
        { key: 'correo', header: 'Correo' },
        { key: 'telefono', header: 'Telefono' },
        { key: 'rol', header: 'Rol' },
        { key: 'activo', header: 'Estado', type: 'badge' },
      ]}
      fields={[
        { name: 'nombre_completo', label: 'Nombre completo' },
        { name: 'correo', label: 'Correo', type: 'email' },
        { name: 'telefono', label: 'Telefono' },
        {
          name: 'rol',
          label: 'Rol',
          type: 'select',
          options: [
            { value: 'ADMIN', label: 'ADMIN' },
            { value: 'RELEVADOR', label: 'RELEVADOR' },
            { value: 'COORDINADOR', label: 'COORDINADOR' },
          ],
        },
      ]}
    />
  )
}

export default Usuarios
