// Rotas para Admin (sem prefixo duplicado)
const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");

// Estas rotas serão montadas em "/admin" no handler serverless (/api)
router.get("/", adminController.getAdmin);
router.get("/check-slug/:slug", adminController.checkSlug);
router.post("/", adminController.createAdmin);
router.put("/", adminController.updateAdmin);

module.exports = router;
