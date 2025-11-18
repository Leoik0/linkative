# Backend API

Scripts principais:

- `npm run dev`: inicia o servidor com nodemon (porta 4000 por padrão)
- `npm start`: inicia o servidor em modo produção
- `npm run prisma:generate`: gera o Prisma Client
- `npm run prisma:migrate`: aplica migrações (dev)
- `npm run prisma:seed`: executa o seed do Prisma
- `npm run seed`: executa diretamente o arquivo `prisma/seed.js`

## Seed de Analytics

Para popular cliques de teste nos seus links:

1. Defina o e-mail do admin (mesmo usado no frontend/Clerk):

```bash
SEED_ADMIN_EMAIL="seu@email" npm run prisma:seed
```

2. Se o admin ainda não existir, informe um slug para criá-lo automaticamente:

```bash
SEED_ADMIN_EMAIL="seu@email" \
SEED_ADMIN_SLUG="seu-slug" \
npm run prisma:seed
```

O seed vai criar ~300 cliques distribuídos nos últimos dias, com cidades e origens (Instagram, WhatsApp, Google, etc.).

## Observação sobre OneDrive e Prisma (Windows)

Se aparecer erro `EPERM: operation not permitted, rename ... query_engine-windows.dll.node`, é comum em pastas sincronizadas do OneDrive.
Algumas alternativas:

- Mover o projeto para uma pasta fora do OneDrive
- Pausar a sincronização do OneDrive enquanto roda `prisma generate`
- Rodar os comandos novamente (às vezes é intermitente)

O backend e o seed podem funcionar mesmo se o `prisma generate` falhar pontualmente, caso o Client já esteja gerado anteriormente.
