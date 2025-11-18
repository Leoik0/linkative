// Constantes da aplicação frontend
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const API_ENDPOINTS = {
  ADMIN: `${API_BASE_URL}/admin`,
  ADMIN_UPLOAD: `${API_BASE_URL}/admin/upload`,
  ADMIN_UPLOADS: `${API_BASE_URL}/admin/uploads`,
  CHECK_SLUG: (slug) => `${API_BASE_URL}/admin/check-slug/${slug}`,
  ANALYTICS_CLICK: `${API_BASE_URL}/analytics/click`,
  ANALYTICS_STATS: (adminId) => `${API_BASE_URL}/analytics/stats/${adminId}`,
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  ABOUT: "/about",
  DASHBOARD: "/dashboard",
  PROFILE: (slug) => `/perfil/${slug}`,
};

export const UI_MESSAGES = {
  LOADING_PROFILE: "Carregando seu perfil...",
  LOADING_SESSION: "Carregando sua sessão...",
  LOADING_STATS: "Carregando estatísticas...",
  NO_STATS: "Nenhuma estatística disponível",
  NO_PERMISSION: "Você não tem permissão para editar este perfil.",
  EMAIL_NOT_FOUND: "Email do usuário não encontrado. Não é possível salvar.",
};

export const DEFAULT_PROFILE = {
  BIO: "Desenvolvedor apaixonado por tecnologia e inovação ✨",
  IMAGE_URL: "https://via.placeholder.com/150",
  NAME: "Seu Nome",
  LINKS: [
    { title: "GitHub", url: "https://github.com/seu-usuario", icon: "🐱" },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/seu-perfil",
      icon: "💼",
    },
    { title: "Twitter", url: "https://twitter.com/seu-usuario", icon: "🐦" },
    { title: "Portfolio", url: "https://seu-portfolio.com", icon: "💻" },
  ],
};

export const DEBOUNCE_DELAY = 500; // ms para validação de slug
