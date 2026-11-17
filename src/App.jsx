import { useEffect, useState } from 'react'
import './App.css'
import CatalogPage from './pages/CatalogPage.jsx'
import TitleDetailPage from './pages/TitleDetailPage.jsx'

function App() {
  const [selectedId, setSelectedId] = useState(() => (
    new URLSearchParams(window.location.search).get('titulo')
  ))

  useEffect(() => {
    const syncRoute = () => setSelectedId(new URLSearchParams(window.location.search).get('titulo'))
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  function showCatalog(event) {
    event.preventDefault()
    window.history.pushState({}, '', window.location.pathname)
    setSelectedId(null)
    window.scrollTo(0, 0)
  }

  function showDetails(title) {
    const query = new URLSearchParams({ titulo: title.id })
    window.history.pushState({}, '', `${window.location.pathname}?${query.toString()}`)
    setSelectedId(title.id)
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
        </div>
      </header>
      <main id="main-content">
        {selectedId
          ? <TitleDetailPage key={selectedId} id={selectedId} onBack={showCatalog} />
          : <CatalogPage onSelectTitle={showDetails} />}
      </main>
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
