# Mapa de integracion Frontend / Backend

Documento de referencia rapida para ver, por modulo, que envia el frontend y que espera recibir el backend.

## Convenciones generales

- El frontend consume el backend en `http://localhost:3001/api`.
- Los listados usan `GET`.
- Los formularios de alta usan `POST`.
- Los formularios de edicion usan `PUT` con el identificador en la URL.
- Algunas pantallas del frontend filtran en memoria y no via backend.
- En varias entidades el backend usa nombres de llave distintos a `id`.

## 1. Ubicaciones

### Endpoints backend
- `GET /api/ubicaciones`
- `GET /api/ubicaciones/:id`
- `POST /api/ubicaciones`
- `PUT /api/ubicaciones/:id`
- `DELETE /api/ubicaciones/:id`

### Query params sugeridos (GET /api/ubicaciones)
- `?tipo=FACULTAD|LUGAR` — filtrar por tipo
- `?id_padre=10` — devolver hijos de un padre
- `?activo=SI|NO` — filtrar por estado
- `?search=texto` — búsqueda por nombre/descripcion

### Frontend envia
- `nombre`
- `tipo`
- `id_padre` opcional
- `descripcion` opcional
- `activo` opcional en create, obligatorio en update

### Backend recibe
- `nombre`
- `tipo`
- `id_padre` opcional
- `descripcion` opcional
- `activo` opcional en create, obligatorio en update

### Respuesta del backend
- `id_ubicacion`
- `nombre`
- `tipo`
- `id_padre`
- `nombre_padre`
- `descripcion`
- `activo`

### Nota
- El frontend debe usar `id_ubicacion` como llave principal.
- Si no se envia `id_padre` al editar, el backend conserva el padre actual.

## 2. Tipos de espacio

### Endpoints backend
- `GET /api/tipos-espacio`
- `GET /api/tipos-espacio/:id`
- `POST /api/tipos-espacio`
- `PUT /api/tipos-espacio/:id`
- `DELETE /api/tipos-espacio/:id`

### Query params sugeridos (GET /api/tipos-espacio)
- `?search=texto` — búsqueda por nombre

### Frontend envia
- `nombre`

### Backend recibe
- `nombre`

### Respuesta del backend
- `id_tipo_espacio`
- `nombre`

### Nota
- El frontend debe usar `id_tipo_espacio` como llave principal.

## 3. Espacios

### Endpoints backend
- `GET /api/espacios`
- `GET /api/espacios/:id`
- `POST /api/espacios`
- `PUT /api/espacios/:id`
- `DELETE /api/espacios/:id`

### Query params sugeridos (GET /api/espacios)
- `?search=texto` — búsqueda libre sobre `codigo`, `nombre`, `ubicacion` o `tipo_espacio`
- `?id_ubicacion=5` — filtrar por ubicacion (facultad o lugar)
- `?id_tipo_espacio=1` — filtrar por tipo de espacio
- `?estado=ACTIVO|INACTIVO` — filtrar por estado
- `?latitud_missing=true` — espacios sin coordenadas (útil para dashboard)
- `?limit=50&offset=0` — paginación

### Frontend envia
- `id_ubicacion`
- `id_tipo_espacio`
- `codigo`
- `nombre` opcional
- `capacidad` opcional
- `piso` opcional
- `uso_para_clases` opcional
- `latitud` opcional
- `longitud` opcional
- `estado` opcional en create, obligatorio en update
- `observaciones` opcional
- `id_usuario` obligatorio solo en update

### Backend recibe
- `id_ubicacion`
- `id_tipo_espacio`
- `codigo`
- `nombre` opcional
- `capacidad` opcional
- `piso` opcional
- `uso_para_clases` opcional
- `latitud` opcional
- `longitud` opcional
- `estado` opcional en create, obligatorio en update
- `observaciones` opcional
- `id_usuario` obligatorio solo en update

### Respuesta del backend
- `id_espacio`
- `id_ubicacion`
- `ubicacion`
- `id_tipo_espacio`
- `tipo_espacio`
- `codigo`
- `nombre`
- `capacidad`
- `piso`
- `uso_para_clases`
- `latitud`
- `longitud`
- `estado`
- `observaciones`
- `fecha_creacion`
- `fecha_actualizacion`

### Nota
- El frontend debe usar `id_espacio` como llave principal.
- Los filtros de la pantalla de espacios hoy son locales en el navegador.

## 4. Carreras

### Endpoints backend
- `GET /api/carreras`
- `GET /api/carreras/:id`
- `POST /api/carreras`
- `PUT /api/carreras/:id`
- `DELETE /api/carreras/:id`

