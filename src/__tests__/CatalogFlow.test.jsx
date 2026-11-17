import { vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'

const { getTitulos, getTitulo, createTitulo } = vi.hoisted(() => ({
  getTitulos: vi.fn(),
  getTitulo: vi.fn(),
  createTitulo: vi.fn(),
}))

vi.mock('../api/titulos.js', () => ({ getTitulos, getTitulo, createTitulo }))

import App from '../App.jsx'
import Poster from '../components/Poster.jsx'

const drama = {
  id: 'wikidata-Q1',
  titulo: 'Coração de Outono',
  tipo: 'filme',
  ano: 2020,
  generos: ['drama'],
  descricao: 'Uma história sobre recomeços.',
  palavrasChave: ['família'],
  fonte: { nome: 'Wikidata', url: 'https://www.wikidata.org/wiki/Q1' },
}

const series = {
  id: 'wikidata-Q2',
  titulo: 'Linha Norte',
  tipo: 'serie',
  ano: 2022,
  generos: ['mistério'],
  descricao: 'Uma investigação em uma cidade costeira.',
  palavrasChave: [],
  fonte: { nome: 'Wikidata', url: 'https://www.wikidata.org/wiki/Q2' },
}

beforeEach(() => {
  window.history.replaceState({}, '', '/')
  window.scrollTo = vi.fn()
  getTitulos.mockReset()
  getTitulo.mockReset()
  createTitulo.mockReset()
})

afterEach(cleanup)

describe('fluxo do catálogo', () => {
  it('mantém o estado de carregamento até a resposta da API', async () => {
    let resolveTitles
    getTitulos.mockReturnValue(new Promise((resolve) => { resolveTitles = resolve }))
    render(<App />)

    expect(screen.getByText('Carregando títulos do catálogo')).toBeTruthy()

    await act(async () => resolveTitles([drama]))
    expect(await screen.findByRole('button', { name: /Coração de Outono/ })).toBeTruthy()
  })

  it('filtra títulos ignorando acentos', async () => {
    getTitulos.mockResolvedValue([drama, series])
    render(<App />)

    const search = await screen.findByRole('searchbox', { name: 'Buscar no catálogo' })
    fireEvent.change(search, { target: { value: 'coracao' } })

    expect(screen.getByRole('button', { name: /Coração de Outono/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Linha Norte/ })).toBeNull()
  })

  it('abre o título selecionado e carrega seus detalhes pela API', async () => {
    getTitulos.mockResolvedValue([drama])
    getTitulo.mockResolvedValue(drama)
    render(<App />)

    fireEvent.click(await screen.findByRole('button', { name: /Coração de Outono/ }))

    expect(await screen.findByRole('heading', { level: 1, name: drama.titulo })).toBeTruthy()
    expect(screen.getByText(drama.descricao)).toBeTruthy()
    expect(window.location.search).toBe('?titulo=wikidata-Q1')
    expect(getTitulo).toHaveBeenCalledWith(drama.id, expect.objectContaining({ signal: expect.any(AbortSignal) }))
  })

  it('mostra um estado próprio quando o catálogo está vazio', async () => {
    getTitulos.mockResolvedValue([])
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Nenhum título cadastrado.' })).toBeTruthy()
  })

  it('informa falha HTTP e permite tentar de novo', async () => {
    getTitulos.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([series])
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'O catálogo não carregou.' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByRole('button', { name: /Linha Norte/ })).toBeTruthy()
  })

  it('mostra erro quando a API não retorna o detalhe solicitado', async () => {
    window.history.replaceState({}, '', '/?titulo=missing-id')
    getTitulo.mockRejectedValue(new Error('not found'))
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Não foi possível abrir este título.' })).toBeTruthy()
  })

  it('usa uma capa local quando a imagem do título falha', () => {
    const titleWithImage = { ...drama, imagem: 'https://example.invalid/poster.jpg' }
    render(<Poster titulo={titleWithImage} />)

    fireEvent.error(screen.getByRole('img', { name: 'Imagem de Coração de Outono' }))

    expect(screen.getByRole('img', { name: 'Capa indisponível para Coração de Outono' })).toBeTruthy()
  })

  it('atualiza o catálogo após um cadastro confirmado pela API', async () => {
    const createdTitle = {
      id: 'new-title-id',
      titulo: 'Horizonte Azul',
      tipo: 'filme',
      ano: 2024,
      generos: ['drama'],
      descricao: 'Uma jornada por lugares desconhecidos.',
      palavrasChave: [],
    }
    getTitulos.mockResolvedValueOnce([drama]).mockResolvedValueOnce([drama, createdTitle]).mockResolvedValueOnce([drama, createdTitle])
    createTitulo.mockResolvedValue(createdTitle)
    render(<App />)

    fireEvent.click(await screen.findByRole('link', { name: 'Cadastrar título' }))
    fireEvent.change(screen.getByLabelText('Título *'), { target: { value: createdTitle.titulo } })
    fireEvent.change(screen.getByLabelText('Ano *'), { target: { value: String(createdTitle.ano) } })
    fireEvent.change(screen.getByLabelText('Gêneros *'), { target: { value: createdTitle.generos.join(', ') } })
    fireEvent.change(screen.getByLabelText('Descrição *'), { target: { value: createdTitle.descricao } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar título' }))

    expect(await screen.findByText('Título “Horizonte Azul” cadastrado com sucesso.')).toBeTruthy()
    expect(await screen.findByRole('button', { name: /Horizonte Azul/ })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Dispensar aviso' }))
    expect(screen.queryByText('Título “Horizonte Azul” cadastrado com sucesso.')).toBeNull()
    expect(getTitulos).toHaveBeenCalledTimes(2)
    expect(createTitulo).toHaveBeenCalledWith(expect.objectContaining({
      titulo: createdTitle.titulo,
      tipo: createdTitle.tipo,
      ano: createdTitle.ano,
    }))

    cleanup()
    render(<App />)
    expect(await screen.findByRole('button', { name: /Horizonte Azul/ })).toBeTruthy()
  })
})