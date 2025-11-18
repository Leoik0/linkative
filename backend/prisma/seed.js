/*
  Seed de dados de analytics para o Linktree.
  Como usar:
  - Defina SEED_ADMIN_EMAIL com o e-mail do admin existente (o mesmo usado no frontend/Clerk)
    Ex: SEED_ADMIN_EMAIL="seu@email.com" npm run prisma:seed
  - Opcional: SEED_ADMIN_SLUG para criar o admin caso ele não exista.
*/

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const REFERRERS = [
  "Instagram",
  "WhatsApp",
  "Google",
  "Facebook",
  "Twitter/X",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Telegram",
  "Direto",
  "Outros",
];

const CITIES = [
  { city: "São Paulo", country: "BR" },
  { city: "Rio de Janeiro", country: "BR" },
  { city: "Belo Horizonte", country: "BR" },
  { city: "Curitiba", country: "BR" },
  { city: "Porto Alegre", country: "BR" },
  { city: "Lisboa", country: "PT" },
  { city: "Porto", country: "PT" },
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

async function ensureAdminWithLinks(email, slug) {
  let admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    if (!slug) {
      console.log("\nNenhum admin encontrado e SEED_ADMIN_SLUG não informado.");
      console.log(
        "Defina SEED_ADMIN_SLUG para criar um admin de teste ou crie um admin manualmente."
      );
      return null;
    }
    console.log(`\nCriando admin de teste para ${email} com slug ${slug}...`);
    admin = await prisma.admin.create({
      data: {
        email,
        nome: "Admin Demo",
        slug,
        bio: "Perfil de demonstração para testes de analytics.",
        imageUrl: null,
        bgType: "color",
        bgValue: "#f5f5f5",
        nomeColor: "#1e293b",
        bioColor: "#64748b",
        linkColor: "#2563eb",
        links: {
          create: [
            { title: "Site", url: "https://exemplo.com", color: "#2563eb" },
            {
              title: "Instagram",
              url: "https://instagram.com/exemplo",
              color: "#e11d48",
            },
            {
              title: "WhatsApp",
              url: "https://wa.me/5599999999999",
              color: "#22c55e",
            },
          ],
        },
      },
      include: { links: true },
    });
  }

  // Garante pelo menos 2-3 links para gerar cliques
  let links = await prisma.link.findMany({ where: { adminId: admin.id } });
  if (links.length < 1) {
    await prisma.link.createMany({
      data: [
        {
          title: "Site",
          url: "https://exemplo.com",
          color: "#2563eb",
          adminId: admin.id,
        },
        {
          title: "Instagram",
          url: "https://instagram.com/exemplo",
          color: "#e11d48",
          adminId: admin.id,
        },
        {
          title: "WhatsApp",
          url: "https://wa.me/5599999999999",
          color: "#22c55e",
          adminId: admin.id,
        },
      ],
    });
    links = await prisma.link.findMany({ where: { adminId: admin.id } });
  }

  return { admin, links };
}

function randomTimestamp(daysBack = 14) {
  const now = new Date();
  const past = new Date(
    now.getTime() - randInt(0, daysBack) * 24 * 60 * 60 * 1000
  );
  past.setHours(
    randInt(0, 23),
    randInt(0, 59),
    randInt(0, 59),
    randInt(0, 999)
  );
  return past;
}

async function generateClicks(links, total = 250) {
  const data = [];
  for (let i = 0; i < total; i++) {
    const link = pick(links);
    const { city, country } = pick(CITIES);
    const referrer = pick(REFERRERS);
    const timestamp = randomTimestamp(21);
    data.push({ linkId: link.id, city, country, referrer, timestamp });
  }
  console.log(`\nCriando ${data.length} cliques de teste...`);
  // Usa createMany para performance
  await prisma.click.createMany({ data });
}

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const slug = process.env.SEED_ADMIN_SLUG;

  if (!email) {
    console.log("SEED_ADMIN_EMAIL não informado. Pulei o seed.");
    console.log(
      'Defina SEED_ADMIN_EMAIL="seu@email" e rode: npm run prisma:seed'
    );
    return;
  }

  const ctx = await ensureAdminWithLinks(email, slug);
  if (!ctx) return; // não criou por falta de slug

  await generateClicks(ctx.links, 300);
  console.log("\nSeed concluído com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