### Query params sugeridos (GET /api/carreras)
- `?search=texto` — búsqueda por nombre o sigla

### Frontend envia
- `nombre`
- `sigla` opcional

### Backend recibe
- `nombre`
- `sigla` opcional

### Respuesta del backend
- `id_carrera`
- `nombre`
- `sigla`

### Nota
- El frontend debe usar `id_carrera` como llave principal.

## 5. Materias

### Endpoints backend
- `GET /api/materias`
- `GET /api/materias/:id`
- `POST /api/materias`
- `PUT /api/materias/:id`
- `DELETE /api/materias/:id`

### Query params sugeridos (GET /api/materias)
- `?search=texto` — búsqueda por nombre o sigla
- `?id_carrera=1` — filtrar por carrera
- `?limit=50&offset=0` — paginación

### Frontend envia
- `id_carrera` opcional
- `sigla`
- `nombre`

### Backend recibe
- `id_carrera` opcional
- `sigla`
- `nombre`

### Respuesta del backend
- `id_materia`
- `id_carrera`
- `carrera`
- `sigla_carrera`
- `sigla`
- `nombre`

### Nota
- El frontend debe usar `id_materia` como llave principal.

## 6. Grupos de materia

### Endpoints backend
- `GET /api/grupos-materia`
- `GET /api/grupos-materia/:id`
- `POST /api/grupos-materia`
- `PUT /api/grupos-materia/:id`
- `DELETE /api/grupos-materia/:id`

### Query params sugeridos (GET /api/grupos-materia)
- `?search=texto` — búsqueda por grupo o docente
- `?id_materia=1` — filtrar por materia
- `?activo=SI|NO` — filtrar por estado

### Frontend envia
- `id_materia`
- `grupo`
- `docente` opcional
- `gestion` opcional
- `periodo` opcional
- `cantidad_estudiantes` opcional
- `activo` opcional en create, obligatorio en update

### Backend recibe
- `id_materia`
- `grupo`
- `docente` opcional
- `gestion` opcional
- `periodo` opcional
- `cantidad_estudiantes` opcional
- `activo` opcional en create, obligatorio en update

### Respuesta del backend
- `id_grupo_materia`
- `id_materia`
- `materia`
- `sigla_materia`
- `carrera`
- `grupo`
- `docente`
- `gestion`
- `periodo`
- `cantidad_estudiantes`
- `activo`

### Nota
- El frontend debe usar `id_grupo_materia` como llave principal.

## 7. Horarios de asignacion

### Endpoints backend
- `GET /api/horarios-asignacion`
- `GET /api/horarios-asignacion/:id`
- `POST /api/horarios-asignacion`
- `PUT /api/horarios-asignacion/:id`
- `DELETE /api/horarios-asignacion/:id`

### Query params sugeridos (GET /api/horarios-asignacion)
- `?id_espacio=1` — filtrar por espacio
- `?id_grupo_materia=1` — filtrar por grupo
- `?dia_semana=LUNES` — filtrar por dia
- `?search=texto` — búsqueda por materia/grupo/espacio
- `?limit=50&offset=0` — paginación

### Frontend envia
- `id_espacio`
- `id_grupo_materia`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `modalidad` opcional
- `observaciones` opcional
- `activo` opcional en create, obligatorio en update
- `id_usuario` obligatorio solo en update

### Backend recibe
- `id_espacio`
- `id_grupo_materia`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `modalidad` opcional
- `observaciones` opcional
- `activo` opcional en create, obligatorio en update
- `id_usuario` obligatorio solo en update

### Respuesta del backend
- `id_horario`
- `id_espacio`
- `codigo_espacio`
- `espacio`
- `id_grupo_materia`
- `grupo`
- `sigla_materia`
- `materia`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `modalidad`
- `observaciones`
- `activo`

### Nota
- El frontend debe usar `id_horario` como llave principal.
- El backend genera auditoria automaticamente en updates.

## 8. Usuarios

