// Serviço de API - Centraliza chamadas HTTP
import { API_ENDPOINTS } from "../config/constants";

class ApiService {
  /**
   * Busca admin por email
   * @param {string} email
   * @returns {Promise<Object>}
   */
  static async getAdminByEmail(email) {
    const response = await fetch(`${API_ENDPOINTS.ADMIN}?email=${email}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Cria novo admin
   * @param {Object} adminData
   * @returns {Promise<Object>}
   */
  static async createAdmin(adminData) {
    const response = await fetch(API_ENDPOINTS.ADMIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Atualiza admin existente
   * @param {Object} adminData
   * @returns {Promise<Object>}
   */
  static async updateAdmin(adminData) {
    const response = await fetch(API_ENDPOINTS.ADMIN, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Verifica disponibilidade de slug
   * @param {string} slug
   * @param {number} currentAdminId
   * @returns {Promise<{available: boolean}>}
   */
  static async checkSlugAvailability(slug, currentAdminId = null) {
    const url = currentAdminId
      ? `${API_ENDPOINTS.CHECK_SLUG(slug)}?currentAdminId=${currentAdminId}`
      : API_ENDPOINTS.CHECK_SLUG(slug);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Busca admin por slug (perfil público)
   * @param {string} slug
   * @returns {Promise<Object>}
   */
  static async getAdminBySlug(slug) {
    // Backend não tem endpoint direto, usa query genérica
    const response = await fetch(`${API_ENDPOINTS.ADMIN}?slug=${slug}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Registra clique em um link
   * @param {number} linkId
   * @param {string} referrer
   * @returns {Promise<Object>}
   */
  static async trackClick(linkId, referrer = "") {
    const response = await fetch(API_ENDPOINTS.ANALYTICS_CLICK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, referrer }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  /**
   * Busca estatísticas de um admin
   * @param {number} adminId
   * @returns {Promise<Object>}
   */
  static async getAdminStats(adminId) {
    const response = await fetch(API_ENDPOINTS.ANALYTICS_STATS(adminId));
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}

export default ApiService;
