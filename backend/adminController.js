// Controller para Admin usando Prisma
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Gera um slug aleatório e garante unicidade
async function generateUniqueSlug(prefix = "u", length = 6) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  function randomPart() {
    let s = "";
    for (let i = 0; i < length; i++) {
      s += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return s;
  }
  // Tenta algumas vezes evitar colisão
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `${prefix}-${randomPart()}`;
    const exists = await prisma.admin.findUnique({
      where: { slug: candidate },
    });
    if (!exists) return candidate;
  }
  // Fallback muito improvável de colidir
  const fallback = `${prefix}-${Date.now().toString(36)}`;
  return fallback;
}

// Buscar perfil de um admin específico
exports.getAdmin = async (req, res) => {
  try {
    const { id, email } = req.query;
    let where = {};
    if (id) where.id = Number(id);
    if (email) where.email = email;
    const admin = await prisma.admin.findFirst({
      where,
      include: { links: true },
    });
    if (!admin) return res.status(404).json({ error: "Admin não encontrado" });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Criar novo admin
exports.createAdmin = async (req, res) => {
  try {
    const {
      email,
      nome,
      slug,
      bio,
      imageUrl,
      bgType,
      bgValue,
      nomeColor,
      bioColor,
      linkColor,
      links,
    } = req.body;
    const exists = await prisma.admin.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ error: "Email já cadastrado" });
    // Define slug padrão aleatório se não enviado
    const finalSlug =
      slug && String(slug).trim().length > 0
        ? slug.trim().toLowerCase()
        : await generateUniqueSlug();
    const admin = await prisma.admin.create({
      data: {
        email,
        nome,
        slug: finalSlug,
        bio,
        imageUrl,
        bgType,
        bgValue,
        nomeColor,
        bioColor,
        linkColor,
        isOwner: true,
        links: {
          create: Array.isArray(links) ? links : [],
        },
      },
      include: { links: true },
    });
    res.status(201).json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verificar disponibilidade de slug
exports.checkSlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { currentAdminId } = req.query;

    if (!slug) {
      return res.status(400).json({ error: "Slug é obrigatório" });
    }

    // Busca admin com esse slug
    const admin = await prisma.admin.findUnique({ where: { slug } });

    // Se não encontrou ninguém com esse slug, está disponível
    if (!admin) {
      return res.json({ available: true });
    }

    // Se encontrou e é o próprio admin (atualizando seu próprio slug), está disponível
    if (currentAdminId && admin.id === Number(currentAdminId)) {
      return res.json({ available: true });
    }

    // Slug já está em uso por outro admin
    return res.json({ available: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Atualizar perfil de um admin específico (cria se não existir)
exports.updateAdmin = async (req, res) => {
  try {
    const {
      id,
      email,
      nome,
      slug,
      bio,
      imageUrl,
      bgType,
      bgValue,
      nomeColor,
      bioColor,
      linkColor,
      links,
    } = req.body;
    let where = {};
    if (id) where.id = Number(id);
    if (email) where.email = email;
    let admin = await prisma.admin.findFirst({ where });

    // Validar slug se foi enviado
    if (slug && admin) {
      const slugExists = await prisma.admin.findUnique({ where: { slug } });
      if (slugExists && slugExists.id !== admin.id) {
        return res
          .status(400)
          .json({ error: "Slug já está em uso por outro admin" });
      }
    }
    // Se não existe, cria novo admin se email estiver presente
    if (!admin) {
      if (!email) {
        return res.status(400).json({
          error: "Campo 'email' é obrigatório para criar um novo admin.",
        });
      }
      const finalSlug =
        slug && String(slug).trim().length > 0
          ? slug.trim().toLowerCase()
          : await generateUniqueSlug();
      admin = await prisma.admin.create({
        data: {
          email,
          ...(nome && { nome }),
          slug: finalSlug,
          ...(bio && { bio }),
          ...(imageUrl && { imageUrl }),
          ...(bgType && { bgType }),
          ...(bgValue && { bgValue }),
          ...(nomeColor && { nomeColor }),
          ...(bioColor && { bioColor }),
          ...(linkColor && { linkColor }),
          ...(Array.isArray(links) && links.length > 0
            ? {
                links: {
                  create: links
                    .filter((l) => l.title && l.url)
                    .map((link) => ({
                      title: link.title,
                      url: link.url,
                      icon: link.icon || null,
                      color: link.color || "#2563eb",
                    })),
                },
              }
            : {}),
        },
        include: { links: true },
      });
      return res.status(201).json(admin);
    }
    // Monta objeto de atualização apenas com campos enviados
    const updateData = {};
    if (nome !== undefined) updateData.nome = nome;
    if (slug !== undefined) updateData.slug = slug;
    if (bio !== undefined) updateData.bio = bio;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (bgType !== undefined) updateData.bgType = bgType;
    if (bgValue !== undefined) updateData.bgValue = bgValue;
    if (nomeColor !== undefined) updateData.nomeColor = nomeColor;
    if (bioColor !== undefined) updateData.bioColor = bioColor;
    if (linkColor !== undefined) updateData.linkColor = linkColor;
    await prisma.admin.update({
      where: { id: admin.id },
      data: updateData,
    });
    // Atualiza links apenas se enviados
    if (Array.isArray(links)) {
      await prisma.link.deleteMany({ where: { adminId: admin.id } });
      for (const link of links) {
        if (!link.title || !link.url) continue;
        await prisma.link.create({
          data: {
            title: link.title,
            url: link.url,
            icon: link.icon || null,
            color: link.color || "#2563eb",
            adminId: admin.id,
          },
        });
      }
    }
    const updated = await prisma.admin.findUnique({
      where: { id: admin.id },
      include: { links: true },
    });
    res.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar admin:", err);
    res.status(500).json({ error: err.message, details: err });
  }
};
