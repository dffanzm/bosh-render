const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByTag,
  createProduct,
  deleteProduct,
  updateProduct, // <--- IMPORT INI
} = require("../controllers/productController");

// 1. Tag
router.get("/tag/:tag", getProductsByTag);

// 2. Detail & Update & Delete (ID)
router.get("/:id", getProductById);
router.put("/:id", updateProduct); // <--- JALUR UPDATE
router.delete("/:id", deleteProduct);

// 3. Root (Get All & Create)
router.get("/", getProducts);
router.post("/", createProduct);

module.exports = router;