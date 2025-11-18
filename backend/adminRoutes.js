// Rotas para Admin
const express = require("express");
const router = express.Router();
const adminController = require("./controllers/adminController");

router.get("/admin", adminController.getAdmin);
router.get("/admin/check-slug/:slug", adminController.checkSlug);
router.post("/admin", adminController.createAdmin);
router.put("/admin", adminController.updateAdmin);

module.exports = router;
