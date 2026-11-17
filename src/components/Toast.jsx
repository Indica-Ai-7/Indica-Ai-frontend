import { useEffect } from 'react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 5000)
    return () => window.clearTimeout(timeout)
  }, [onClose])

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" aria-label="Dispensar aviso" onClick={onClose}>Fechar</button>
    </div>
  )
}
