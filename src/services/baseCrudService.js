import axiosConfig from '../api/axiosConfig'

export function createCrudService(resource) {
  return {
    getAll: async (params = {}) => {
      const { data } = await axiosConfig.get(`/${resource}`, { params })
      return Array.isArray(data) ? data : data?.data || []
    },
    getById: async (id) => {
      const { data } = await axiosConfig.get(`/${resource}/${id}`)
      return data?.data || data
    },
    create: async (payload) => {
      const { data } = await axiosConfig.post(`/${resource}`, payload)
      return data
    },
    update: async (id, payload) => {
      const { data } = await axiosConfig.put(`/${resource}/${id}`, payload)
      return data
    },
    remove: async (id) => {
      const { data } = await axiosConfig.delete(`/${resource}/${id}`)
      return data
    },
  }
}
