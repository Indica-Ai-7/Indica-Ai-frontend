import { writeFile } from 'node:fs/promises'

const headers = {
  'User-Agent': 'IndicaAi-educational-catalog/1.0 (https://github.com/Indica-Ai-7/Indica-Ai-frontend)',
}
const quantidade = 200
const lote = 50

async function consultar(url) {
  const resposta = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(30000),
  })

  if (!resposta.ok) {
    throw new Error(`Wikidata respondeu HTTP ${resposta.status}: ${url.origin}`)
  }

  const dados = await resposta.json()
  if (dados.error) {
    throw new Error(`Erro da API Wikidata: ${dados.error.info}`)
  }
  return dados
}

async function buscarEntidades(ids, propriedades) {
  const entidades = {}
  for (let indice = 0; indice < ids.length; indice += lote) {
    const url = new URL('https://www.wikidata.org/w/api.php')
    url.search = new URLSearchParams({
      action: 'wbgetentities',
      ids: ids.slice(indice, indice + lote).join('|'),
      props: propriedades,
      languages: 'pt|en',
      format: 'json',
    })
    Object.assign(entidades, (await consultar(url)).entities)
  }
  return entidades
}

function textoEmPortuguesOuIngles(valores) {
  return valores?.pt?.value?.trim() || valores?.en?.value?.trim()
}

function descricaoAudiovisual(descricoes) {
  const termos = /filme|film|movie|série|serie|novela|televis|document|animaç|animat|anime|cartoon|sitcom|soap opera|tv show/i
  return [descricoes?.pt?.value, descricoes?.en?.value]
    .map((descricao) => descricao?.trim())
    .find((descricao) => descricao && termos.test(descricao))
}

function valores(entidade, propriedade) {
  return (entidade.claims?.[propriedade] || [])
    .filter((afirmacao) => afirmacao.rank !== 'deprecated')
    .map((afirmacao) => afirmacao.mainsnak?.datavalue?.value)
    .filter(Boolean)
}

function anoLancamento(entidade) {
  const datas = valores(entidade, 'P577')
  if (!datas.length) datas.push(...valores(entidade, 'P580'))
  const anos = datas
    .filter((data) => data.precision >= 9)
    .map((data) => Number(data.time?.match(/^\+(\d{4,})-/)?.[1]))
    .filter((ano) => Number.isInteger(ano) && ano >= 1888 && ano <= new Date().getFullYear() + 1)
  return anos.length ? Math.min(...anos) : undefined
}

const categorias = [
  { tipo: 'novela', propriedade: 'P136', classe: 'Q23745' },
  { tipo: 'documentario', propriedade: 'P136', classe: 'Q93204' },
  { tipo: 'animacao', propriedade: 'P31', classe: 'Q202866' },
  { tipo: 'serie', propriedade: 'P31', classe: 'Q5398426' },
  { tipo: 'filme', propriedade: 'P31', classe: 'Q11424' },
]
const titulos = []
const identidades = new Set()
const idsUsados = new Set()
const generosConhecidos = new Map()

for (const categoria of categorias) {
  const consulta = new URL('https://query.wikidata.org/sparql')
  consulta.search = new URLSearchParams({
    query: `SELECT ?item WHERE { ?item wdt:${categoria.propriedade} wd:${categoria.classe}. } LIMIT 1500`,
    format: 'json',
  })
  const resultado = await consultar(consulta)
  const ids = [...new Set(resultado.results.bindings.map(({ item }) => item.value.split('/').pop()))]
  let encontrados = 0

  for (let indice = 0; indice < ids.length && encontrados < quantidade; indice += lote) {
    const entidades = await buscarEntidades(ids.slice(indice, indice + lote), 'labels|descriptions|claims')
    const candidatos = Object.values(entidades).filter((entidade) => {
      if (idsUsados.has(entidade.id)) return false
      const classes = valores(entidade, 'P31').map((valor) => valor.id)
      const generos = valores(entidade, 'P136').map((valor) => valor.id)
      if (categoria.tipo === 'documentario' && !classes.includes('Q11424')) return false
      if (categoria.tipo === 'serie' && generos.includes('Q23745')) return false
      if (categoria.tipo === 'filme' &&
          [...classes, ...generos].some((id) => ['Q93204', 'Q202866'].includes(id))) return false
      return true
    })
    const idsDeGenero = [...new Set(candidatos.flatMap((entidade) =>
      valores(entidade, 'P136').map((valor) => valor.id).filter(Boolean),
    ))].filter((id) => !generosConhecidos.has(id))

    if (idsDeGenero.length) {
      const generos = await buscarEntidades(idsDeGenero, 'labels')
      for (const id of idsDeGenero) {
        generosConhecidos.set(id, textoEmPortuguesOuIngles(generos[id]?.labels))
      }
    }

    for (const entidade of candidatos) {
      const titulo = textoEmPortuguesOuIngles(entidade.labels)
      const descricao = descricaoAudiovisual(entidade.descriptions)
      const ano = anoLancamento(entidade)
      const generos = [...new Set(valores(entidade, 'P136')
        .map((valor) => generosConhecidos.get(valor.id))
        .filter(Boolean))]
      if (!titulo || !descricao || !ano || !generos.length) continue

      const identidade = `${titulo.normalize('NFKC').toLowerCase()}|${ano}`
      if (identidades.has(identidade)) continue
      identidades.add(identidade)
      idsUsados.add(entidade.id)

      titulos.push({
        id: `wikidata-${entidade.id}`,
        titulo,
        tipo: categoria.tipo,
        ano,
        generos,
        descricao,
        palavrasChave: [],
        fonte: {
          nome: 'Wikidata',
          url: `https://www.wikidata.org/wiki/${entidade.id}`,
        },
      })
      encontrados++
      if (encontrados === quantidade) break
    }
  }

  if (encontrados !== quantidade) {
    throw new Error(`Encontrados ${encontrados} registros válidos de ${categoria.tipo}; necessários ${quantidade}. Nenhum catálogo foi gravado.`)
  }
  console.log(`${categoria.tipo}: ${encontrados} registros`)
}

await writeFile('db.json', `${JSON.stringify({ titulos }, null, 2)}\n`, { flag: 'wx' })
console.log(`Gravados ${titulos.length} títulos em db.json. Avaliações não foram importadas.`)
