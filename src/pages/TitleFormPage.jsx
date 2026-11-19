import { useState } from 'react'
import { createTitulo } from '../api/titulos.js'

const tipoOptions = [
  { value: 'filme', label: 'Filme' },
  { value: 'serie', label: 'Série' },
  { value: 'documentario', label: 'Documentário' },
  { value: 'animacao', label: 'Animação' },
  { value: 'novela', label: 'Novela' },
]

const emptyValues = {
  titulo: '',
  tipo: 'filme',
  ano: '',
  generos: '',
  descricao: '',
  avaliacao: '',
  imagem: '',
  palavrasChave: '',
}

const currentYear = new Date().getFullYear()

function parseList(value) {
  if (!value.trim()) return []
  return value.split(',').map((item) => item.trim())
}

function isHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol)
  } catch {
    return false
  }
}

function validate(values) {
  const errors = {}
  const titulo = values.titulo.trim()
  const tipoValido = tipoOptions.some((option) => option.value === values.tipo)
  const ano = Number(values.ano)
  const generos = parseList(values.generos)
  const palavrasChave = parseList(values.palavrasChave)
  const avaliacao = values.avaliacao.trim() === '' ? undefined : Number(values.avaliacao)
  const imagem = values.imagem.trim()

  if (!titulo) errors.titulo = 'Informe o título.'
  if (!tipoValido) errors.tipo = 'Selecione um tipo válido.'
  if (!values.ano.trim() || !Number.isInteger(ano) || ano < 1888 || ano > currentYear + 1) {
    errors.ano = `Informe um ano inteiro entre 1888 e ${currentYear + 1}.`
  }
  if (generos.length === 0 || generos.some((genero) => !genero)) {
    errors.generos = 'Informe ao menos um gênero, sem itens vazios.'
  }
  if (!values.descricao.trim()) errors.descricao = 'Informe a descrição.'
  if (values.palavrasChave.trim() && palavrasChave.some((palavra) => !palavra)) {
    errors.palavrasChave = 'Remova palavras-chave vazias da lista.'
  }
  if (values.avaliacao.trim() && (!Number.isFinite(avaliacao) || avaliacao < 0 || avaliacao > 10)) {
    errors.avaliacao = 'Informe uma avaliação entre 0 e 10.'
  }
  if (imagem && !isHttpUrl(imagem)) {
    errors.imagem = 'Informe uma URL HTTP ou HTTPS válida.'
  }

  return {
    errors,
    title: {
      titulo,
      tipo: values.tipo,
      ano,
      generos,
      descricao: values.descricao.trim(),
      palavrasChave,
      ...(avaliacao !== undefined ? { avaliacao } : {}),
      ...(imagem ? { imagem } : {}),
    },
  }
}

function createId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error('Este navegador não consegue gerar um identificador seguro para o título.')
  }

  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function FieldError({ id, children }) {
  return children ? <span className="form-error" id={id}>{children}</span> : null
}

export default function TitleFormPage({ onCancel, onCreated }) {
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setSubmitError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const result = validate(values)
    setErrors(result.errors)
    setSubmitError('')
    if (Object.keys(result.errors).length > 0) return

    setSubmitting(true)
    try {
      await createTitulo({ id: createId(), ...result.title })
      onCreated(result.title)
    } catch {
      setSubmitError('Não foi possível cadastrar o título. Confira se a API está em execução (npm run api) e tente novamente; seus dados continuam preenchidos.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldProps = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: updateField,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <section className="form-page" aria-labelledby="form-title">
      <div className="form-page__wrap wrap">
        <button className="detail-back" type="button" onClick={onCancel}>Voltar ao catálogo</button>
        <div className="form-intro">
          <p className="eyebrow">Catálogo local / novo registro</p>
          <h1 id="form-title">Cadastrar título</h1>
          <p>Preencha os dados do catálogo. Campos marcados com * são obrigatórios.</p>
        </div>

        <form className="title-form" noValidate onSubmit={handleSubmit}>
          {submitError && <p className="form-submit-error" role="alert">{submitError}</p>}

          <div className="form-grid">
            <div className="form-field form-field--wide">
              <label htmlFor="titulo">Título *</label>
              <input {...fieldProps('titulo')} autoComplete="off" />
              <FieldError id="titulo-error">{errors.titulo}</FieldError>
            </div>

            <div className="form-field">
              <label htmlFor="tipo">Tipo *</label>
              <select {...fieldProps('tipo')}>
                {tipoOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <FieldError id="tipo-error">{errors.tipo}</FieldError>
            </div>

            <div className="form-field">
              <label htmlFor="ano">Ano *</label>
              <input {...fieldProps('ano')} type="number" step="1" min="1888" max={currentYear + 1} />
              <FieldError id="ano-error">{errors.ano}</FieldError>
            </div>

            <div className="form-field form-field--wide">
              <label htmlFor="generos">Gêneros *</label>
              <input {...fieldProps('generos')} placeholder="Drama, aventura" />
              <span className="form-help">Separe os gêneros por vírgula.</span>
              <FieldError id="generos-error">{errors.generos}</FieldError>
            </div>

            <div className="form-field form-field--wide">
              <label htmlFor="descricao">Descrição *</label>
              <textarea {...fieldProps('descricao')} rows="4" />
              <FieldError id="descricao-error">{errors.descricao}</FieldError>
            </div>

            <div className="form-field">
              <label htmlFor="avaliacao">Avaliação (opcional)</label>
              <input {...fieldProps('avaliacao')} type="number" step="any" min="0" max="10" />
              <FieldError id="avaliacao-error">{errors.avaliacao}</FieldError>
            </div>

            <div className="form-field">
              <label htmlFor="imagem">Imagem (opcional)</label>
              <input {...fieldProps('imagem')} type="url" placeholder="https://" />
              <FieldError id="imagem-error">{errors.imagem}</FieldError>
            </div>

            <div className="form-field form-field--wide">
              <label htmlFor="palavrasChave">Palavras-chave</label>
              <input {...fieldProps('palavrasChave')} placeholder="amizade, viagem no tempo" />
              <span className="form-help">Separe por vírgula; pode deixar vazio.</span>
              <FieldError id="palavrasChave-error">{errors.palavrasChave}</FieldError>
            </div>

          </div>

          <div className="form-actions">
            <button className="back-button" type="submit" disabled={submitting}>
              {submitting ? 'Salvando…' : 'Cadastrar título'}
            </button>
            <button className="form-cancel" type="button" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </section>
  )
}
