import { useState } from 'react'
import { createSimulation } from '../services/api'

const initialForm = {
  receivableType: 'DUPLICATA_MERCANTIL',
  faceValue: '',
  termMonths: '',
  currency: 'BRL',
}

function SimulationForm({ onSimulationCreated }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      setError('')

      const simulation = await createSimulation({
        receivableType: form.receivableType,
        faceValue: Number(form.faceValue),
        termMonths: Number(form.termMonths),
        currency: form.currency,
      })

      onSimulationCreated(simulation)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card">
      <h2>Nova simulação</h2>
      <p className="muted">Informe os dados do recebível.</p>

      <form onSubmit={handleSubmit}>
        <label>
          Tipo de recebível
          <select
            name="receivableType"
            value={form.receivableType}
            onChange={handleChange}
          >
            <option value="DUPLICATA_MERCANTIL">Duplicata Mercantil</option>
            <option value="CHEQUE_PRE_DATADO">Cheque Pré-datado</option>
          </select>
        </label>

        <label>
          Valor de face
          <input
            name="faceValue"
            type="number"
            step="0.01"
            min="0.01"
            value={form.faceValue}
            onChange={handleChange}
            placeholder="Ex.: 100000.00"
            required
          />
        </label>

        <label>
          Prazo em meses
          <input
            name="termMonths"
            type="number"
            min="1"
            step="1"
            value={form.termMonths}
            onChange={handleChange}
            placeholder="Ex.: 3"
            required
          />
        </label>

        <label>
          Moeda de pagamento
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Calculando...' : 'Simular'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </section>
  )
}

export default SimulationForm
