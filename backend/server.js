// Servidor Express - API do Admin
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const adminRoutes = require("./adminRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const upload = require("./config/multer");
const { HTTP_STATUS, ERRORS } = require("./config/constants");

// Inicializa app
const app = express();

// Garante que a pasta uploads existe
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api", adminRoutes);
app.use("/api", analyticsRoutes);

// Rota para upload de imagem de perfil
app.post("/api/admin/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERRORS.NO_FILE_UPLOADED,
    });
  }

  const imageUrl = `/api/admin/uploads/${req.file.filename}`;
  res.status(HTTP_STATUS.OK).json({ imageUrl });
});

// Servir arquivos estáticos da pasta uploads
app.use("/api/admin/uploads", express.static(uploadsDir));

// Health check para Vercel
app.get("/api/health", (req, res) => {
  res
    .status(HTTP_STATUS.OK)
    .json({ status: "ok", timestamp: new Date().toISOString() });
});

// Inicia servidor (apenas local, Vercel usa serverless)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📁 Uploads salvos em: ${uploadsDir}`);
  });
}

module.exports = app;
