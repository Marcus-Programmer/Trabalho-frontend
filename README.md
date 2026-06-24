# 🎓 Sistema de Gestão de TCCs

Sistema web completo para gerenciamento de Trabalhos de Conclusão de Curso (TCCs), desenvolvido com **Angular** no frontend e **Django REST Framework** no backend.

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 17+ (standalone components, Chart.js) |
| Backend | Python 3.12, Django REST Framework |
| Banco de Dados | PostgreSQL 15 |
| Containerização | Docker + Docker Compose |
| Servidor Web | Nginx (produção) / Gunicorn |

---

## ✅ Funcionalidades

- 📊 **Dashboard** com gráficos interativos (por status, tipo, orientador, curso, semestre)
- 📄 **Listagem e busca** de TCCs com filtro por status e paginação
- ➕ **Cadastro de TCC** com upload de arquivo PDF (drag & drop)
- ✏️ **Edição** de TCC e **alteração de status** diretamente na tela de detalhe
- 🗑️ **Exclusão** de TCC com confirmação
- 👤 **Alunos** — listagem com busca por nome ou matrícula
- 👨‍🏫 **Professores** — listagem com busca por nome
- 📚 **Cursos**, **Departamentos** e **Unidades Acadêmicas** — listagem completa

---

## 🚀 Como Executar

### Opção 1 — Docker (Recomendado) 🐳

Sobe tudo com um único comando: PostgreSQL + Backend Django + Frontend Angular via Nginx.

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/projeto-gestao-tccs.git
cd projeto-gestao-tccs

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Suba todos os serviços
docker compose up --build
```

Após subir:
- 🌐 **Frontend:** http://localhost
- 🔌 **API (Backend):** http://localhost:8000/api/
- 🗄️ **PostgreSQL:** porta 5432

> **Nota:** Na primeira execução, as migrações e a coleta de estáticos são feitas automaticamente pelo `docker-entrypoint.sh`.

Para popular o banco com dados iniciais:
```bash
docker compose exec backend python load.py
```

Para parar:
```bash
docker compose down
```

---

### Opção 2 — Execução Local (Desenvolvimento)

#### Backend (Django)

Pré-requisito: Python 3.10+

```bash
# 1. Crie e ative o ambiente virtual
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# 2. Instale as dependências
pip install -r requirements.txt

# 3. Configure o ambiente — edite o .env para usar SQLite (mais simples):
cp .env.example .env
# No .env, altere: DB_ENGINE=sqlite

# 4. Aplique as migrações
python manage.py makemigrations core
python manage.py migrate

# 5. (Opcional) Popule com dados iniciais
python load.py

# 6. Suba o servidor
python manage.py runserver
```

Backend disponível em: http://127.0.0.1:8000/api/

#### Frontend (Angular)

Pré-requisito: Node.js 18+ e npm

```bash
cd frontend

# 1. Instale as dependências
npm install

# 2. Suba o servidor de desenvolvimento
npm start
```

Frontend disponível em: http://localhost:4200

> **Atenção:** Em desenvolvimento, o frontend se comunica diretamente com `http://localhost:8000`. Certifique-se de que o backend está rodando antes de abrir o frontend.

---

## 📡 Endpoints da API

| Recurso | URL |
|---------|-----|
| Unidades Acadêmicas | `GET /api/unidades-academicas/` |
| Departamentos | `GET /api/departamentos/` |
| Cursos | `GET /api/cursos/` |
| Alunos | `GET /api/alunos/` |
| Professores | `GET /api/professores/` |
| TCCs | `GET/POST /api/tccs/` |
| TCC (detalhe) | `GET/PUT/PATCH/DELETE /api/tccs/{id}/` |
| Estatísticas | `GET /api/tccs/estatisticas/` |

### Status dos TCCs

| Código | Status |
|--------|--------|
| `0` | Em Elaboração |
| `1` | Enviado |
| `2` | Aprovado |
| `3` | Reprovado |

### Upload de PDF

Para criar ou editar um TCC com arquivo, utilize `multipart/form-data`:

```bash
curl -X POST http://localhost:8000/api/tccs/ \
  -F "titulo=Meu TCC" \
  -F "arquivo=@/caminho/para/arquivo.pdf" \
  -F "aluno=1" \
  -F "orientador=2" \
  ...
```

---

## 🏗️ Estrutura do Projeto

```
projeto-gestao-tccs/
├── core/                        # App Django (models, views, serializers)
├── tcc_project/                 # Configurações do Django
├── frontend/                    # App Angular
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── models/          # Interfaces TypeScript
│   │   │   └── services/        # ApiService, ToastService
│   │   ├── features/
│   │   │   ├── dashboard/       # Dashboard com gráficos
│   │   │   ├── tccs/            # Lista, Formulário e Detalhe de TCC
│   │   │   ├── alunos/
│   │   │   ├── professores/
│   │   │   ├── cursos/
│   │   │   ├── departamentos/
│   │   │   └── unidades/
│   │   └── shared/
│   │       ├── sidebar/         # Navegação lateral
│   │       └── toast/           # Notificações
│   ├── Dockerfile               # Build multi-stage (Node → Nginx)
│   └── nginx.conf               # Config Nginx com proxy reverso
├── Dockerfile.backend           # Dockerfile do Django + Gunicorn
├── docker-compose.yml           # Orquestração completa
├── docker-entrypoint.sh         # Migrações + collectstatic + Gunicorn
├── requirements.txt
├── load.py                      # Script para popular dados iniciais
└── .env.example                 # Exemplo de variáveis de ambiente
```

---

## ⚙️ Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste conforme necessário:

```env
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1

# Banco de dados (use 'sqlite' para desenvolvimento local sem Docker)
DB_ENGINE=postgresql
DB_NAME=tcc_db
DB_USER=tcc_user
DB_PASSWORD=tcc_password
DB_HOST=db
DB_PORT=5432
```

---

## 👥 Integrantes do Grupo

<!-- Adicione os nomes dos integrantes aqui -->
- 

---

## 📋 Requisitos Atendidos

- [x] Listagem e busca de Alunos, Professores, Cursos, Departamentos, Unidades Acadêmicas e TCCs
- [x] Cadastro de TCCs com upload de arquivo PDF
- [x] Interface para alterar o status do TCC
- [x] Dashboard de estatísticas com gráficos (Chart.js)
- [x] **Ponto extra:** Conteinerização com Docker (+10%)
- [x] **Ponto extra:** Banco de dados PostgreSQL (+10%)
- [x] **Ponto extra:** Aplicação pronta para produção com Nginx + Gunicorn (+10%)
