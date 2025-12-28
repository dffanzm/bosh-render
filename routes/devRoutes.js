const express = require("express");
const router = express.Router();

const {
  getDevs,
  createDev,
  updateDev,
  deleteDev,
} = require("../controllers/devController");

router.get("/", getDevs); // Ambil semua data
router.post("/", createDev); // Tambah data + foto
router.put("/:id", updateDev); // Edit data + foto
router.delete("/:id", deleteDev); // Hapus data

module.exports = router;
