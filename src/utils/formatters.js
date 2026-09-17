export function formatCurrency(value, currency = 'BRL') {
  if (value === null || value === undefined) {
    return '-'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(Number(value))
}

export function formatPercent(value) {
  if (value === null || value === undefined) {
    return '-'
  }

  return `${(Number(value) * 100).toFixed(2)}%`
}

export function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('pt-BR')
}
