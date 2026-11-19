import { useEffect, useRef, useState } from 'react'
import { getTitulos } from '../api/titulos.js'
import TitleCard from '../components/TitleCard.jsx'
import { recommendTitles } from '../recommendations/localRecommendation.js'

function RecommendationLoading() {
  return (
    <div className="recommendation-loading" role="status" aria-live="polite">
      <span className="recommendation-loading__mark" aria-hidden="true" />
      Carregando o catálogo para comparar sua preferência.
    </div>
  )
}

export default function RecommendationPage({ session, setSession, onSelectTitle }) {
  const [titulos, setTitulos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    getTitulos({ signal: controller.signal })
      .then(setTitulos)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError('Não foi possível consultar o catálogo. Verifique a API local e tente novamente.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [retry])

  function submitRequest(event) {
    event.preventDefault()
    const result = recommendTitles(session.draft, titulos)
    setSession((current) => ({
      ...current,
      submittedQuery: current.draft.trim(),
      result,
    }))
  }

  function startNewRequest() {
    setSession({ draft: '', submittedQuery: '', result: null })
    inputRef.current?.focus()
  }

  function retryCatalog() {
    setLoading(true)
    setError('')
    setRetry((value) => value + 1)
  }

  const inputIsEmpty = session.result?.status === 'empty-request'
  const hasRecommendations = session.result?.recommendations.length > 0
  const statusAnnouncement = loading
    ? 'Preparando a recomendação.'
    : error
      ? 'A consulta está indisponível.'
      : session.result
        ? `Busca concluída com ${session.result.recommendations.length} sugestões.`
        : 'Catálogo pronto para uma preferência.'

  return (
    <section className="recommendation-page" aria-labelledby="recommendation-title">
      <div className="recommendation-page__wrap wrap">
        <header className="recommendation-intro">
          <div>
            <p className="eyebrow">Recomendação local / conversa</p>
            <h1 id="recommendation-title">Recomendação local para escolher o que assistir</h1>
            <p className="recommendation-intro__lead">
              Descreva um tipo, gênero, ano ou década. A busca compara sua preferência com o catálogo e explica cada resultado.
            </p>
          </div>
          <div className="recommendation-fact" aria-label="Funcionamento da recomendação">
            <strong>{loading ? '—' : titulos.length.toLocaleString('pt-BR')}</strong>
            <span>{titulos.length === 1 ? 'título comparado por regras locais' : 'títulos comparados por regras locais'}</span>
          </div>
        </header>

        <div className="recommendation-conversation">
          <div className="conversation-message conversation-message--assistant">
            <span className="conversation-speaker">Indica Aí</span>
            <p>Conte o que combina com o momento. Por exemplo: filme de ficção científica dos anos 90.</p>
          </div>

          <form className="recommendation-form app-frame" data-ui="recommendation-request" onSubmit={submitRequest} noValidate>
            <label htmlFor="recommendation-request">Sua preferência</label>
            <textarea
              ref={inputRef}
              id="recommendation-request"
              value={session.draft}
              onChange={(event) => setSession((current) => ({
                ...current,
                draft: event.target.value,
                submittedQuery: '',
                result: null,
              }))}
              aria-describedby={`recommendation-help${inputIsEmpty ? ' recommendation-request-error' : ''}`}
              aria-invalid={inputIsEmpty || undefined}
              rows="3"
            />
            <p className="recommendation-help" id="recommendation-help">
              A interpretação é local e reconhece somente critérios presentes nas regras do projeto.
            </p>
            {inputIsEmpty && (
              <p className="recommendation-input-error" id="recommendation-request-error">
                Escreva ao menos um tipo, gênero, ano ou década.
              </p>
            )}
            <button className="recommendation-submit" type="submit" disabled={loading || Boolean(error)}>
              Buscar sugestões
            </button>
            <p className="visually-hidden" role="status" aria-live="polite">
              {statusAnnouncement}
            </p>
          </form>

          {loading && <RecommendationLoading />}

          {error && (
            <div className="conversation-message conversation-message--error" role="alert">
              <span className="conversation-speaker">Falha de conexão</span>
              <p>{error}</p>
              <button className="conversation-action" type="button" onClick={retryCatalog}>Tentar novamente</button>
            </div>
          )}

          {!loading && !error && session.result && (
            <div className="conversation-response">
              {session.submittedQuery && (
                <div className="conversation-message conversation-message--user">
                  <span className="conversation-speaker">Sua busca</span>
                  <p>{session.submittedQuery}</p>
                </div>
              )}
              <div className="conversation-message conversation-message--assistant">
                <span className="conversation-speaker">Indica Aí</span>
                <p>{session.result.message}</p>
                <p className="conversation-next-step">{session.result.nextStep}</p>
              </div>
              <button className="conversation-action" type="button" onClick={startNewRequest}>
                Fazer nova busca
              </button>
            </div>
          )}
        </div>

        {!loading && !error && hasRecommendations && (
          <section className="recommendation-results" aria-labelledby="recommendation-results-title">
            <div className="results-heading">
              <h2 id="recommendation-results-title">
                {session.result.status === 'alternatives' ? 'Alternativas relacionadas' : 'Recomendações encontradas'}
              </h2>
              <p>{session.result.recommendations.length} sugestões</p>
            </div>
            <ol className="recommendation-grid">
              {session.result.recommendations.map((recommendation) => (
                <li className="recommendation-item" key={recommendation.titulo.id}>
                  <TitleCard titulo={recommendation.titulo} onSelect={onSelectTitle} />
                  <div className="recommendation-item__reason">
                    <span>{recommendation.kind === 'alternative' ? 'Alternativa' : 'Correspondência'}</span>
                    <p>{recommendation.explanation}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </section>
  )
}
