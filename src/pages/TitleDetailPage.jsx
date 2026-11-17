import { useEffect, useState } from 'react'
import { getTitulo } from '../api/titulos.js'
import Poster from '../components/Poster.jsx'

const tipoLabels = {
  filme: 'Filme',
  serie: 'Série',
  documentario: 'Documentário',
  animacao: 'Animação',
  novela: 'Novela',
}

function DetailLoading() {
  return (
    <div className="detail-skeleton" aria-label="Carregando detalhes" aria-busy="true">
      <div className="skeleton-card__poster" />
      <div>
        <div className="skeleton-card__line" />
        <div className="skeleton-card__line" />
        <div className="skeleton-card__line" />
      </div>
    </div>
  )
}

export default function TitleDetailPage({ id, onBack }) {
  const [titulo, setTitulo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    getTitulo(id, { signal: controller.signal })
      .then(setTitulo)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(true)
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [id])

  return (
    <section className="detail-page" aria-labelledby="detail-title">
      <div className="detail-page__wrap wrap">
      <button className="detail-back" type="button" onClick={onBack}>Voltar ao catálogo</button>
      {loading ? (
        <DetailLoading />
      ) : error || !titulo ? (
        <div className="state-panel state-panel--error" role="alert">
          <p className="section-kicker">Título indisponível</p>
          <h1 id="detail-title">Não foi possível abrir este título.</h1>
          <p>A API não retornou os detalhes solicitados. Volte ao catálogo para escolher outro registro.</p>
          <button className="back-button" type="button" onClick={onBack}>Voltar ao catálogo</button>
        </div>
      ) : (
        <div className="detail-layout">
          <Poster titulo={titulo} className="detail-poster" />
          <div className="detail-copy">
            <p className="eyebrow">{tipoLabels[titulo.tipo] || 'Título'} / detalhes</p>
            <h1 id="detail-title">{titulo.titulo}</h1>
            <div className="detail-meta">
              {Number.isInteger(titulo.ano) && <span>{titulo.ano}</span>}
              {titulo.generos?.length > 0 && <span>{titulo.generos.slice(0, 3).join(', ')}</span>}
            </div>
            {titulo.descricao && <p className="detail-description">{titulo.descricao}</p>}

            {Number.isFinite(titulo.avaliacao) && (
              <div className="rating-block">
                <strong>{titulo.avaliacao.toFixed(1)}</strong>
                <span>Avaliação informada no catálogo</span>
              </div>
            )}

            {titulo.generos?.length > 0 && (
              <section className="detail-section" aria-labelledby="genres-title">
                <h2 id="genres-title">Gêneros</h2>
                <ul className="genre-list">
                  {titulo.generos.map((genero) => <li key={genero}>{genero}</li>)}
                </ul>
              </section>
            )}

            {titulo.palavrasChave?.length > 0 && (
              <section className="detail-section" aria-labelledby="keywords-title">
                <h2 id="keywords-title">Palavras-chave</h2>
                <ul className="keyword-list">
                  {titulo.palavrasChave.map((palavra) => <li key={palavra}>{palavra}</li>)}
                </ul>
              </section>
            )}

            {titulo.fonte?.url && (
              <a className="source-link" href={titulo.fonte.url} target="_blank" rel="noreferrer">
                Fonte: {titulo.fonte.nome || 'registro original'}
              </a>
            )}
          </div>
        </div>
      )}
      </div>
    </section>
  )
}