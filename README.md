# Linktree SaaS 🔗

Plataforma completa de gerenciamento de links e analytics, similar ao Linktree, desenvolvida com React, Express, Prisma e PostgreSQL.

## 🚀 Features

- ✅ Autenticação via Clerk
- ✅ Criação e edição de perfil personalizado
- ✅ Slug único e customizável
- ✅ Upload de imagem de perfil
- ✅ Customização de cores e background
- ✅ Analytics completo com gráficos
- ✅ Rastreamento de cliques por link, cidade, horário e origem
- ✅ Sistema de permissões (owner/visitor)
- ✅ Perfil público sem autenticação
- ✅ Geração automática de slug aleatório

## 📁 Estrutura do Projeto

```
.
├── backend/          # API Express + Prisma
│   ├── config/       # Configurações e constantes
│   ├── controllers/  # Lógica de negócio
│   ├── services/     # Serviços reutilizáveis
│   ├── utils/        # Utilitários
│   ├── prisma/       # Schema e migrations
│   └── uploads/      # Arquivos enviados
│
├── frontend/         # React + Vite + Tailwind
│   ├── src/
│   │   ├── config/       # Constantes
│   │   ├── services/     # Camada de API
│   │   ├── hooks/        # Hooks customizados
│   │   ├── components/   # Componentes reutilizáveis
│   │   └── pages/        # Páginas da aplicação
│   └── public/
│
└── README.md         # Este arquivo
```

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- Prisma ORM
- PostgreSQL (Neon)
- Multer (uploads)
- dotenv

### Frontend
- React 18
- Vite
- Tailwind CSS
- Clerk (autenticação)
- Chart.js (gráficos)
- React Router

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL (ou conta no Neon)
- Conta no Clerk para autenticação

### 1. Clone o repositório

```bash
git clone <seu-repo>
cd <pasta-do-projeto>
```

### 2. Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Rodar migrations
npx prisma migrate dev

# (Opcional) Popular banco com dados de teste
npm run seed

# Iniciar servidor
npm run dev
```

### 3. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Adicione sua chave do Clerk

# Iniciar app
npm run dev
```

## 🌐 Deploy

### Backend (Railway / Render)

**Railway (Recomendado)**

1. Crie conta no [Railway](https://railway.app)
2. Conecte seu repositório GitHub
3. Adicione um PostgreSQL database
4. Configure variáveis de ambiente:
   - `DATABASE_URL` (auto-gerado pelo Railway)
   - `PORT` (auto-detectado)
5. Deploy automático!

**Comandos do Railway CLI**

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Linkar projeto
railway link

# Deploy
railway up
```

**Render**

1. Crie conta no [Render](https://render.com)
2. Novo Web Service → Conecte repo
3. Configure:
   - Build: `cd backend && npm install && npx prisma generate`
   - Start: `cd backend && npm start`
4. Adicione PostgreSQL database
5. Configure `DATABASE_URL` nas env vars

### Frontend (Vercel / Netlify)

**Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Na pasta frontend
cd frontend

# Deploy
vercel

# Deploy para produção
vercel --prod
```

**Configurar na Vercel Dashboard:**
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_CLERK_PUBLISHABLE_KEY`
  - `VITE_API_URL` (URL do backend no Railway/Render)

**Netlify**

1. Conecte repo no [Netlify](https://netlify.com)
2. Configure:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Adicione env vars no dashboard

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
PORT=4000
NODE_ENV=production
```

### Frontend (.env.local)
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_API_URL=https://seu-backend.railway.app/api
```

## 📚 Documentação Adicional

- [Backend README](./backend/README_CLEAN.md) - Arquitetura e endpoints
- [Frontend README](./frontend/README_CLEAN.md) - Componentes e hooks

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📝 Scripts Úteis

### Backend
```bash
npm run dev          # Desenvolvimento com nodemon
npm start            # Produção
npm run prisma:generate  # Gerar Prisma Client
npm run prisma:migrate   # Rodar migrations
npm run seed         # Popular banco
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Lint do código
```

## 🎯 Roadmap

- [ ] Testes automatizados (Jest/Vitest)
- [ ] CI/CD com GitHub Actions
- [ ] Rate limiting e segurança
- [ ] Cache de API com Redis
- [ ] Webhooks para integrações
- [ ] Temas customizados
- [ ] Analytics em tempo real

## 📄 Licença

MIT

## 👤 Autor

Desenvolvido com ❤️ por [Seu Nome]

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**
