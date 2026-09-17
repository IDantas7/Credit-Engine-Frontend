import { useEffect, useState } from 'react'
import ExchangeRateForm from './components/ExchangeRateForm'
import SimulationForm from './components/SimulationForm'
import SimulationResult from './components/SimulationResult'
import SettlementList from './components/SettlementList'
import { getSettlements } from './services/api'

function App() {
  const [simulation, setSimulation] = useState(null)
  const [settlements, setSettlements] = useState([])
  const [settlementsError, setSettlementsError] = useState('')

  async function loadSettlements() {
    try {
      setSettlementsError('')
      const data = await getSettlements()
      setSettlements(data)
    } catch (error) {
      setSettlementsError(error.message)
    }
  }

  useEffect(() => {
    loadSettlements()
  }, [])

  return (
    <main className="container">
      <header className="header">
        <h1>Credit Engine</h1>
        <p>Simulação e liquidação de recebíveis</p>
      </header>

      <section className="grid">
        <ExchangeRateForm />

        <SimulationForm onSimulationCreated={setSimulation} />
      </section>

      {simulation && (
        <SimulationResult
          simulation={simulation}
          onSettlementCreated={loadSettlements}
        />
      )}

      <SettlementList
        settlements={settlements}
        error={settlementsError}
        onRefresh={loadSettlements}
      />
    </main>
  )
}

export default App
