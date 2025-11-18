// Serviço para geração de slugs únicos
const { PrismaClient } = require("@prisma/client");
const {
  SLUG_LENGTH,
  SLUG_PREFIX,
  SLUG_GENERATION_ATTEMPTS,
} = require("../config/constants");

const prisma = new PrismaClient();

class SlugService {
  /**
   * Gera uma string aleatória com caracteres alfanuméricos minúsculos
   * @param {number} length - Comprimento da string
   * @returns {string} String aleatória gerada
   */
  static generateRandomString(length) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      result += alphabet[randomIndex];
    }

    return result;
  }

  /**
   * Gera um slug único verificando disponibilidade no banco
   * @param {string} prefix - Prefixo do slug
   * @param {number} length - Comprimento da parte aleatória
   * @returns {Promise<string>} Slug único gerado
   */
  static async generateUniqueSlug(prefix = SLUG_PREFIX, length = SLUG_LENGTH) {
    // Tenta gerar slug único em múltiplas tentativas
    for (let attempt = 0; attempt < SLUG_GENERATION_ATTEMPTS; attempt++) {
      const randomPart = this.generateRandomString(length);
      const candidate = `${prefix}-${randomPart}`;

      const exists = await prisma.admin.findUnique({
        where: { slug: candidate },
      });

      if (!exists) return candidate;
    }

    // Fallback usando timestamp (muito improvável de colidir)
    const timestamp = Date.now().toString(36);
    return `${prefix}-${timestamp}`;
  }

  /**
   * Normaliza e valida um slug customizado
   * @param {string} slug - Slug a ser normalizado
   * @returns {string} Slug normalizado (minúsculas e trimmed)
   */
  static normalizeSlug(slug) {
    if (!slug || typeof slug !== "string") return "";
    return slug.trim().toLowerCase();
  }

  /**
   * Verifica se um slug está disponível para uso
   * @param {string} slug - Slug a verificar
   * @param {number} excludeAdminId - ID do admin a excluir da verificação
   * @returns {Promise<boolean>} true se disponível, false caso contrário
   */
  static async isSlugAvailable(slug, excludeAdminId = null) {
    const admin = await prisma.admin.findUnique({ where: { slug } });

    if (!admin) return true;
    if (excludeAdminId && admin.id === excludeAdminId) return true;

    return false;
  }
}

module.exports = SlugService;
