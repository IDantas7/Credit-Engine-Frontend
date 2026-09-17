import { useEffect, useState } from 'react'
import { createSettlement } from '../services/api'
import { formatCurrency, formatDate, formatPercent } from '../utils/formatters'

function SimulationResult({ simulation, onSettlementCreated }) {
  const [idempotencyKey, setIdempotencyKey] = useState(crypto.randomUUID())
  const [settlement, setSettlement] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID())
    setSettlement(null)
    setError('')
  }, [simulation.simulationId])

  async function handleSettlement() {
    try {
      setLoading(true)
      setError('')

      const result = await createSettlement({
        simulationId: simulation.simulationId,
        idempotencyKey,
      })

      setSettlement(result)
      await onSettlementCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card result-card">
      <div className="section-title">
        <div>
          <h2>Resultado da simulação</h2>
          <p className="muted">ID: {simulation.simulationId}</p>
        </div>
      </div>

      <div className="result-grid">
        <ResultItem label="Tipo" value={simulation.receivableType} />
        <ResultItem
          label="Valor de face"
          value={formatCurrency(simulation.faceValue, 'BRL')}
        />
        <ResultItem label="Prazo" value={`${simulation.termMonths} meses`} />
        <ResultItem label="Pagamento" value={simulation.paymentCurrency} />
        <ResultItem
          label="Base Rate"
          value={formatPercent(simulation.baseRate)}
        />
        <ResultItem label="Spread" value={formatPercent(simulation.spread)} />
        <ResultItem
          label="Valor presente"
          value={formatCurrency(simulation.presentValue, 'BRL')}
        />
        <ResultItem
          label="Deságio"
          value={formatCurrency(simulation.discount, 'BRL')}
        />

        {simulation.paymentCurrency === 'USD' && (
          <>
            <ResultItem label="FX utilizada" value={simulation.fxRate} />
            <ResultItem
              label="Valor convertido"
              value={formatCurrency(simulation.convertedValue, 'USD')}
            />
          </>
        )}

        <ResultItem
          label="Criada em"
          value={formatDate(simulation.createdAt)}
        />
      </div>

      <div className="settlement-area">
        <p>
          <strong>Idempotency Key:</strong> {idempotencyKey}
        </p>

        <button
          type="button"
          onClick={handleSettlement}
          disabled={loading || settlement}
        >
          {loading
            ? 'Liquidando...'
            : settlement
              ? 'Liquidado'
              : 'Liquidar simulação'}
        </button>

        {settlement && (
          <p className="success">
            Liquidação {settlement.settlementId} criada em{' '}
            {formatDate(settlement.settledAt)}.
          </p>
        )}

        {error && <p className="error">{error}</p>}
      </div>
    </section>
  )
}

function ResultItem({ label, value }) {
  return (
    <div className="result-item">
      <span>{label}</span>
      <strong>{value ?? '-'}</strong>
    </div>
  )
}

export default SimulationResult
