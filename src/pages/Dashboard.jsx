import { useEffect, useState } from 'react'
import carreraService from '../services/carreraService'
import espacioService from '../services/espacioService'
import horarioAsignacionService from '../services/horarioAsignacionService'
import materiaService from '../services/materiaService'
import ubicacionService from '../services/ubicacionService'

function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
    </article>
  )
}

function Dashboard() {
  const [stats, setStats] = useState({
    espacios: 0,
    facultades: 0,
    carreras: 0,
    materias: 0,
    asignaciones: 0,
    sinCoordenadas: 0,
    activos: 0,
    inactivos: 0,
  })

  useEffect(() => {
    async function load() {
      try {
        const [espacios, ubicaciones, carreras, materias, asignaciones] = await Promise.all([
          espacioService.getAll(),
          ubicacionService.getAll(),
          carreraService.getAll(),
          materiaService.getAll(),
          horarioAsignacionService.getAll(),
        ])

        const facultades = ubicaciones.filter(
          (u) => String(u.tipo).toUpperCase() === 'FACULTAD',
        ).length
        const sinCoordenadas = espacios.filter((e) => !e.latitud || !e.longitud).length
        const activos = espacios.filter((e) => e.activo === true || e.activo === 1).length

        setStats({
          espacios: espacios.length,
          facultades,
          carreras: carreras.length,
          materias: materias.length,
          asignaciones: asignaciones.length,
          sinCoordenadas,
          activos,
          inactivos: espacios.length - activos,
        })
      } catch {
        // Dashboard tolera fallos parciales.
      }
    }
    load()
  }, [])

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total de espacios" value={stats.espacios} />
      <StatCard label="Total de facultades" value={stats.facultades} />
      <StatCard label="Total de carreras" value={stats.carreras} />
      <StatCard label="Total de materias" value={stats.materias} />
      <StatCard label="Total de asignaciones" value={stats.asignaciones} />
      <StatCard label="Espacios sin latitud/longitud" value={stats.sinCoordenadas} />
      <StatCard label="Espacios activos" value={stats.activos} />
      <StatCard label="Espacios inactivos" value={stats.inactivos} />
    </section>
  )
}

export default Dashboard
