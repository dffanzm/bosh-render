const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByTag,
  createProduct,
  deleteProduct,
} = require("../controllers/productController");

// 1. Route Spesifik (Tag) - WAJIB DI ATAS ID
router.get("/tag/:tag", getProductsByTag);

// 2. Route Wildcard (ID)
router.get("/:id", getProductById);

// 3. Route Root (All) & Create
router.get("/", getProducts);
router.post("/", createProduct);

// 4. Route Delete
router.delete("/:id", deleteProduct);

module.exports = router;