### Endpoints backend
- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`

### Query params sugeridos (GET /api/usuarios)
- `?search=texto` — búsqueda por nombre o correo
- `?rol=ADMIN|RELEVADOR|COORDINADOR` — filtrar por rol
- `?activo=SI|NO` — filtrar por estado

### Frontend envia
- `id_grupo` opcional
- `nombre_completo`
- `correo` opcional
- `telefono` opcional
- `rol` opcional en create, obligatorio en update
- `activo` opcional en create, obligatorio en update

### Backend recibe
- `id_grupo` opcional
- `nombre_completo`
- `correo` opcional
- `telefono` opcional
- `rol` opcional en create, obligatorio en update
- `activo` opcional en create, obligatorio en update

### Respuesta del backend
- `id_usuario`
- `id_grupo`
- `nombre_completo`
- `correo`
- `telefono`
- `rol`
- `activo`

### Nota
- El frontend debe usar `id_usuario` como llave principal.

## 9. Auditoria de espacios

### Endpoints backend
- `GET /api/registros-espacio`
- `GET /api/registros-espacio/:id`

### Filtros backend soportados
- `?id_espacio=1`
- `?id_usuario=2`

### Query params sugeridos (GET /api/registros-espacio)
- `?usuario=texto` — búsqueda por nombre de usuario (server-side)
- `?accion=UPDATE|CREATE|DELETE` — filtrar por accion
- `?fecha_from=YYYY-MM-DD&fecha_to=YYYY-MM-DD` — rango por fecha
- `?espacio=texto` — búsqueda por codigo o nombre de espacio
- `?limit=50&offset=0` — paginación

### Frontend filtra localmente
- `usuario`
- `accion`
- `fecha`
- `espacio`

### Respuesta del backend
- `id_registro`
- `id_espacio`
- `codigo_espacio`
- `espacio`
- `id_usuario`
- `usuario`
- `fecha`
- `accion`
- `detalle`

### Nota
- Si quieres filtros por texto o por fecha desde el servidor, faltan query params en el backend.

## 10. Auditoria de asignaciones

### Endpoints backend
- `GET /api/registros-asignacion`
- `GET /api/registros-asignacion/:id`

### Filtros backend soportados
- `?id_horario=1`
- `?id_usuario=2`

### Query params sugeridos (GET /api/registros-asignacion)
- `?usuario=texto` — búsqueda por nombre de usuario (server-side)
- `?accion=UPDATE|CREATE|DELETE` — filtrar por accion
- `?fecha_from=YYYY-MM-DD&fecha_to=YYYY-MM-DD` — rango por fecha
- `?asignacion=texto` — búsqueda por identificador o texto de la asignacion
- `?limit=50&offset=0` — paginación

### Frontend filtra localmente
- `usuario`
- `accion`
- `fecha`
- `asignacion`

### Respuesta del backend
- `id_registro`
- `id_horario`
- `dia_semana`
- `hora_inicio`
- `hora_fin`
- `id_usuario`
- `usuario`
- `fecha`
- `accion`
- `detalle`

### Nota
- Si quieres filtros por texto o por fecha desde el servidor, faltan query params en el backend.

## 11. Ruta raiz

### Endpoint backend
- `GET /`

### Respuesta esperada
- `message: "API UAGRM Espacios funcionando correctamente"`

## Endpoint sugerido para Dashboard

- `GET /api/dashboard/resumen`

Respuesta sugerida (200):
```json
{
	"espacios": 1234,
	"facultades": 12,
	"carreras": 60,
	"materias": 450,
	"asignaciones": 3200,
	"sinCoordenadas": 200,
	"activos": 1100,
	"inactivos": 134
}
```

Este endpoint permite que el frontend no tenga que calcular contadores pesados y pueda paginar listados desde el servidor.

## 12. Funcionalidades que el frontend usa pero hoy estan solo en cliente

- Busqueda general en tablas del CRUD genérico.
- Filtros de auditoria por texto y fecha.
- Resumen de dashboard con conteos.
- Relacion de nombres amigables en tablas, por ejemplo facultad o carrera ya resuelta desde otros listados.

## 13. Funcionalidades que convendria agregar al backend si quieres filtrar mejor

- Filtros por `search` en listados generales.
- Filtros por `activo` y `estado` en listados generales.
- Filtros por relaciones, por ejemplo `id_carrera`, `id_ubicacion`, `id_tipo_espacio`.
- Endpoint de resumen para dashboard.
- Filtros por fecha, accion y texto en auditorias.

## Resumen rapido

| Modulo | Llave principal backend |
|---|---|
| Ubicaciones | `id_ubicacion` |
| Tipos de espacio | `id_tipo_espacio` |
| Espacios | `id_espacio` |
| Carreras | `id_carrera` |
| Materias | `id_materia` |
| Grupos de materia | `id_grupo_materia` |
| Horarios de asignacion | `id_horario` |
| Usuarios | `id_usuario` |
| Registros de espacio | `id_registro` |
| Registros de asignacion | `id_registro` |
