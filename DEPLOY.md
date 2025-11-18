# 🚀 Guia de Deploy - Linktree SaaS

Este guia mostrará como fazer deploy completo do projeto em plataformas gratuitas.

## 📋 Pré-requisitos

- [ ] Conta no [GitHub](https://github.com)
- [ ] Conta no [Railway](https://railway.app) ou [Render](https://render.com) (Backend)
- [ ] Conta no [Vercel](https://vercel.com) ou [Netlify](https://netlify.com) (Frontend)
- [ ] Conta no [Clerk](https://clerk.com) (Autenticação)
- [ ] Repositório Git criado e código commitado

## 🗂️ Passo 1: Criar Repositório no GitHub

```bash
# Se ainda não fez o commit inicial
git add .
git commit -m "Initial commit"

# Criar repositório no GitHub e adicionar remote
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git branch -M main
git push -u origin main
```

## 🐘 Passo 2: Deploy do Backend (Railway - Recomendado)

### Railway (Grátis com $5 de crédito mensal)

1. **Acesse [Railway](https://railway.app) e faça login**

2. **Novo Projeto**
   - Click em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Autorize Railway a acessar seu repositório
   - Selecione o repositório do projeto

3. **Adicionar PostgreSQL**
   - No dashboard do projeto, click em "New"
   - Selecione "Database" → "Add PostgreSQL"
   - Railway automaticamente criará `DATABASE_URL`

4. **Configurar Service**
   - Click no service do backend
   - Vá em "Settings"
   - Configure:
     - **Root Directory**: `backend`
     - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
     - **Start Command**: `npm start`

5. **Variáveis de Ambiente**
   - Vá em "Variables"
   - `DATABASE_URL` já está configurado automaticamente
   - Adicione:
     - `NODE_ENV` = `production`
     - `PORT` = `4000` (opcional, Railway auto-detecta)

6. **Deploy**
   - Railway fará deploy automático
   - Copie a URL gerada (ex: `https://seu-app.railway.app`)

### Railway CLI (Alternativa)

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Criar projeto
railway init

# Adicionar PostgreSQL
railway add

# Deploy
railway up

# Ver logs
railway logs
```

### Render (Alternativa Gratuita)

1. Acesse [Render](https://render.com)
2. New → Web Service
3. Conecte seu repositório
4. Configure:
   - **Name**: `linktree-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
5. Adicione PostgreSQL: New → PostgreSQL
6. Copie `DATABASE_URL` e adicione nas Environment Variables
7. Deploy!

## 🎨 Passo 3: Deploy do Frontend (Vercel - Recomendado)

### Vercel (Grátis ilimitado para hobby)

1. **Acesse [Vercel](https://vercel.com) e faça login**

2. **Novo Projeto**
   - Click em "Add New" → "Project"
   - Import seu repositório do GitHub
   - Vercel detectará automaticamente que é um projeto Vite

3. **Configurações**
   - **Project Name**: `linktree-frontend`
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   - Adicione as seguintes variáveis:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_XXXXXX
   VITE_API_URL=https://seu-backend.railway.app/api
   ```

5. **Deploy**
   - Click em "Deploy"
   - Vercel fará build e deploy automático
   - Sua URL será algo como: `https://seu-app.vercel.app`

### Vercel CLI (Alternativa)

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Na pasta frontend
cd frontend

# Deploy
vercel

# Configurar env vars no dashboard
# Depois deploy para produção
vercel --prod
```

### Netlify (Alternativa)

1. Acesse [Netlify](https://netlify.com)
2. New site from Git
3. Conecte repositório
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_API_URL`
6. Deploy!

## 🔐 Passo 4: Configurar Clerk (Autenticação)

1. **Acesse [Clerk Dashboard](https://dashboard.clerk.com)**

2. **Configure URLs permitidas**
   - Vá em "Paths" ou "URL Settings"
   - Adicione suas URLs de produção:
     - Frontend: `https://seu-app.vercel.app`
     - Backend: `https://seu-backend.railway.app`

3. **Configure Redirects**
   - Sign in URL: `https://seu-app.vercel.app/login`
   - After sign in: `https://seu-app.vercel.app`
   - After sign up: `https://seu-app.vercel.app`

4. **Copie as chaves**
   - `CLERK_PUBLISHABLE_KEY` → já está no frontend
   - Não precisa de chave secreta no backend (é stateless)

## ✅ Passo 5: Testar Deploy

1. **Acesse seu frontend** em `https://seu-app.vercel.app`
2. **Faça login** com Clerk
3. **Teste criação de perfil**
4. **Teste analytics** (ative `hasAnalytics` no banco via Prisma Studio)
5. **Teste perfil público** acessando `/perfil/seu-slug`

## 🔄 Passo 6: Deploy Contínuo

Agora qualquer push para `main` fará deploy automático:

```bash
# Faça mudanças
git add .
git commit -m "Minha mudança"
git push origin main
```

- Railway e Vercel detectarão automaticamente e farão novo deploy
- Logs disponíveis nos dashboards

## 🛠️ Comandos Úteis

### Railway

```bash
# Ver logs do backend
railway logs

# Abrir dashboard
railway open

# Rodar comando no servidor
railway run npm run prisma:migrate:deploy
```

### Vercel

```bash
# Ver logs
vercel logs

# Listar deploys
vercel ls

# Rollback
vercel rollback
```

## 📊 Gerenciar Banco de Dados

### Acessar Prisma Studio em Produção

```bash
# Via Railway CLI
railway run npx prisma studio

# Ou configure DATABASE_URL local
DATABASE_URL="sua-url-railway" npx prisma studio
```

### Rodar Migrations em Produção

```bash
# Automático no deploy (já configurado)
# Ou manual via CLI:
railway run npx prisma migrate deploy
```

### Seed em Produção (opcional)

```bash
railway run npm run seed
```

## 🐛 Troubleshooting

### Backend não inicia
- ✅ Verifique `DATABASE_URL` nas env vars
- ✅ Confirme que migrations rodaram: `railway logs`
- ✅ Verifique porta: Railway define automaticamente

### Frontend não conecta
- ✅ Confirme `VITE_API_URL` aponta para Railway
- ✅ Verifique CORS no backend (já configurado)
- ✅ Teste API diretamente: `curl https://seu-backend.railway.app/api/admin/check-slug/test`

### Clerk não autentica
- ✅ URLs corretas no Clerk Dashboard
- ✅ `VITE_CLERK_PUBLISHABLE_KEY` correto
- ✅ Clear cache do navegador

### Uploads não funcionam
- ✅ Railway tem sistema de arquivos efêmero
- ✅ Para produção, use S3/Cloudinary (TODO futuro)

## 💰 Custos

- **Railway**: $5 grátis/mês (suficiente para hobby)
- **Vercel**: Ilimitado grátis (com limites de banda)
- **Netlify**: 100GB banda grátis/mês
- **Clerk**: 10k usuários grátis
- **Total**: **$0** para começar! 🎉

## 🎯 Checklist Final

- [ ] Backend rodando no Railway/Render
- [ ] PostgreSQL conectado
- [ ] Migrations aplicadas
- [ ] Frontend rodando no Vercel/Netlify
- [ ] Clerk configurado com URLs corretas
- [ ] Perfil criado e editável
- [ ] Analytics funcionando
- [ ] Perfil público acessível
- [ ] Deploy contínuo ativo

## 📚 Próximos Passos

1. **Custom Domain**: Adicione domínio próprio no Vercel
2. **Monitoring**: Configure alertas no Railway
3. **Analytics**: Google Analytics no frontend
4. **Backups**: Configure backups automáticos do PostgreSQL
5. **CDN**: Configure upload para S3/Cloudinary

---

**🎉 Parabéns! Seu SaaS está no ar!**

Compartilhe: `https://seu-app.vercel.app/perfil/seu-slug`
