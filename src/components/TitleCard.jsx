import Poster from './Poster.jsx'

export default function TitleCard({ titulo, onSelect }) {
  return (
    <article className="title-card">
      <button className="title-card__button" type="button" onClick={() => onSelect(titulo)}>
        <Poster titulo={titulo} decorative />
        <span className="title-card__body">
          <span className="title-card__title">{titulo.titulo}</span>
          <span className="title-card__meta">
            <span>{titulo.ano}</span>
            {titulo.generos?.[0] && <span>{titulo.generos[0]}</span>}
            {Number.isFinite(titulo.avaliacao) && (
              <span className="title-card__rating">{titulo.avaliacao.toFixed(1)}</span>
            )}
          </span>
        </span>
      </button>
    </article>
  )
}