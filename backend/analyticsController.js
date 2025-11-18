// Controller para Analytics usando Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Registrar clique em um link
exports.trackClick = async (req, res) => {
  try {
    const { linkId, referrer } = req.body;

    if (!linkId) {
      return res.status(400).json({ error: "linkId é obrigatório" });
    }

    // Capturar informações do request
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];

    // Categorizar referrer
    let categorizedReferrer = "Direto";
    if (referrer) {
      const ref = referrer.toLowerCase();
      if (ref.includes("instagram.com") || ref.includes("ig.me")) {
        categorizedReferrer = "Instagram";
      } else if (ref.includes("facebook.com") || ref.includes("fb.com")) {
        categorizedReferrer = "Facebook";
      } else if (
        ref.includes("twitter.com") ||
        ref.includes("t.co") ||
        ref.includes("x.com")
      ) {
        categorizedReferrer = "Twitter/X";
      } else if (ref.includes("tiktok.com")) {
        categorizedReferrer = "TikTok";
      } else if (ref.includes("youtube.com") || ref.includes("youtu.be")) {
        categorizedReferrer = "YouTube";
      } else if (ref.includes("linkedin.com")) {
        categorizedReferrer = "LinkedIn";
      } else if (ref.includes("pinterest.com")) {
        categorizedReferrer = "Pinterest";
      } else if (ref.includes("reddit.com")) {
        categorizedReferrer = "Reddit";
      } else if (ref.includes("google.com") || ref.includes("google.")) {
        categorizedReferrer = "Google";
      } else if (ref.includes("bing.com")) {
        categorizedReferrer = "Bing";
      } else if (ref.includes("whatsapp.com") || ref.includes("wa.me")) {
        categorizedReferrer = "WhatsApp";
      } else if (ref.includes("t.me") || ref.includes("telegram")) {
        categorizedReferrer = "Telegram";
      } else {
        categorizedReferrer = "Outros";
      }
    }

    // Tentar obter geolocalização do IP (usaremos um serviço gratuito)
    let city = null;
    let country = null;

    try {
      // Usar ipapi.co (gratuito, 1000 req/dia)
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        city = geoData.city || null;
        country = geoData.country_name || null;
      }
    } catch (geoError) {
      // Ignorar erro de geolocalização, continuar sem ela
      console.log("Erro ao obter geolocalização:", geoError.message);
    }

    // Salvar clique no banco
    const click = await prisma.click.create({
      data: {
        linkId: Number(linkId),
        ip: ip || null,
        userAgent: userAgent || null,
        referrer: categorizedReferrer,
        city,
        country,
      },
    });

    res.status(201).json({ success: true, clickId: click.id });
  } catch (err) {
    console.error("Erro ao registrar clique:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obter estatísticas de um admin
exports.getAdminStats = async (req, res) => {
  try {
    const { adminId } = req.params;

    if (!adminId) {
      return res.status(400).json({ error: "adminId é obrigatório" });
    }

    // Buscar todos os links do admin com seus cliques
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
      return res.status(404).json({ error: "Admin não encontrado" });
    }

    // Calcular estatísticas
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

    // Processar cliques
    admin.links.forEach((link) => {
      const linkClicks = link.clicks.length;
      stats.totalClicks += linkClicks;

      // Cliques por link
      stats.clicksByLink.push({
        linkId: link.id,
        title: link.title,
        url: link.url,
        clicks: linkClicks,
      });

      // Processar cada clique
      link.clicks.forEach((click) => {
        // Cliques por hora
        const hour = new Date(click.timestamp).getHours();
        stats.clicksByHour[hour]++;

        // Cliques por cidade
        if (click.city) {
          stats.clicksByCity[click.city] =
            (stats.clicksByCity[click.city] || 0) + 1;
        }

        // Cliques por país
        if (click.country) {
          stats.clicksByCountry[click.country] =
            (stats.clicksByCountry[click.country] || 0) + 1;
        }

        // Cliques por origem (referrer)
        if (click.referrer) {
          stats.clicksByReferrer[click.referrer] =
            (stats.clicksByReferrer[click.referrer] || 0) + 1;
        }
      });
    });

    // Top 5 links
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
      .map((h) => ({ hour: `${h.hour}:00`, clicks: h.clicks }));

    // Top 5 cidades
    stats.topCities = Object.entries(stats.clicksByCity)
      .map(([city, clicks]) => ({ city, clicks }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    // Top origens (referrers)
    stats.topReferrers = Object.entries(stats.clicksByReferrer)
      .map(([referrer, clicks]) => ({ referrer, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    res.json(stats);
  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err);
    res.status(500).json({ error: err.message });
  }
};
