import { useState } from 'react'
import { createExchangeRate } from '../services/api'

function ExchangeRateForm() {
  const [rate, setRate] = useState('')
  const [effectiveAt, setEffectiveAt] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setMessage('')
      setError('')

      await createExchangeRate({
        currency: 'USD',
        rate: Number(rate),
        effectiveAt,
      })

      setMessage('Cotação cadastrada com sucesso.')
      setRate('')
      setEffectiveAt('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h2>Cotação USD</h2>
      <p className="muted">Cadastre a cotação antes de simular em dólar.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Moeda
          <input value="USD" disabled />
        </label>

        <label>
          Taxa de câmbio
          <input
            type="number"
            step="0.0001"
            min="0.0001"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            placeholder="Ex.: 5.2500"
            required
          />
        </label>

        <label>
          Data/hora de vigência
          <input
            type="datetime-local"
            value={effectiveAt}
            onChange={(event) => setEffectiveAt(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Cadastrar cotação'}
        </button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default ExchangeRateForm
