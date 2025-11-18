// Serviço para geolocalização de IPs
class GeolocationService {
  /**
   * Obtém informações de geolocalização para um IP
   * @param {string} ip - Endereço IP
   * @returns {Promise<{city: string|null, country: string|null}>} Dados de localização
   */
  static async getLocationFromIP(ip) {
    if (!ip || ip === "::1" || ip.startsWith("127.")) {
      return { city: null, country: null };
    }

    try {
      // Usar ipapi.co (gratuito, 1000 req/dia)
      const response = await fetch(`https://ipapi.co/${ip}/json/`);

      if (!response.ok) {
        console.warn(`Geolocalização falhou para IP ${ip}`);
        return { city: null, country: null };
      }

      const data = await response.json();

      return {
        city: data.city || null,
        country: data.country_name || null,
      };
    } catch (error) {
      console.error("Erro ao obter geolocalização:", error.message);
      return { city: null, country: null };
    }
  }
}

module.exports = GeolocationService;
