export function required(value) {
  if (value === null || value === undefined || value === '') {
    return 'Campo obligatorio.'
  }
  return ''
}

export function validateTimeRange(start, end) {
  if (!start || !end) return ''
  return start >= end ? 'La hora inicio debe ser menor a la hora fin.' : ''
}
