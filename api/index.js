// Servidor Express - API do Admin (Vercel Serverless)
const express = require("express");
const cors = require("cors");
const path = require("path");

const adminRoutes = require("../backend/adminRoutes");
const analyticsRoutes = require("../backend/analyticsRoutes");
const { HTTP_STATUS } = require("../backend/config/constants");

// Inicializa app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use("/api", adminRoutes);
app.use("/api", analyticsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: "ok", 
    timestamp: new Date().toISOString() 
  });
});

// Rota raiz da API
app.get("/api", (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    message: "Linkative API",
    version: "1.0.0"
  });
});

module.exports = app;
