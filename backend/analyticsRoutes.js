// Rotas para Analytics
const express = require("express");
const router = express.Router();
const analyticsController = require("./controllers/analyticsController");

router.post("/analytics/click", analyticsController.trackClick);
router.get("/analytics/stats/:adminId", analyticsController.getAdminStats);

module.exports = router;
