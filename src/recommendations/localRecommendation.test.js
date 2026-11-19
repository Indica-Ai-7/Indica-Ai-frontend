import database from '../../db.json'
import { normalizeText, recommendTitles } from './localRecommendation.js'

const syntheticCatalog = [
  {
    id: 'space-b',
    titulo: 'Beta Espacial',
    tipo: 'filme',
    ano: 2005,
    generos: ['filme de ficção científica', 'aventura'],
  },
  {
    id: 'space-a',
    titulo: 'Alpha Espacial',
    tipo: 'filme',
    ano: 2005,
    generos: ['filme de ficção científica'],
  },
  {
    id: 'romance-series',
    titulo: 'Amores em Série',
    tipo: 'serie',
    ano: 2005,
    generos: ['romance television series'],
  },
  {
    id: 'drama-film',
    titulo: 'Drama Local',
    tipo: 'filme',
    ano: 1998,
    generos: ['drama'],
  },
]

describe('normalizeText', () => {
  it('normaliza acentos, caixa, pontuação e espaços', () => {
    expect(normalizeText('  FICÇÃO---Científica!  ')).toBe('ficcao cientifica')
  })
})

describe('recommendTitles', () => {
  it('produz a mesma ordenação para critérios equivalentes', () => {
    const accented = recommendTitles('Quero um FILME de ficção-científica de 2005', syntheticCatalog)
    const plain = recommendTitles('filme FICCAO CIENTIFICA 2005', syntheticCatalog)

    expect(accented.status).toBe('match')
    expect(plain.status).toBe('match')
    expect(accented.recommendations.map(({ titulo }) => titulo.id)).toEqual(['space-a', 'space-b'])
    expect(plain.recommendations.map(({ titulo }) => titulo.id)).toEqual(['space-a', 'space-b'])
  })

  it('mantém a ordem para chamadas repetidas e desempata por título', () => {
    const first = recommendTitles('filme de 2005', syntheticCatalog)
    const second = recommendTitles('filme de 2005', syntheticCatalog)

    expect(first.recommendations.map(({ titulo }) => titulo.id)).toEqual(['space-a', 'space-b'])
    expect(second.recommendations.map(({ titulo }) => titulo.id)).toEqual(['space-a', 'space-b'])
  })

  it('explica somente critérios realmente atendidos', () => {
    const result = recommendTitles('filme de ficção científica de 2005', syntheticCatalog)
    const [recommendation] = result.recommendations

    expect(recommendation.matchedCriteria.map(({ id }) => id)).toEqual([
      'type:filme',
      'genre:ficcao-cientifica',
      'year:2005',
    ])
    expect(recommendation.explanation).toContain('tipo filme')
    expect(recommendation.explanation).toContain('gênero ficção científica')
    expect(recommendation.explanation).toContain('ano 2005')
  })

  it.each([
    ['filme de ficção científica', ['51', 'A Origem', 'Alien Raiders']],
    ['animação de fantasia dos anos 2000', ['9', 'A Christmas Carol', 'A Fuga das Galinhas']],
    ['documentário de 2005', ['12 Tangos', 'A Marcha dos Pinguins', 'Crossing the Bridge: The Sound of Istanbul']],
  ])('valida a busca de referência "%s"', (request, expectedTitles) => {
    const result = recommendTitles(request, database.titulos)

    expect(result.status).toBe('match')
    expect(result.recommendations.slice(0, 3).map(({ titulo }) => titulo.titulo)).toEqual(expectedTitles)
  })

  it('orienta uma nova tentativa para entrada vazia', () => {
    const result = recommendTitles('   ', syntheticCatalog)

    expect(result).toMatchObject({
      status: 'empty-request',
      criteria: [],
      recommendations: [],
    })
    expect(result.message).toMatch(/descreva/i)
    expect(result.nextStep).toMatch(/informe/i)
  })

  it('retorna correspondências que atendem a todos os critérios', () => {
    const result = recommendTitles('filme de ficção científica', syntheticCatalog)

    expect(result.status).toBe('match')
    expect(result.recommendations).toHaveLength(2)
    expect(result.recommendations.every(({ kind }) => kind === 'match')).toBe(true)
  })

  it('distingue alternativas quando nenhum título atende a todos os critérios', () => {
    const result = recommendTitles('filme de romance', syntheticCatalog)

    expect(result.status).toBe('alternatives')
    expect(result.recommendations.map(({ titulo }) => titulo.id)).toEqual([
      'romance-series',
      'space-a',
      'space-b',
      'drama-film',
    ])
    expect(result.recommendations.every(({ kind }) => kind === 'alternative')).toBe(true)
    expect(result.message).toMatch(/não encontramos uma correspondência exata/i)
  })

  it.each([
    ['um clima completamente desconhecido', syntheticCatalog],
    ['filme', []],
  ])('oferece próximo passo quando não há resultados para "%s"', (request, catalog) => {
    const result = recommendTitles(request, catalog)

    expect(result.status).toBe('no-results')
    expect(result.recommendations).toEqual([])
    expect(result.message).toMatch(/não/i)
    expect(result.nextStep).toBeTruthy()
  })
})
