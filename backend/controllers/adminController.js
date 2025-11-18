// Controller para Admin - Refatorado com Clean Code e SOLID
const prisma = require("../prisma/client");
const SlugService = require("../services/slugService");
const RequestUtils = require("../utils/requestUtils");
const {
  HTTP_STATUS,
  ERRORS,
  DEFAULT_LINK_COLOR,
} = require("../config/constants");

class AdminController {
  /**
   * Busca perfil de um admin por ID ou email
   * GET /api/admin?id=123 ou GET /api/admin?email=user@example.com
   */
  static async getAdmin(req, res) {
    try {
      const { id, email } = req.query;
      const where = RequestUtils.buildWhereClause({ id, email });

      const admin = await prisma.admin.findFirst({
        where,
        include: { links: true },
      });

      if (!admin) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERRORS.ADMIN_NOT_FOUND,
        });
      }

      res.status(HTTP_STATUS.OK).json(admin);
    } catch (error) {
      console.error("Erro ao buscar admin:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  /**
   * Cria um novo admin
   * POST /api/admin
   */
  static async createAdmin(req, res) {
    try {
      const adminData = req.body;

      // Valida se email já existe
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: adminData.email },
      });

      if (existingAdmin) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ERRORS.EMAIL_ALREADY_EXISTS,
        });
      }

      // Gera ou normaliza o slug
      const slug = await this._resolveSlug(adminData.slug);

      // Cria admin com dados fornecidos
      const admin = await prisma.admin.create({
        data: {
          email: adminData.email,
          nome: adminData.nome,
          slug,
          bio: adminData.bio,
          imageUrl: adminData.imageUrl,
          bgType: adminData.bgType,
          bgValue: adminData.bgValue,
          nomeColor: adminData.nomeColor,
          bioColor: adminData.bioColor,
          linkColor: adminData.linkColor,
          isOwner: true,
          links: {
            create: this._prepareLinks(adminData.links),
          },
        },
        include: { links: true },
      });

      res.status(HTTP_STATUS.CREATED).json(admin);
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  /**
   * Verifica disponibilidade de um slug
   * GET /api/admin/check-slug/:slug?currentAdminId=123
   */
  static async checkSlug(req, res) {
    try {
      const { slug } = req.params;
      const { currentAdminId } = req.query;

      if (!slug) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ERRORS.SLUG_REQUIRED,
        });
      }

      const available = await SlugService.isSlugAvailable(
        slug,
        currentAdminId ? Number(currentAdminId) : null
      );

      res.status(HTTP_STATUS.OK).json({ available });
    } catch (error) {
      console.error("Erro ao verificar slug:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  /**
   * Atualiza ou cria admin (upsert)
   * PUT /api/admin
   */
  static async updateAdmin(req, res) {
    try {
      const { id, email, slug, links, ...updateFields } = req.body;
      const where = RequestUtils.buildWhereClause({ id, email });

      let admin = await prisma.admin.findFirst({ where });

      // Se não existe, cria novo
      if (!admin) {
        return await this._createAdminFromUpdate(req, res);
      }

      // Valida slug se foi fornecido
      if (slug) {
        const isAvailable = await SlugService.isSlugAvailable(slug, admin.id);
        if (!isAvailable) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({
            error: ERRORS.SLUG_IN_USE,
          });
        }
        updateFields.slug = slug;
      }

      // Atualiza campos do admin
      await prisma.admin.update({
        where: { id: admin.id },
        data: updateFields,
      });

      // Atualiza links se fornecidos
      if (Array.isArray(links)) {
        await this._updateAdminLinks(admin.id, links);
      }

      // Busca admin atualizado
      const updatedAdmin = await prisma.admin.findUnique({
        where: { id: admin.id },
        include: { links: true },
      });

      res.status(HTTP_STATUS.OK).json(updatedAdmin);
    } catch (error) {
      console.error("Erro ao atualizar admin:", error);
      res.status(HTTP_STATUS.INTERNAL_ERROR).json({ error: error.message });
    }
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Resolve slug: usa fornecido ou gera novo único
   */
  static async _resolveSlug(providedSlug) {
    if (providedSlug && String(providedSlug).trim().length > 0) {
      return SlugService.normalizeSlug(providedSlug);
    }
    return await SlugService.generateUniqueSlug();
  }

  /**
   * Prepara array de links para criação no Prisma
   */
  static _prepareLinks(links) {
    if (!Array.isArray(links)) return [];

    return links
      .filter((link) => link.title && link.url)
      .map((link) => ({
        title: link.title,
        url: link.url,
        icon: link.icon || null,
        color: link.color || DEFAULT_LINK_COLOR,
      }));
  }

  /**
   * Atualiza links de um admin (deleta todos e recria)
   */
  static async _updateAdminLinks(adminId, links) {
    await prisma.link.deleteMany({ where: { adminId } });

    const preparedLinks = this._prepareLinks(links);

    for (const link of preparedLinks) {
      await prisma.link.create({
        data: { ...link, adminId },
      });
    }
  }

  /**
   * Cria novo admin a partir de requisição de update
   */
  static async _createAdminFromUpdate(req, res) {
    const { email, slug, links, ...fields } = req.body;

    if (!email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: ERRORS.EMAIL_REQUIRED,
      });
    }

    const finalSlug = await this._resolveSlug(slug);

    const admin = await prisma.admin.create({
      data: {
        email,
        slug: finalSlug,
        ...fields,
        links: {
          create: this._prepareLinks(links),
        },
      },
      include: { links: true },
    });

    return res.status(HTTP_STATUS.CREATED).json(admin);
  }
}

// Exporta métodos como funções para usar nas rotas
module.exports = {
  getAdmin: AdminController.getAdmin.bind(AdminController),
  createAdmin: AdminController.createAdmin.bind(AdminController),
  checkSlug: AdminController.checkSlug.bind(AdminController),
  updateAdmin: AdminController.updateAdmin.bind(AdminController),
};
