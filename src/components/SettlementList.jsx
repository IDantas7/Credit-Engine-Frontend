import { formatDate } from '../utils/formatters'

function SettlementList({ settlements, error, onRefresh }) {
  return (
    <section className="card">
      <div className="section-title">
        <div>
          <h2>Liquidações</h2>
          <p className="muted">Registros retornados pela API.</p>
        </div>

        <button className="secondary" type="button" onClick={onRefresh}>
          Atualizar
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {!error && settlements.length === 0 && (
        <p className="muted">Nenhuma liquidação encontrada.</p>
      )}

      {settlements.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Settlement ID</th>
                <th>Simulation ID</th>
                <th>Idempotency Key</th>
                <th>Liquidado em</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((settlement) => (
                <tr key={settlement.settlementId}>
                  <td>{settlement.settlementId}</td>
                  <td>{settlement.simulationId}</td>
                  <td className="key-cell">{settlement.idempotencyKey}</td>
                  <td>{formatDate(settlement.settledAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default SettlementList
