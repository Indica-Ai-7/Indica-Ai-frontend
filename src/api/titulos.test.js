import { afterEach, vi } from 'vitest'
import { createTitulo, getTitulos } from './titulos.js'

afterEach(() => vi.unstubAllGlobals())

describe('getTitulos', () => {
  it('recupera a lista completa, incluindo registros além do milésimo', async () => {
    const titles = Array.from({ length: 1001 }, (_, index) => ({ id: `title-${index}` }))
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(titles),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(getTitulos()).resolves.toHaveLength(1001)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/titulos', { signal: undefined })
  })
})

describe('createTitulo', () => {
  it('envia os dados em JSON e retorna a confirmação da API', async () => {
    const created = { id: 'uuid', titulo: 'Horizonte Azul' }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(created),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(createTitulo(created)).resolves.toEqual(created)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/titulos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
      signal: undefined,
    })
  })

  it('rejeita respostas HTTP malsucedidas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422 }))

    await expect(createTitulo({ titulo: 'Horizonte Azul' })).rejects.toThrow('status 422')
  })

  it('propaga falhas de comunicação', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    await expect(createTitulo({ titulo: 'Horizonte Azul' })).rejects.toThrow('offline')
  })
})
