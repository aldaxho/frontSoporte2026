import { NavLink } from 'react-router-dom'
import {
  Building2,
  CalendarClock,
  ClipboardList,
  GraduationCap,
  Home,
  Layers,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react'

const menu = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/espacios', label: 'Espacios', icon: Building2 },
  { to: '/ubicaciones', label: 'Ubicaciones', icon: MapPin },
  { to: '/tipos-espacio', label: 'Tipos de espacio', icon: Layers },
  { to: '/carreras', label: 'Carreras', icon: GraduationCap },
  { to: '/materias', label: 'Materias', icon: ClipboardList },
  { to: '/grupos-materia', label: 'Grupos de materia', icon: ClipboardList },
  { to: '/horarios-asignacion', label: 'Asignaciones de horario', icon: CalendarClock },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/auditoria-espacios', label: 'Auditoria de espacios', icon: ShieldCheck },
  {
    to: '/auditoria-asignaciones',
    label: 'Auditoria de asignaciones',
    icon: ShieldCheck,
  },
]

function Sidebar() {
  return (
    <aside className="w-72 shrink-0 bg-slate-900 p-4 text-slate-100">
      <h2 className="mb-5 text-lg font-bold">UAGRM Espacios</h2>
      <nav className="space-y-1">
        {menu.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
