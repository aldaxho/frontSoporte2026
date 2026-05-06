import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const titleByPath = {
  '/': 'Dashboard',
  '/espacios': 'Espacios',
  '/ubicaciones': 'Ubicaciones',
  '/tipos-espacio': 'Tipos de espacio',
  '/carreras': 'Carreras',
  '/materias': 'Materias',
  '/grupos-materia': 'Grupos de materia',
  '/horarios-asignacion': 'Asignaciones de horario',
  '/usuarios': 'Usuarios',
  '/auditoria-espacios': 'Auditoria de espacios',
  '/auditoria-asignaciones': 'Auditoria de asignaciones',
}

function MainLayout() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={titleByPath[location.pathname] || 'Sistema UAGRM'} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
