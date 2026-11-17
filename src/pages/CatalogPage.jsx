import { useEffect, useMemo, useState } from 'react'
import { getTitulos } from '../api/titulos.js'
import TitleCard from '../components/TitleCard.jsx'

const categorias = [
  { value: 'todos', label: 'Todos' },
  { value: 'filme', label: 'Filmes' },
  { value: 'serie', label: 'Séries' },
  { value: 'documentario', label: 'Documentários' },
  { value: 'animacao', label: 'Animações' },
  { value: 'novela', label: 'Novelas' },
]
const PAGE_SIZE = 24

function normalize(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
}

function LoadingGrid() {
  return (
    <div className="title-grid" aria-label="Carregando títulos" aria-busy="true">
      {Array.from({ length: 10 }, (_, index) => (
        <div className="skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton-card__poster" />
          <div className="skeleton-card__body">
            <div className="skeleton-card__line" />
            <div className="skeleton-card__line" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CatalogPage({ onSelectTitle }) {
  const [titulos, setTitulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [tipo, setTipo] = useState('todos')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    getTitulos({ signal: controller.signal })
      .then(setTitulos)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError('Não foi possível carregar o catálogo. Verifique se a API local está em execução e tente novamente.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [retry])

  function retryCatalog() {
    setError('')
    setLoading(true)
    setRetry((value) => value + 1)
  }

  const filteredTitles = useMemo(() => {
    const query = normalize(search.trim())

    return titulos.filter((titulo) => {
      if (tipo !== 'todos' && titulo.tipo !== tipo) return false
      if (!query) return true

      const searchableText = normalize([
        titulo.titulo,
        titulo.descricao,
        ...(titulo.generos || []),
        ...(titulo.palavrasChave || []),
      ].join(' '))
      return searchableText.includes(query)
    })
  }, [search, tipo, titulos])

  const countByType = useMemo(() => titulos.reduce((counts, titulo) => {
    counts[titulo.tipo] = (counts[titulo.tipo] || 0) + 1
    return counts
  }, {}), [titulos])

  return (
    <section className="catalog-page" aria-labelledby="catalog-title">
      <div className="catalog-page__wrap wrap">
      <div className="catalog-intro">
        <div>
          <p className="eyebrow">Catálogo local / descoberta</p>
          <h1 id="catalog-title">Catálogo de títulos para assistir</h1>
          <p className="catalog-intro__lead">
            {loading
              ? 'Filmes, séries e outras histórias para encontrar sua próxima sessão.'
              : `${titulos.length.toLocaleString('pt-BR')} títulos em cinco categorias. Pesquise ou escolha um tipo para começar.`}
          </p>
        </div>
        <div className="catalog-count" aria-label="Categorias do catálogo">
          <strong>05</strong>
          <span>tipos de conteúdo</span>
        </div>
      </div>

      <div className="catalog-tools">
        <label className="search-wrap">
          <span className="visually-hidden">Buscar no catálogo</span>
          <input
            className="search-input"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            placeholder="Título, gênero ou palavra-chave"
          />
        </label>
        <div className="type-filters" aria-label="Filtrar por tipo de conteúdo">
          {categorias.map((categoria) => {
            const count = categoria.value === 'todos'
              ? titulos.length
              : countByType[categoria.value] || 0
            return (
              <button
                className="filter-button"
                type="button"
                key={categoria.value}
                aria-pressed={tipo === categoria.value}
                onClick={() => {
                  setTipo(categoria.value)
                  setVisibleCount(PAGE_SIZE)
                }}
              >
                {categoria.label}{!loading && ` (${count})`}
              </button>
            )
          })}
        </div>
      </div>

      {error ? (
        <section className="state-panel state-panel--error" role="alert">
          <p className="section-kicker">Falha de conexão</p>
          <h2>O catálogo não carregou.</h2>
          <p>{error}</p>
          <button className="back-button" type="button" onClick={retryCatalog}>
            Tentar novamente
          </button>
        </section>
      ) : loading ? (
        <div className="loading-area" role="status" aria-live="polite">
          <p className="results-heading">Carregando títulos do catálogo</p>
          <LoadingGrid />
        </div>
      ) : titulos.length === 0 ? (
        <section className="state-panel state-panel--empty" role="status">
          <p className="section-kicker">Catálogo vazio</p>
          <h2>Nenhum título cadastrado.</h2>
          <p>A API respondeu, mas não há títulos disponíveis para exibir.</p>
        </section>
      ) : filteredTitles.length === 0 ? (
        <section className="state-panel state-panel--empty" role="status">
          <p className="section-kicker">Nenhum resultado</p>
          <h2>Não encontramos títulos com esses filtros.</h2>
          <p>Altere o termo de busca ou selecione outra categoria.</p>
          <button className="back-button" type="button" onClick={() => { setSearch(''); setTipo('todos') }}>
            Limpar filtros
          </button>
        </section>
      ) : (
        <>
          <div className="results-heading" aria-live="polite">
            <h2>{tipo === 'todos' ? 'Todos os títulos' : categorias.find((item) => item.value === tipo)?.label}</h2>
            <p>{filteredTitles.length.toLocaleString('pt-BR')} resultados</p>
          </div>
          <div className="title-grid">
            {filteredTitles.slice(0, visibleCount).map((titulo) => (
              <TitleCard key={titulo.id} titulo={titulo} onSelect={onSelectTitle} />
            ))}
          </div>
          {visibleCount < filteredTitles.length && (
            <div className="more-row">
              <button className="more-button" type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                Carregar mais títulos
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </section>
  )
}