const express = require("express");
const router = express.Router();

// ✅ BENAR: Import dari bannerController
const {
  getBanners,
  createBanner,
  deleteBanner,
} = require("../controllers/bannerController");

// ✅ Panggil fungsi banner
router.get("/", getBanners);
router.post("/", createBanner);
router.delete("/:id", deleteBanner);

module.exports = router;
