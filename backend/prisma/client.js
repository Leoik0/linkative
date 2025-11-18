// Prisma Client singleton para evitar múltiplas conexões em ambientes serverless
const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
  prisma = global.prisma || new PrismaClient();
  global.prisma = prisma;
}

module.exports = prisma;
const { PrismaClient } = require("@prisma/client");

// Reuso de instância do Prisma em ambiente serverless
let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
