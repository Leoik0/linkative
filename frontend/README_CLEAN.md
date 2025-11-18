# Frontend - Linktree SaaS

Interface React moderna para gerenciamento de perfis sociais com analytics, usando Vite, Tailwind CSS e Clerk.

## 📁 Estrutura do Projeto

```
frontend/src/
├── config/
│   └── constants.js       # Constantes e configurações
├── services/
│   └── apiService.js      # Camada de API HTTP
├── hooks/
│   └── useAdmin.js        # Hook customizado de admin
├── components/
│   ├── Loader.jsx              # Componente de loading
│   ├── ProtectedRoute.jsx      # Guard de rotas
│   └── ProfileEditorModal.jsx  # Modal de edição
├── pages/
│   ├── Home.jsx           # Página principal
│   ├── Profile.jsx        # Perfil público
│   ├── Dashboard.jsx      # Analytics
│   ├── Login.jsx          # Login
│   └── About.jsx          # Sobre
├── App.jsx                # Rotas principais
└── main.jsx               # Entrada da aplicação
```

## 🎯 Arquitetura e Boas Práticas

### Separação de Responsabilidades

- **Services**: Lógica de comunicação HTTP isolada
- **Hooks**: Lógica de estado reutilizável
- **Components**: Apenas UI e apresentação
- **Config**: Constantes centralizadas

### Padrões Aplicados

- **Custom Hooks**: Encapsulam lógica complexa (ex: `useAdmin`)
- **Service Layer**: API isolada do componente
- **Constants**: URLs, mensagens e valores fixos centralizados
- **Component Composition**: Componentes pequenos e reutilizáveis

### Clean Code

- **Nomenclatura semântica**: variáveis autoexplicativas
- **Componentes funcionais**: hooks modernos
- **Props tipadas**: comentários JSDoc quando necessário
- **Importações organizadas**: services → hooks → components

## 🚀 Comandos

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie `.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### API Base URL

Edite `src/config/constants.js` para mudar a URL da API:

```javascript
export const API_BASE_URL = "http://localhost:4000/api";
```

## 📦 Dependências Principais

- **react**: UI library
- **react-router-dom**: Roteamento
- **@clerk/clerk-react**: Autenticação
- **react-chartjs-2**: Gráficos
- **tailwindcss**: Estilização
- **vite**: Build tool

## 🎨 Estrutura de Páginas

### Home (Protegida)

- Exibe perfil editável
- Botões de edição e analytics (owner only)
- Auto-criação de admin no primeiro login

### Profile (Pública)

- Acesso via `/perfil/:slug`
- Rastreamento de cliques
- Sem autenticação necessária

### Dashboard (Protegida)

- Gráficos de analytics
- Cliques por link, horário, cidade e origem
- Requer flag `hasAnalytics` ativa

## 🔐 Fluxo de Autenticação

1. Clerk gerencia login/signup
2. `ProtectedRoute` valida sessão
3. `useAdmin` busca/cria perfil automaticamente
4. Flag `isOwner` controla permissões de edição

## 🧪 Exemplo de Uso do Hook

```jsx
import { useAdmin } from "./hooks/useAdmin";

function MyComponent() {
  const { admin, loading, isOwner, updateAdmin } = useAdmin();

  if (loading) return <Loader />;

  return (
    <div>
      <h1>{admin.nome}</h1>
      {isOwner && <button onClick={() => updateAdmin({...})}>Editar</button>}
    </div>
  );
}
```

## 🎯 Próximos Passos

- [ ] Testes unitários (Vitest)
- [ ] Componente de erro boundary
- [ ] Cache de API com React Query
- [ ] Lazy loading de rotas
- [ ] PWA support
