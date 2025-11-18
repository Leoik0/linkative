# Backend - Linktree SaaS

API RESTful para gerenciamento de perfis e analytics, construída com Express, Prisma e PostgreSQL.

## 📁 Estrutura do Projeto

```
backend/
├── config/
│   ├── constants.js      # Constantes da aplicação
│   └── multer.js          # Configuração de upload
├── controllers/
│   ├── adminController.js     # Lógica de perfis
│   └── analyticsController.js # Lógica de analytics
├── services/
│   ├── slugService.js          # Geração de slugs únicos
│   ├── referrerService.js      # Categorização de referrers
│   └── geolocationService.js   # API de geolocalização
├── utils/
│   └── requestUtils.js         # Utilitários HTTP
├── prisma/
│   ├── schema.prisma      # Schema do banco
│   ├── seed.js            # Dados de seed
│   └── migrations/        # Migrations
├── uploads/               # Arquivos enviados
├── adminRoutes.js         # Rotas de admin
├── analyticsRoutes.js     # Rotas de analytics
├── server.js              # Entrada da aplicação
├── .env                   # Variáveis de ambiente
└── package.json
```

## 🎯 Princípios Aplicados

### SOLID

- **Single Responsibility**: Cada classe/módulo tem uma única responsabilidade

  - `SlugService`: apenas geração e validação de slugs
  - `ReferrerService`: apenas categorização de origens
  - `GeolocationService`: apenas busca de localização

- **Open/Closed**: Extensível sem modificação

  - Novos referrers podem ser adicionados em `constants.js`
  - Novos endpoints não requerem mudança nos existentes

- **Dependency Inversion**: Controllers dependem de abstrações (services)
  - Controllers não implementam lógica de negócio diretamente
  - Fácil mockar services para testes

### Clean Code

- **Nomenclatura clara**: métodos e variáveis autoexplicativos
- **Funções pequenas**: cada função faz uma coisa
- **DRY**: código duplicado extraído para utilitários
- **Constantes centralizadas**: sem magic numbers/strings
- **Comentários JSDoc**: documentação inline

## 🚀 Comandos

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Prisma
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run seed
```

## 📡 Endpoints

### Admin

- `GET /api/admin?email=user@example.com` - Busca admin
- `POST /api/admin` - Cria admin
- `PUT /api/admin` - Atualiza admin
- `GET /api/admin/check-slug/:slug` - Verifica slug
- `POST /api/admin/upload` - Upload de imagem

### Analytics

- `POST /api/analytics/click` - Registra clique
- `GET /api/analytics/stats/:adminId` - Busca estatísticas

## 🔧 Configuração

Crie `.env` na raiz:

```env
DATABASE_URL="postgresql://..."
PORT=4000
```

## 📦 Dependências

- **express**: Framework web
- **@prisma/client**: ORM
- **cors**: CORS middleware
- **dotenv**: Variáveis de ambiente
- **multer**: Upload de arquivos

## 🧪 Testando

```bash
# Verificar slug
curl http://localhost:4000/api/admin/check-slug/meu-slug

# Buscar admin
curl http://localhost:4000/api/admin?email=teste@example.com

# Criar admin
curl -X POST http://localhost:4000/api/admin \
  -H "Content-Type: application/json" \
  -d '{"email":"novo@example.com","nome":"Novo User"}'
```
