// Vercel Serverless catch-all para todas as rotas /api/*
const express = require("express");
const cors = require("cors");

const adminRoutes = require("../backend/adminRoutes");
const analyticsRoutes = require("../backend/analyticsRoutes");
const { HTTP_STATUS } = require("../backend/config/constants");

const app = express();
app.use(cors());
app.use(express.json());

// Monte as rotas SEM prefixo, pois o prefixo /api é resolvido pelo caminho do arquivo
app.use("/admin", adminRoutes);
app.use("/analytics", analyticsRoutes);

app.get("/health", (req, res) => {
  res
    .status(HTTP_STATUS.OK)
    .json({ status: "ok", timestamp: new Date().toISOString() });
});

// Handler exportado para Vercel
module.exports = app;
