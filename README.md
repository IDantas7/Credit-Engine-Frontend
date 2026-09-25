# Credit Engine Frontend

Frontend desenvolvido para testar o fluxo principal do desafio técnico **Credit Engine**.

A aplicação permite cadastrar cotações de câmbio, realizar simulações de recebíveis, visualizar os resultados da precificação e realizar a liquidação das operações.

## Funcionalidades

- Cadastro manual de cotação USD;
- Simulação de recebíveis;
- Exibição de valor presente (PV);
- Exibição do deságio;
- Conversão cambial para USD;
- Liquidação de simulações utilizando `idempotencyKey`;
- Listagem das liquidações realizadas.

## Tecnologias utilizadas

- React
- Vite
- JavaScript
- Nginx
- Docker

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

### Desenvolvimento local

Para executar o frontend localmente, é necessário que o backend Spring Boot esteja rodando na porta `8080`.

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra o endereço exibido pelo Vite no terminal.

Durante o desenvolvimento local, o Vite faz proxy das chamadas `/api/*` para:

```text
http://localhost:8080
```

Dessa forma, não é necessário alterar a configuração de CORS do backend apenas para o desenvolvimento local.

## Docker

O frontend também pode ser executado através de Docker.

A imagem utiliza um build em múltiplos estágios:

- Node.js para instalar as dependências e gerar o build da aplicação React;
- Nginx para servir os arquivos estáticos gerados pelo Vite.

O Nginx também é responsável por encaminhar as requisições `/api/*` para o backend quando a aplicação é executada através do Docker Compose.

### Construir somente o frontend

Para construir a imagem Docker do frontend isoladamente:

```bash
docker build -t credit-engine-frontend .
```

## Executar a aplicação completa

A execução completa da aplicação — frontend, backend e PostgreSQL — é orquestrada pelo Docker Compose disponível no repositório do backend:

[Credit-Engine](https://github.com/IDantas7/Credit-Engine)

A partir do repositório do backend, todo o ambiente pode ser iniciado com:

```bash
docker compose up --build
```

O Docker Compose irá iniciar:

```text
Frontend (React + Nginx)
        |
        | /api
        v
Backend (Spring Boot)
        |
        | JDBC
        v
PostgreSQL
```

Após a inicialização, o frontend estará disponível em:

```text
http://localhost:3000
```

O backend estará disponível em:

```text
http://localhost:8080
```

A documentação Swagger pode ser acessada em:

```text
http://localhost:8080/swagger-ui/index.html
```

## Fluxo para teste

Um fluxo simples para validar a aplicação é:

1. Cadastre uma cotação USD;
2. Faça uma simulação em BRL;
3. Faça uma simulação em USD;
4. Confira o PV, deságio, FX e valor convertido;
5. Liquide a simulação;
6. Confira o registro na tabela de liquidações.

## API consumida

### `POST /exchange-rates`

Responsável pelo cadastro manual de uma cotação de câmbio.

Exemplo:

```json
{
  "currency": "USD",
  "rate": 5.25,
  "effectiveAt": "2026-09-17T14:00"
}
```

### `POST /simulations`

Responsável pela criação de uma simulação de recebível.

Exemplo:

```json
{
  "receivableType": "DUPLICATA_MERCANTIL",
  "faceValue": 100000,
  "termMonths": 3,
  "currency": "BRL"
}
```

### `POST /settlements`

Responsável pela liquidação de uma simulação.

Exemplo:

```json
{
  "simulationId": 1,
  "idempotencyKey": "uuid-gerado-pelo-front"
}
```

A `idempotencyKey` é utilizada para evitar a criação duplicada da mesma liquidação.

### `GET /settlements`

Carrega os registros de liquidação exibidos na tabela do frontend.

## Integração com o backend

Durante o desenvolvimento local, as requisições para `/api/*` são encaminhadas pelo proxy configurado no Vite para:

```text
http://localhost:8080
```

Durante a execução via Docker, o Nginx encaminha essas requisições diretamente para o serviço do backend dentro da rede criada pelo Docker Compose:

```text
frontend
   |
   | /api/*
   v
backend:8080
```

Essa configuração permite que o mesmo frontend funcione tanto no ambiente de desenvolvimento quanto no ambiente executado através do Docker Compose.