// Constantes da aplicação
module.exports = {
  // Limites e configurações
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SLUG_LENGTH: 6,
  SLUG_PREFIX: "u",
  SLUG_GENERATION_ATTEMPTS: 10,
  DEFAULT_LINK_COLOR: "#2563eb",

  // Cores padrão do perfil
  DEFAULT_BG_TYPE: "color",
  DEFAULT_BG_VALUE: "#f5f5f5",
  DEFAULT_NOME_COLOR: "#1e293b",
  DEFAULT_BIO_COLOR: "#64748b",

  // Status HTTP
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  },

  // Mensagens de erro
  ERRORS: {
    ADMIN_NOT_FOUND: "Admin não encontrado",
    EMAIL_REQUIRED: "Campo 'email' é obrigatório",
    EMAIL_ALREADY_EXISTS: "Email já cadastrado",
    SLUG_REQUIRED: "Slug é obrigatório",
    SLUG_IN_USE: "Slug já está em uso por outro admin",
    LINK_ID_REQUIRED: "linkId é obrigatório",
    ADMIN_ID_REQUIRED: "adminId é obrigatório",
    NO_FILE_UPLOADED: "Nenhum arquivo enviado",
    INVALID_FILE_TYPE: "Arquivo não é uma imagem válida",
  },

  // Categorias de referrers
  REFERRER_CATEGORIES: {
    instagram: ["instagram.com", "ig.me"],
    facebook: ["facebook.com", "fb.com"],
    twitter: ["twitter.com", "t.co", "x.com"],
    tiktok: ["tiktok.com"],
    youtube: ["youtube.com", "youtu.be"],
    linkedin: ["linkedin.com"],
    pinterest: ["pinterest.com"],
    reddit: ["reddit.com"],
    google: ["google.com", "google."],
    bing: ["bing.com"],
    whatsapp: ["whatsapp.com", "wa.me"],
    telegram: ["t.me", "telegram"],
  },
};
