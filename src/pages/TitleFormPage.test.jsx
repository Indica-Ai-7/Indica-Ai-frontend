import { vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'

const { createTitulo } = vi.hoisted(() => ({ createTitulo: vi.fn() }))
vi.mock('../api/titulos.js', () => ({ createTitulo }))

import TitleFormPage from './TitleFormPage.jsx'

const validValues = {
  titulo: 'Horizonte Azul',
  tipo: 'filme',
  ano: '2024',
  generos: 'Drama, aventura',
  descricao: 'Uma jornada por lugares desconhecidos.',
  palavrasChave: '',
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText('Título *'), { target: { value: validValues.titulo } })
  fireEvent.change(screen.getByLabelText('Tipo *'), { target: { value: validValues.tipo } })
  fireEvent.change(screen.getByLabelText('Ano *'), { target: { value: validValues.ano } })
  fireEvent.change(screen.getByLabelText('Gêneros *'), { target: { value: validValues.generos } })
  fireEvent.change(screen.getByLabelText('Descrição *'), { target: { value: validValues.descricao } })
}

beforeEach(() => {
  createTitulo.mockReset()
})
afterEach(cleanup)

describe('formulário de cadastro de títulos', () => {
  it('identifica campos obrigatórios e valores fora do contrato', () => {
    createTitulo.mockResolvedValue({})
    render(<TitleFormPage onCancel={vi.fn()} onCreated={vi.fn()} />)

    fireEvent.change(screen.getByLabelText('Título *'), { target: { value: '   ' } })
    fireEvent.change(screen.getByLabelText('Tipo *'), { target: { value: 'outro' } })
    fireEvent.change(screen.getByLabelText('Ano *'), { target: { value: '1887' } })
    fireEvent.change(screen.getByLabelText('Gêneros *'), { target: { value: 'drama, , suspense' } })
    fireEvent.change(screen.getByLabelText('Avaliação (opcional)'), { target: { value: '11' } })
    fireEvent.change(screen.getByLabelText('Imagem (opcional)'), { target: { value: 'ftp://example.com/image.jpg' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar título' }))

    expect(screen.getByText('Informe o título.')).toBeTruthy()
    expect(screen.getByText('Selecione um tipo válido.')).toBeTruthy()
    expect(screen.getByText(/ano inteiro entre 1888/)).toBeTruthy()
    expect(screen.getByText('Informe ao menos um gênero, sem itens vazios.')).toBeTruthy()
    expect(screen.getByText('Informe uma avaliação entre 0 e 10.')).toBeTruthy()
    expect(screen.getByText('Informe uma URL HTTP ou HTTPS válida.')).toBeTruthy()
    expect(createTitulo).not.toHaveBeenCalled()
  })

  it('envia um título válido com UUID e só confirma após a API aceitar', async () => {
    let acceptRequest
    createTitulo.mockReturnValue(new Promise((resolve) => { acceptRequest = resolve }))
    const onCreated = vi.fn()
    render(<TitleFormPage onCancel={vi.fn()} onCreated={onCreated} />)

    fillRequiredFields()
    fireEvent.change(screen.getByLabelText('Avaliação (opcional)'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar título' }))

    expect(createTitulo).toHaveBeenCalledWith(expect.objectContaining({
      id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
      ...validValues,
      ano: Number(validValues.ano),
      generos: ['Drama', 'aventura'],
      palavrasChave: [],
      avaliacao: 2,
    }))
    expect(createTitulo.mock.calls[0][0]).not.toHaveProperty('fonte')
    expect(onCreated).not.toHaveBeenCalled()

    await act(async () => acceptRequest({}))
    await screen.findByRole('button', { name: 'Cancelar' })
    expect(onCreated).toHaveBeenCalledWith(expect.objectContaining({ titulo: validValues.titulo }))
  })

  it('mostra falha da API sem limpar os valores preenchidos', async () => {
    createTitulo.mockImplementation(() => { throw new Error('offline') })
    render(<TitleFormPage onCancel={vi.fn()} onCreated={vi.fn()} />)

    fillRequiredFields()
    fireEvent.click(screen.getByRole('button', { name: 'Cadastrar título' }))

    expect((await screen.findByRole('alert')).textContent).toContain('Não foi possível cadastrar o título.')
    expect(screen.getByLabelText('Título *').value).toBe(validValues.titulo)
    expect(screen.getByLabelText('Descrição *').value).toBe(validValues.descricao)
  })

})
