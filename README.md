# Gerenciador de Tarefas - Projeto LDW

Este projeto foi desenvolvido para a disciplina de LDW. Trata-se de uma aplicação **full stack** para o gerenciamento de tarefas:

- **Backend (AT1):** API REST construída em Node.js, utilizando TypeScript, **Sequelize como ORM** e banco de dados PostgreSQL (configurável para rodar localmente ou na nuvem usando Supabase).
- **Frontend (AT2):** SPA construída com **React, TypeScript e shadcn/ui**, que consome a API e realiza o CRUD completo de tarefas.

## 🧰 Tecnologias

| Camada | Tecnologias |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, Sonner |
| Backend | Node.js, Express, TypeScript, Sequelize, PostgreSQL, Swagger |

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/) (para subir o PostgreSQL localmente)
- Git

## 🛠 Como instalar e rodar o projeto

**1. Clone o repositório**
```bash
git clone <url-do-teu-repositorio>
cd <pasta-do-projeto>
```

**2. Instalação das Dependências**

Execute os comandos abaixo:
```bash
# Na raiz do projeto
pnpm install

# Na pasta do backend
cd backend
pnpm install
cd ..

# Na pasta do app
cd app
pnpm install
cd ..
```

**3. Subindo o banco de dados**

Na raiz do projeto, suba o PostgreSQL com o Docker:
```bash
docker compose up -d
```

**4. Configuração das Variáveis de Ambiente**

*Backend:* dentro da pasta `backend`, crie um arquivo chamado `.env` a partir do arquivo `.env.example`:
```bash
cd backend
cp .env.example .env
```

Abaixo está a estrutura do arquivo e as instruções de como configurá-lo de acordo com o seu banco de dados (os valores abaixo correspondem ao `docker-compose.yml` do projeto):
```env
# Configurações do Servidor
PORT=3000

# Configuração do Banco de Dados PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_DIALECT=postgres
DB_SSL=false
```

*Frontend:* dentro da pasta `app`, crie um arquivo `.env` a partir do `.env.example`:
```bash
cd app
cp .env.example .env
```
Conteúdo:
```env
VITE_API_URL=http://localhost:3000/api
```

**5. Executando as Migrations e Iniciando o backend**

Dentro da pasta `backend`:
```bash
# Rodar as migrations do Sequelize para estruturar o banco de dados
pnpm sequelize-cli db:migrate

# Iniciar o servidor
pnpm run dev
```
O servidor ficará disponível em `http://localhost:3000` e a documentação Swagger em `http://localhost:3000/api/docs`.

**6. Iniciando o frontend**

Em **outro terminal**, dentro da pasta `app`:
```bash
pnpm dev
```
Acesse `http://localhost:5173`.

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/tarefas` | Lista todas as tarefas |
| GET | `/api/tarefas/:id` | Busca uma tarefa por ID |
| POST | `/api/tarefas` | Cria uma nova tarefa |
| PUT | `/api/tarefas/:id` | Atualiza uma tarefa |
| DELETE | `/api/tarefas/:id` | Remove uma tarefa |

## ✨ Funcionalidades do frontend

- Dashboard com listagem de tarefas e contadores (total, pendentes e concluídas)
- Criação e edição de tarefas em modal (título, etiqueta e prioridade)
- Marcar tarefa como concluída ou reabri-la
- Exclusão com confirmação
- Estados de carregamento (skeleton) e de lista vazia
- Notificações de sucesso e erro (toasts)
- Navegação entre páginas com React Router

## 📁 Estrutura do projeto

```
├── app/        # Frontend (React + TypeScript + shadcn/ui)
│   └── src/
│       ├── components/   # Layout, formulário e componentes do shadcn/ui
│       ├── pages/        # Dashboard e Sobre
│       ├── services/     # Consumo da API
│       └── types/        # Tipagens TypeScript
├── backend/    # API REST (Express + Sequelize)
└── docker-compose.yml
```