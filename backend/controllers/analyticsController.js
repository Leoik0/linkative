// Controller para Analytics - Refatorado com Clean Code e SOLID
const prisma = require("../prisma/client");
const ReferrerService = require("../services/referrerService");
const GeolocationService = require("../services/geolocationService");
const RequestUtils = require("../utils/requestUtils");
const { HTTP_STATUS, ERRORS } = require("../config/constants");

class AnalyticsController {
  /**
   * Registra um clique em um link
   * POST /api/analytics/click
   */
  static async trackClick(req, res) {
    try {
      const { linkId, referrer } = req.body;

      if (!linkId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ERRORS.LINK_ID_REQUIRED,
        });
      }

      // Captura informações da requisição
      const ip = RequestUtils.getClientIP(req);
      const userAgent = RequestUtils.getUserAgent(req);

      // Categoriza referrer
      const categorizedReferrer = ReferrerService.categorizeReferrer(referrer);

      // Obtém geolocalização
      const { city, country } = await GeolocationService.getLocationFromIP(ip);

      // Salva clique no banco
      const click = await prisma.click.create({
        data: {
          linkId: Number(linkId),
          ip,
          userAgent,
          referrer: categorizedReferrer,
          city,
          country,
        },
      });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        clickId: click.id,
      });
    } catch (error) {
      console.error("Erro ao registrar clique:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  /**
   * Obtém estatísticas completas de um admin
   * GET /api/analytics/stats/:adminId
   */
  static async getAdminStats(req, res) {
    try {
      const { adminId } = req.params;

      if (!adminId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ERRORS.ADMIN_ID_REQUIRED,
        });
      }

      // Busca admin com links e cliques
      const admin = await prisma.admin.findUnique({
        where: { id: Number(adminId) },
        include: {
          links: {
            include: {
              clicks: {
                orderBy: { timestamp: "desc" },
              },
            },
          },
        },
      });

      if (!admin) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERRORS.ADMIN_NOT_FOUND,
        });
      }

      // Calcula estatísticas
      const stats = this._calculateStats(admin.links);

      res.status(HTTP_STATUS.OK).json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Calcula todas as estatísticas a partir dos links e cliques
   */
  static _calculateStats(links) {
    const stats = {
      totalClicks: 0,
      clicksByLink: [],
      clicksByHour: Array(24).fill(0),
      clicksByCity: {},
      clicksByCountry: {},
      clicksByReferrer: {},
      topLinks: [],
      peakHours: [],
      topCities: [],
      topReferrers: [],
    };

    // Processa cada link e seus cliques
    links.forEach((link) => {
      const linkClicks = link.clicks.length;
      stats.totalClicks += linkClicks;

      // Adiciona estatísticas do link
      stats.clicksByLink.push({
        linkId: link.id,
        title: link.title,
        url: link.url,
        clicks: linkClicks,
      });

      // Processa cada clique
      link.clicks.forEach((click) => {
        this._processClick(click, stats);
      });
    });

    // Calcula rankings e tops
    this._calculateRankings(stats);

    return stats;
  }

  /**
   * Processa um clique individual e atualiza contadores
   */
  static _processClick(click, stats) {
    // Contabiliza por hora
    const hour = new Date(click.timestamp).getHours();
    stats.clicksByHour[hour]++;

    // Contabiliza por cidade
    if (click.city) {
      stats.clicksByCity[click.city] =
        (stats.clicksByCity[click.city] || 0) + 1;
    }

    // Contabiliza por país
    if (click.country) {
      stats.clicksByCountry[click.country] =
        (stats.clicksByCountry[click.country] || 0) + 1;
    }

    // Contabiliza por referrer
    if (click.referrer) {
      stats.clicksByReferrer[click.referrer] =
        (stats.clicksByReferrer[click.referrer] || 0) + 1;
    }
  }

  /**
   * Calcula rankings (top links, cidades, horários, etc)
   */
  static _calculateRankings(stats) {
    // Top 5 links mais clicados
    stats.topLinks = stats.clicksByLink
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    // Top 3 horários de pico
    const hourStats = stats.clicksByHour.map((clicks, hour) => ({
      hour,
      clicks,
    }));

    stats.peakHours = hourStats
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 3)
      .map((h) => ({
        hour: `${h.hour}:00`,
        clicks: h.clicks,
      }));

    // Top 5 cidades
    stats.topCities = Object.entries(stats.clicksByCity)
      .map(([city, clicks]) => ({ city, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    // Top origens (todos os referrers ordenados)
    stats.topReferrers = Object.entries(stats.clicksByReferrer)
      .map(([referrer, clicks]) => ({ referrer, clicks }))
      .sort((a, b) => b.clicks - a.clicks);
  }
}

// Exporta métodos como funções para usar nas rotas
module.exports = {
  trackClick: AnalyticsController.trackClick.bind(AnalyticsController),
  getAdminStats: AnalyticsController.getAdminStats.bind(AnalyticsController),
};
