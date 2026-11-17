import { useState } from 'react'

const tipoLabels = {
  filme: 'Filme',
  serie: 'Série',
  documentario: 'Documentário',
  animacao: 'Animação',
  novela: 'Novela',
}

export default function Poster({ titulo, className = '', decorative = false }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = Boolean(titulo.imagem) && !imageFailed
  const type = tipoLabels[titulo.tipo] ? titulo.tipo : 'filme'
  const titleText = String(titulo.titulo || '')
  const initial = titleText.match(/[\p{L}\p{N}]/u)?.[0]?.toLocaleUpperCase('pt-BR') || 'I'
  const tone = [...String(titulo.id || titleText)].reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    7,
  ) % 5

  return (
    <div
      className={`poster poster--${type} poster--tone-${tone}${hasImage ? ' poster--image' : ''} ${className}`.trim()}
      role={hasImage || decorative ? undefined : 'img'}
      aria-label={hasImage || decorative ? undefined : `Capa indisponível para ${titulo.titulo}`}
      aria-hidden={decorative ? 'true' : undefined}
    >
      {hasImage && (
        <img
          className="poster__image"
          src={titulo.imagem}
          alt={decorative ? '' : `Imagem de ${titulo.titulo}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      )}
      {!hasImage && <span className="poster__initial" aria-hidden="true">{initial}</span>}
      <span className="poster__top" aria-hidden="true">
        <span>Indica Aí</span>
        <span>{titulo.ano}</span>
      </span>
      <span className="poster__bottom" aria-hidden="true">
        <span>{tipoLabels[titulo.tipo] || 'Título'}</span>
        <span>Catálogo local</span>
      </span>
    </div>
  )
}