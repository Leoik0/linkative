// Utilitários para extração de informações da requisição
class RequestUtils {
  /**
   * Extrai o endereço IP real do cliente
   * @param {Object} req - Objeto de requisição Express
   * @returns {string|null} Endereço IP
   */
  static getClientIP(req) {
    return (
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      null
    );
  }

  /**
   * Extrai o User-Agent da requisição
   * @param {Object} req - Objeto de requisição Express
   * @returns {string|null} User-Agent
   */
  static getUserAgent(req) {
    return req.headers["user-agent"] || null;
  }

  /**
   * Constrói objeto where para queries Prisma
   * @param {Object} filters - Filtros disponíveis
   * @returns {Object} Objeto where do Prisma
   */
  static buildWhereClause(filters) {
    const where = {};

    if (filters.id) {
      where.id = Number(filters.id);
    }

    if (filters.email) {
      where.email = filters.email;
    }

    return where;
  }
}

module.exports = RequestUtils;
