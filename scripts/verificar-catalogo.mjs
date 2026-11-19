import { readFile } from 'node:fs/promises'

const arquivo = process.argv[2] || 'db.json'
const catalogo = JSON.parse(await readFile(arquivo, 'utf8'))
if (!Array.isArray(catalogo.titulos)) throw new Error('O catálogo deve conter uma lista "titulos".')

const tipos = ['filme', 'serie', 'documentario', 'animacao', 'novela']
const contagens = Object.fromEntries(tipos.map((tipo) => [tipo, 0]))
const ids = new Set()
const identidades = new Set()
const erros = []
const textoValido = (valor) => typeof valor === 'string' && valor.trim().length > 0
const listaValida = (valor) => Array.isArray(valor) && valor.every(textoValido)
const urlValida = (valor) => {
  if (!textoValido(valor)) return false
  try {
    return ['http:', 'https:'].includes(new URL(valor).protocol)
  } catch {
    return false
  }
}

for (const [indice, titulo] of catalogo.titulos.entries()) {
  if (!titulo || typeof titulo !== 'object' || Array.isArray(titulo)) {
    erros.push(`Registro ${indice + 1}: objeto inválido.`)
    continue
  }
  const problemas = []
  if (!textoValido(titulo.id)) problemas.push('id ausente')
  else if (ids.has(titulo.id)) problemas.push('id duplicado')
  else ids.add(titulo.id)
  if (!textoValido(titulo.titulo)) problemas.push('título inválido')
  if (!tipos.includes(titulo.tipo)) problemas.push('tipo inválido')
  else contagens[titulo.tipo]++
  if (!Number.isInteger(titulo.ano) || titulo.ano < 1888 || titulo.ano > new Date().getFullYear() + 1) problemas.push('ano inválido')
  if (!listaValida(titulo.generos) || titulo.generos.length === 0) problemas.push('gêneros inválidos')
  if (!textoValido(titulo.descricao)) problemas.push('descrição inválida')
  if (!listaValida(titulo.palavrasChave)) problemas.push('palavras-chave inválidas')
  if (titulo.avaliacao !== undefined && (typeof titulo.avaliacao !== 'number' || !Number.isFinite(titulo.avaliacao) || titulo.avaliacao < 0 || titulo.avaliacao > 10)) problemas.push('avaliação inválida')
  if (titulo.imagem !== undefined && !urlValida(titulo.imagem)) problemas.push('imagem inválida')
  if (titulo.fonte !== undefined && (!textoValido(titulo.fonte?.nome) || !urlValida(titulo.fonte?.url))) problemas.push('fonte inválida')
  if (typeof titulo.id === 'string' && titulo.id.startsWith('wikidata-') &&
      (titulo.fonte?.nome !== 'Wikidata' || titulo.fonte.url !== `https://www.wikidata.org/wiki/${titulo.id.slice(9)}`)) problemas.push('fonte Wikidata incompatível')
  if (textoValido(titulo.titulo) && Number.isInteger(titulo.ano)) {
    const identidade = `${titulo.titulo.trim().normalize('NFKC').toLowerCase()}|${titulo.ano}`
    if (identidades.has(identidade)) problemas.push('título e ano duplicados')
    else identidades.add(identidade)
  }
  if (problemas.length) erros.push(`Registro ${indice + 1}: ${problemas.join(', ')}.`)
}

for (const tipo of tipos) {
  console.log(`${tipo}: ${contagens[tipo]}`)
  if (contagens[tipo] < 200) erros.push(`${tipo}: necessários pelo menos 200 registros.`)
}
if (erros.length) {
  console.error(erros.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Catálogo válido: ${catalogo.titulos.length} registros e IDs únicos.`)
}
