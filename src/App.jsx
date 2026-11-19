import { useCallback, useEffect, useState } from 'react'
import './App.css'
import CatalogPage from './pages/CatalogPage.jsx'
import RecommendationPage from './pages/RecommendationPage.jsx'
import TitleFormPage from './pages/TitleFormPage.jsx'
import TitleDetailPage from './pages/TitleDetailPage.jsx'
import Toast from './components/Toast.jsx'

const emptyRecommendationSession = {
  draft: '',
  submittedQuery: '',
  result: null,
}

function App() {
  const [selectedId, setSelectedId] = useState(() => (
    new URLSearchParams(window.location.search).get('titulo')
  ))
  const [isCreating, setIsCreating] = useState(() => (
    new URLSearchParams(window.location.search).get('cadastro') === '1'
  ))
  const [isRecommending, setIsRecommending] = useState(() => (
    new URLSearchParams(window.location.search).get('recomendar') === '1'
  ))
  const [selectedOrigin, setSelectedOrigin] = useState(() => (
    new URLSearchParams(window.location.search).get('origem')
  ))
  const [recommendationSession, setRecommendationSession] = useState(emptyRecommendationSession)
  const [catalogVersion, setCatalogVersion] = useState(0)
  const [createdTitle, setCreatedTitle] = useState(null)
  const dismissCreatedTitle = useCallback(() => setCreatedTitle(null), [])

  useEffect(() => {
    const syncRoute = () => {
      const params = new URLSearchParams(window.location.search)
      setSelectedId(params.get('titulo'))
      setIsCreating(params.get('cadastro') === '1')
      setIsRecommending(params.get('recomendar') === '1')
      setSelectedOrigin(params.get('origem'))
      setCreatedTitle(null)
    }
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  function showCatalog(event) {
    event.preventDefault()
    window.history.pushState({}, '', window.location.pathname)
    setSelectedId(null)
    setIsCreating(false)
    setIsRecommending(false)
    setSelectedOrigin(null)
    setCreatedTitle(null)
    window.scrollTo(0, 0)
  }

  function showCreateForm(event) {
    event.preventDefault()
    window.history.pushState({}, '', `${window.location.pathname}?cadastro=1`)
    setSelectedId(null)
    setIsCreating(true)
    setIsRecommending(false)
    setSelectedOrigin(null)
    setCreatedTitle(null)
    window.scrollTo(0, 0)
  }

  function showRecommendations(event) {
    event?.preventDefault()
    window.history.pushState({}, '', `${window.location.pathname}?recomendar=1`)
    setSelectedId(null)
    setIsCreating(false)
    setIsRecommending(true)
    setSelectedOrigin(null)
    setCreatedTitle(null)
    window.scrollTo(0, 0)
  }

  function showDetails(title, origin = 'catalog') {
    const query = new URLSearchParams({ titulo: title.id })
    if (origin === 'recommendation') query.set('origem', 'recomendacao')
    window.history.pushState({}, '', `${window.location.pathname}?${query.toString()}`)
    setSelectedId(title.id)
    setIsCreating(false)
    setIsRecommending(false)
    setSelectedOrigin(origin === 'recommendation' ? 'recomendacao' : null)
    setCreatedTitle(null)
    window.scrollTo(0, 0)
  }

  function handleTitleCreated(title) {
    window.history.pushState({}, '', window.location.pathname)
    setSelectedId(null)
    setIsCreating(false)
    setIsRecommending(false)
    setSelectedOrigin(null)
    setCreatedTitle(title)
    setCatalogVersion((version) => version + 1)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <header className="site-header">
        <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
        <div className="site-header__inner wrap">
          <a className="brand" href="/" onClick={showCatalog} aria-label="Indica Aí, voltar ao catálogo">
            <span className="brand__mark" aria-hidden="true">i</span>
            <span>indica aí</span>
          </a>
          <nav className="site-nav" aria-label="Navegação principal">
            <a
              className="header-link"
              href="/"
              onClick={showCatalog}
              aria-current={!isCreating && !isRecommending && selectedOrigin !== 'recomendacao' ? 'page' : undefined}
            >
              Catálogo
            </a>
            <a
              className="header-link"
              href="/?recomendar=1"
              onClick={showRecommendations}
              aria-current={isRecommending || selectedOrigin === 'recomendacao' ? 'page' : undefined}
            >
              Recomendar
            </a>
            <a
              className="header-link"
              href="/?cadastro=1"
              onClick={showCreateForm}
              aria-current={isCreating ? 'page' : undefined}
            >
              Cadastrar título
            </a>
          </nav>
        </div>
      </header>
      <main id="main-content">
        {selectedId
          ? <TitleDetailPage
            key={selectedId}
            id={selectedId}
            onBack={selectedOrigin === 'recomendacao' ? showRecommendations : showCatalog}
            backLabel={selectedOrigin === 'recomendacao' ? 'Voltar às recomendações' : 'Voltar ao catálogo'}
          />
          : isCreating
            ? <TitleFormPage onCancel={showCatalog} onCreated={handleTitleCreated} />
            : isRecommending
              ? <RecommendationPage
                session={recommendationSession}
                setSession={setRecommendationSession}
                onSelectTitle={(title) => showDetails(title, 'recommendation')}
              />
              : <CatalogPage
                onSelectTitle={showDetails}
                refreshToken={catalogVersion}
              />}
      </main>
      {createdTitle && (
        <Toast
          message={`Título “${createdTitle.titulo}” cadastrado com sucesso.`}
          onClose={dismissCreatedTitle}
        />
      )}
      <footer className="site-footer">
        <div className="site-footer__inner wrap">
          <span>Indica Aí</span>
          <span>Catálogo local</span>
        </div>
      </footer>
    </>
  )
}

export default App
