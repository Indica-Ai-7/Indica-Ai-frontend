import { useCallback, useEffect, useState } from 'react'
import './App.css'
import CatalogPage from './pages/CatalogPage.jsx'
import TitleFormPage from './pages/TitleFormPage.jsx'
import TitleDetailPage from './pages/TitleDetailPage.jsx'
import Toast from './components/Toast.jsx'

function App() {
  const [selectedId, setSelectedId] = useState(() => (
    new URLSearchParams(window.location.search).get('titulo')
  ))
  const [isCreating, setIsCreating] = useState(() => (
    new URLSearchParams(window.location.search).get('cadastro') === '1'
  ))
  const [catalogVersion, setCatalogVersion] = useState(0)
  const [createdTitle, setCreatedTitle] = useState(null)
  const dismissCreatedTitle = useCallback(() => setCreatedTitle(null), [])

  useEffect(() => {
    const syncRoute = () => {
      const params = new URLSearchParams(window.location.search)
      setSelectedId(params.get('titulo'))
      setIsCreating(params.get('cadastro') === '1')
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
    setCreatedTitle(null)
    window.scrollTo(0, 0)
  }

  function showCreateForm(event) {
    event.preventDefault()
    window.history.pushState({}, '', `${window.location.pathname}?cadastro=1`)
    setSelectedId(null)
    setIsCreating(true)
    setCreatedTitle(null)
    window.scrollTo(0, 0)
  }

  function showDetails(title) {
    const query = new URLSearchParams({ titulo: title.id })
    window.history.pushState({}, '', `${window.location.pathname}?${query.toString()}`)
    setSelectedId(title.id)
    setIsCreating(false)
    setCreatedTitle(null)
    window.scrollTo(0, 0)
  }

  function handleTitleCreated(title) {
    window.history.pushState({}, '', window.location.pathname)
    setSelectedId(null)
    setIsCreating(false)
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
          <a className="header-link" href="/" onClick={showCatalog}>Catálogo</a>
          <a className="header-link" href="/?cadastro=1" onClick={showCreateForm}>Cadastrar título</a>
        </div>
      </header>
      <main id="main-content">
        {selectedId
          ? <TitleDetailPage key={selectedId} id={selectedId} onBack={showCatalog} />
          : isCreating
            ? <TitleFormPage onCancel={showCatalog} onCreated={handleTitleCreated} />
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
