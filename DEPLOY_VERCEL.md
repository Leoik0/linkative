# Deploy Vercel - Linkative SaaS

## 🚀 Deploy Completo no Vercel (Backend + Frontend)

### Passo 1: Preparar Banco de Dados (Neon)

1. Acesse: https://neon.tech
2. Crie conta gratuita
3. Crie novo projeto: "linkative"
4. Copie a `DATABASE_URL` (Connection String)

### Passo 2: Deploy no Vercel

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em "Add New" → "Project"
4. Importe o repositório: `Leoik0/linkative`
5. Configure as variáveis de ambiente:

```env
# Backend
DATABASE_URL=postgresql://[SUA_URL_DO_NEON]
NODE_ENV=production

# Frontend (será usado automaticamente)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_[SUA_CHAVE_DO_CLERK]
VITE_API_URL=https://[SEU_PROJETO].vercel.app
```

6. Clique em "Deploy"

### Passo 3: Configurar Clerk

1. Acesse: https://clerk.com
2. Crie conta e novo aplicativo
3. Em "API Keys" copie a `Publishable key`
4. Em "Allowed origins" adicione: `https://[SEU_PROJETO].vercel.app`
5. Cole a key nas variáveis de ambiente do Vercel

### Passo 4: Rodar Migrations

Após primeiro deploy, execute via terminal Vercel ou localmente:

```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

## ⚙️ Configurações Importantes

### Frontend precisa usar URL dinâmica

Edite `frontend/src/config/constants.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
```

### CORS no Backend

O backend já está configurado para aceitar todas as origens. Para produção, considere restringir.

## 🔍 Verificação

Após deploy:

1. Acesse `https://[SEU_PROJETO].vercel.app/api/health`
   - Deve retornar: `{"status":"ok","timestamp":"..."}`

2. Acesse `https://[SEU_PROJETO].vercel.app`
   - Deve carregar a interface

## 📊 Variáveis de Ambiente Completas

```env
# Backend (Vercel Environment Variables)
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
NODE_ENV=production

# Frontend (Build Environment Variables)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
VITE_API_URL=https://linkative.vercel.app
```

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se `VITE_API_URL` está correto
- Backend já aceita todas as origens

### Erro de Database
- Rode `npx prisma migrate deploy` via Vercel CLI
- Verifique se `DATABASE_URL` está correta

### Build falha no Frontend
- Verifique se todas as dependências estão em `package.json`
- Certifique-se que `vercel-build` script existe

## 🎯 Comandos Úteis

```bash
# Deploy via CLI (opcional)
npm i -g vercel
vercel login
vercel --prod

# Rodar migrations no Vercel
vercel env pull
cd backend && npx prisma migrate deploy

# Ver logs
vercel logs [deployment-url]
```

## 💰 Custos

- **Vercel**: Gratuito até 100GB bandwidth/mês
- **Neon**: Gratuito até 3GB storage
- **Clerk**: Gratuito até 10k usuários/mês

Total: **R$ 0,00** para começar! 🎉
