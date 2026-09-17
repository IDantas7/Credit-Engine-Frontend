# Credit Engine Frontend

Frontend simples para testar o fluxo principal do desafio técnico Credit Engine.

## Funcionalidades

- Cadastro manual de cotação USD
- Simulação de recebível
- Exibição de PV, deságio e conversão cambial
- Liquidação da simulação com `idempotencyKey`
- Listagem de liquidações

## Estrutura

```text
src/
├── components/
│   ├── ExchangeRateForm.jsx
│   ├── SimulationForm.jsx
│   ├── SimulationResult.jsx
│   └── SettlementList.jsx
├── services/
│   └── api.js
├── utils/
│   └── formatters.js
├── App.jsx
├── main.jsx
└── styles.css
```

## Executar

Com o backend Spring Boot rodando na porta `8080`:

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite no terminal.

O Vite faz proxy das chamadas `/api/*` para `http://localhost:8080/*`, então não é necessário alterar o CORS do backend apenas para o desenvolvimento local.

## Fluxo para teste

1. Cadastre uma cotação USD.
2. Faça uma simulação em BRL.
3. Faça uma simulação em USD.
4. Confira o PV, deságio, FX e valor convertido.
5. Liquide a simulação.
6. Confira o registro na tabela de liquidações.

## API consumida

### `POST /exchange-rates`

```json
{
  "currency": "USD",
  "rate": 5.25,
  "effectiveAt": "2026-09-17T14:00"
}
```

### `POST /simulations`

```json
{
  "receivableType": "DUPLICATA_MERCANTIL",
  "faceValue": 100000,
  "termMonths": 3,
  "currency": "BRL"
}
```

### `POST /settlements`

```json
{
  "simulationId": 1,
  "idempotencyKey": "uuid-gerado-pelo-front"
}
```

### `GET /settlements`

Carrega os registros exibidos na tabela.
