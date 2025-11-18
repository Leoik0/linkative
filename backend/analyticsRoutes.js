// Rotas para Analytics (sem prefixo duplicado)
const express = require("express");
const router = express.Router();
const analyticsController = require("./controllers/analyticsController");

// Estas rotas serão montadas em "/analytics" no handler serverless (/api)
router.post("/click", analyticsController.trackClick);
router.get("/stats/:adminId", analyticsController.getAdminStats);

module.exports = router;
