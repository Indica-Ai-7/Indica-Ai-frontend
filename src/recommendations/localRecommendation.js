const TYPE_WEIGHT = 30
const GENRE_WEIGHT = 40
const YEAR_WEIGHT = 25
const DECADE_WEIGHT = 20
const DEFAULT_LIMIT = 6

const TYPE_DEFINITIONS = [
  { value: 'filme', label: 'tipo filme', aliases: ['filme', 'filmes', 'longa', 'longas'] },
  { value: 'serie', label: 'tipo série', aliases: ['serie', 'series', 'seriado', 'seriados'] },
  { value: 'documentario', label: 'tipo documentário', aliases: ['documentario', 'documentarios', 'doc', 'docs'] },
  { value: 'animacao', label: 'tipo animação', aliases: ['animacao', 'animacoes', 'desenho', 'desenhos'] },
  { value: 'novela', label: 'tipo novela', aliases: ['novela', 'novelas', 'telenovela', 'telenovelas'] },
]

const GENRE_DEFINITIONS = [
  { value: 'acao', label: 'gênero ação', aliases: ['acao'], metadataTerms: ['acao'] },
  { value: 'aventura', label: 'gênero aventura', aliases: ['aventura', 'aventuras'], metadataTerms: ['aventura'] },
  { value: 'biografia', label: 'gênero biografia', aliases: ['biografia', 'biografico', 'biografica'], metadataTerms: ['biografia', 'biografico', 'biografica'] },
  { value: 'comedia', label: 'gênero comédia', aliases: ['comedia', 'comedias', 'engracado', 'engracada'], metadataTerms: ['comedia', 'sitcom'] },
  { value: 'crime', label: 'gênero crime', aliases: ['crime', 'crimes', 'criminal', 'policial'], metadataTerms: ['crime', 'criminal', 'policial', 'gangster'] },
  { value: 'drama', label: 'gênero drama', aliases: ['drama', 'dramatico', 'dramatica'], metadataTerms: ['drama', 'dramatico', 'dramatica'] },
  { value: 'familia', label: 'gênero familiar', aliases: ['familia', 'familiar'], metadataTerms: ['familia', 'familiar'] },
  { value: 'fantasia', label: 'gênero fantasia', aliases: ['fantasia', 'fantastico', 'fantastica'], metadataTerms: ['fantasia', 'fantastico', 'fantastica'] },
  { value: 'ficcao-cientifica', label: 'gênero ficção científica', aliases: ['ficcao cientifica', 'sci fi', 'scifi'], metadataTerms: ['ficcao cientifica', 'science fiction', 'sci fi'] },
  { value: 'guerra', label: 'gênero guerra', aliases: ['guerra', 'guerras'], metadataTerms: ['guerra'] },
  { value: 'infantil', label: 'gênero infantil', aliases: ['infantil', 'crianca', 'criancas'], metadataTerms: ['infantil', 'crianca'] },
  { value: 'misterio', label: 'gênero mistério', aliases: ['misterio', 'misterios'], metadataTerms: ['misterio'] },
  { value: 'musical', label: 'gênero musical', aliases: ['musical', 'musicais'], metadataTerms: ['musical'] },
  { value: 'romance', label: 'gênero romance', aliases: ['romance', 'romantico', 'romantica'], metadataTerms: ['romance', 'romantico', 'romantica', 'romantic'] },
  { value: 'suspense', label: 'gênero suspense', aliases: ['suspense', 'thriller'], metadataTerms: ['suspense', 'thriller'] },
  { value: 'terror', label: 'gênero terror', aliases: ['terror', 'horror'], metadataTerms: ['terror', 'horror'] },
]

export function normalizeText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function containsTerm(text, term) {
  return ` ${text} `.includes(` ${term} `)
}

function hasAnyTerm(text, terms) {
  return terms.some((term) => containsTerm(text, term))
}

function getDecadeStart(value) {
  const parsed = Number(value)
  if (value.length === 4) return parsed

  const currentShortYear = new Date().getFullYear() % 100
  return parsed <= currentShortYear + 1 ? 2000 + parsed : 1900 + parsed
}

function extractCriteria(request) {
  const normalizedRequest = normalizeText(request)
  const criteria = []

  TYPE_DEFINITIONS.forEach((definition) => {
    if (hasAnyTerm(normalizedRequest, definition.aliases)) {
      criteria.push({
        id: `type:${definition.value}`,
        kind: 'type',
        value: definition.value,
        label: definition.label,
        weight: TYPE_WEIGHT,
      })
    }
  })

  GENRE_DEFINITIONS.forEach((definition) => {
    if (hasAnyTerm(normalizedRequest, definition.aliases)) {
      criteria.push({
        id: `genre:${definition.value}`,
        kind: 'genre',
        value: definition.value,
        label: definition.label,
        weight: GENRE_WEIGHT,
        metadataTerms: definition.metadataTerms,
      })
    }
  })

  const decadeStarts = new Set()
  const decadePattern = /\b(?:anos?|decada de)\s+(\d{2}|\d{4})\b/g
  for (const match of normalizedRequest.matchAll(decadePattern)) {
    const start = getDecadeStart(match[1])
    if (start < 1880 || start > new Date().getFullYear()) continue
    decadeStarts.add(start)
    criteria.push({
      id: `decade:${start}`,
      kind: 'decade',
      value: start,
      label: `década de ${start}`,
      weight: DECADE_WEIGHT,
    })
  }

  const maximumYear = new Date().getFullYear() + 1
  const years = normalizedRequest.match(/\b(?:18|19|20)\d{2}\b/g) || []
  new Set(years.map(Number)).forEach((year) => {
    if (year < 1888 || year > maximumYear || decadeStarts.has(year)) return
    criteria.push({
      id: `year:${year}`,
      kind: 'year',
      value: year,
      label: `ano ${year}`,
      weight: YEAR_WEIGHT,
    })
  })

  return criteria
}

