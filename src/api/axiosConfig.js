import axios from 'axios'

const axiosConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage = error?.response?.data?.message
    const message =
      serverMessage || 'Ocurrio un error al conectar con el servidor.'
    return Promise.reject(new Error(message))
  },
)

export default axiosConfig
