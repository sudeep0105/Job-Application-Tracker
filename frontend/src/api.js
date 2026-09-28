const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export async function request(path, options = {}) {
  const token = localStorage.getItem('jobtrack-token')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || payload.error || 'Something went wrong. Please try again.')
  return payload
}

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (details) => request('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
}

export const jobsApi = {
  list: () => request('/applications'),
  create: (application) => request('/applications', { method: 'POST', body: JSON.stringify(toApiApplication(application)) }),
  update: (id, application) => request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(toApiApplication(application)) }),
  remove: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
}

function toApiApplication(application) {
  return { ...application, status: application.status?.toUpperCase() }
}
