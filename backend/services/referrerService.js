// Serviço para categorização de referrers
const { REFERRER_CATEGORIES } = require("../config/constants");

class ReferrerService {
  /**
   * Categoriza um referrer em uma plataforma conhecida
   * @param {string} referrer - URL do referrer
   * @returns {string} Nome da plataforma ou "Direto"/"Outros"
   */
  static categorizeReferrer(referrer) {
    if (!referrer) return "Direto";

    const normalizedRef = referrer.toLowerCase();

    // Verifica cada categoria de referrer
    for (const [platform, patterns] of Object.entries(REFERRER_CATEGORIES)) {
      if (patterns.some((pattern) => normalizedRef.includes(pattern))) {
        return this.getPlatformDisplayName(platform);
      }
    }

    return "Outros";
  }

  /**
   * Retorna o nome de exibição formatado da plataforma
   * @param {string} platform - Chave da plataforma
   * @returns {string} Nome formatado
   */
  static getPlatformDisplayName(platform) {
    const displayNames = {
      instagram: "Instagram",
      facebook: "Facebook",
      twitter: "Twitter/X",
      tiktok: "TikTok",
      youtube: "YouTube",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      reddit: "Reddit",
      google: "Google",
      bing: "Bing",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
    };

    return displayNames[platform] || platform;
  }
}

module.exports = ReferrerService;
