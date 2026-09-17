const API_URL = '/api'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Erro ${response.status}`
    const text = await response.text()

    if (text) {
      try {
        const body = JSON.parse(text)
        message = body.message || body.error || message
      } catch {
        message = text
      }
    }

    throw new Error(message)
  }

  if (response.status === 204 || response.status === 201) {
    const text = await response.text()
    return text ? JSON.parse(text) : null
  }

  return response.json()
}

export function createExchangeRate(exchangeRate) {
  return request('/exchange-rates', {
    method: 'POST',
    body: JSON.stringify(exchangeRate),
  })
}

export function createSimulation(simulation) {
  return request('/simulations', {
    method: 'POST',
    body: JSON.stringify(simulation),
  })
}

export function createSettlement(settlement) {
  return request('/settlements', {
    method: 'POST',
    body: JSON.stringify(settlement),
  })
}

export function getSettlements() {
  return request('/settlements')
}
