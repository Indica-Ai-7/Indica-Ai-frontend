const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')
const TITULOS_ENDPOINT = `${API_BASE}/titulos`

async function request(url, signal) {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`A API respondeu com status ${response.status}.`)
  }

  return response.json()
}

export async function getTitulos({ signal } = {}) {
  const params = new URLSearchParams({ _page: '1', _limit: '1000' })
  const titulos = await request(`${TITULOS_ENDPOINT}?${params}`, signal)

  if (!Array.isArray(titulos)) {
    throw new Error('A resposta da API não contém uma lista de títulos.')
  }

  return titulos
}

export function getTitulo(id, { signal } = {}) {
  return request(`${TITULOS_ENDPOINT}/${encodeURIComponent(id)}`, signal)
}