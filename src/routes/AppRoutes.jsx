import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../components/layout/MainLayout'
import AuditoriaAsignaciones from '../pages/AuditoriaAsignaciones'
import AuditoriaEspacios from '../pages/AuditoriaEspacios'
import Carreras from '../pages/Carreras'
import Dashboard from '../pages/Dashboard'
import Espacios from '../pages/Espacios'
import GruposMateria from '../pages/GruposMateria'
import HorariosAsignacion from '../pages/HorariosAsignacion'
import Materias from '../pages/Materias'
import TiposEspacio from '../pages/TiposEspacio'
import Ubicaciones from '../pages/Ubicaciones'
import Usuarios from '../pages/Usuarios'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/espacios" element={<Espacios />} />
        <Route path="/ubicaciones" element={<Ubicaciones />} />
        <Route path="/tipos-espacio" element={<TiposEspacio />} />
        <Route path="/carreras" element={<Carreras />} />
        <Route path="/materias" element={<Materias />} />
        <Route path="/grupos-materia" element={<GruposMateria />} />
        <Route path="/horarios-asignacion" element={<HorariosAsignacion />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/auditoria-espacios" element={<AuditoriaEspacios />} />
        <Route path="/auditoria-asignaciones" element={<AuditoriaAsignaciones />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