function matchesCriterion(titulo, criterion) {
  if (criterion.kind === 'type') return normalizeText(titulo.tipo) === criterion.value
  if (criterion.kind === 'year') return Number(titulo.ano) === criterion.value
  if (criterion.kind === 'decade') {
    const year = Number(titulo.ano)
    return Number.isInteger(year) && year >= criterion.value && year <= criterion.value + 9
  }
  if (criterion.kind === 'genre') {
    return (titulo.generos || []).some((genre) => (
      hasAnyTerm(normalizeText(genre), criterion.metadataTerms)
    ))
  }
  return false
}

function compareText(left, right) {
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

function rankTitles(titulos, criteria) {
  return titulos
    .map((titulo) => {
      const matchedCriteria = criteria.filter((criterion) => matchesCriterion(titulo, criterion))
      return {
        titulo,
        matchedCriteria,
        score: matchedCriteria.reduce((total, criterion) => total + criterion.weight, 0),
      }
    })
    .filter((result) => result.matchedCriteria.length > 0)
    .sort((left, right) => (
      right.score - left.score
      || right.matchedCriteria.length - left.matchedCriteria.length
      || compareText(normalizeText(left.titulo.titulo), normalizeText(right.titulo.titulo))
      || compareText(String(left.titulo.id), String(right.titulo.id))
    ))
}

function formatCriteria(criteria) {
  const labels = criteria.map((criterion) => criterion.label)
  if (labels.length === 1) return labels[0]
  if (labels.length === 2) return `${labels[0]} e ${labels[1]}`
  return `${labels.slice(0, -1).join(', ')} e ${labels.at(-1)}`
}

function publicCriterion(criterion) {
  return {
    id: criterion.id,
    kind: criterion.kind,
    value: criterion.value,
    label: criterion.label,
    weight: criterion.weight,
  }
}

function presentResult(result, kind) {
  const matchedCriteria = result.matchedCriteria.map(publicCriterion)
  const relation = kind === 'match' ? 'Corresponde aos critérios' : 'Alternativa relacionada por'
  return {
    titulo: result.titulo,
    kind,
    score: result.score,
    matchedCriteria,
    explanation: `${relation}: ${formatCriteria(result.matchedCriteria)}.`,
  }
}

function emptyResult() {
  return {
    status: 'empty-request',
    criteria: [],
    recommendations: [],
    message: 'Descreva o que você gostaria de assistir.',
    nextStep: 'Informe ao menos um tipo, gênero, ano ou década para começar.',
  }
}

function noResults(criteria) {
  const hasRecognizedCriteria = criteria.length > 0
  return {
    status: 'no-results',
    criteria: criteria.map(publicCriterion),
    recommendations: [],
    message: hasRecognizedCriteria
      ? 'Não encontramos títulos relacionados a todos esses critérios no catálogo local.'
      : 'Não reconhecemos critérios que possam ser comparados com o catálogo local.',
    nextStep: hasRecognizedCriteria
      ? 'Tente outro tipo, gênero, ano ou década.'
      : 'Experimente termos como filme, série, comédia, ficção científica ou anos 90.',
  }
}

export function recommendTitles(request, titulos, { limit = DEFAULT_LIMIT } = {}) {
  if (!normalizeText(request)) return emptyResult()

  const criteria = extractCriteria(request)
  const catalog = Array.isArray(titulos) ? titulos : []
  if (criteria.length === 0 || catalog.length === 0) return noResults(criteria)

  const ranked = rankTitles(catalog, criteria)
  if (ranked.length === 0) return noResults(criteria)

  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_LIMIT
  const exactMatches = ranked.filter((result) => result.matchedCriteria.length === criteria.length)
  if (exactMatches.length > 0) {
    return {
      status: 'match',
      criteria: criteria.map(publicCriterion),
      recommendations: exactMatches.slice(0, safeLimit).map((result) => presentResult(result, 'match')),
      message: `Encontramos ${exactMatches.length} título(s) que correspondem à sua preferência.`,
      nextStep: 'Consulte os detalhes ou faça uma nova busca.',
    }
  }

  return {
    status: 'alternatives',
    criteria: criteria.map(publicCriterion),
    recommendations: ranked.slice(0, safeLimit).map((result) => presentResult(result, 'alternative')),
    message: 'Não encontramos uma correspondência exata, mas há alternativas relacionadas.',
    nextStep: 'Consulte uma alternativa ou remova um critério para ampliar a busca.',
  }
}
