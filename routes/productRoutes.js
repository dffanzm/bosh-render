const express = require("express");
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts, // <--- Import ini
  getProductById,
  getProductsByTag,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

// 1. Featured (HARUS DI ATAS /:id)
router.get("/featured", getFeaturedProducts);

// 2. Tag
router.get("/tag/:tag", getProductsByTag);

// 3. Detail & Update & Delete (ID)
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// 4. Root (Get All & Create)
router.get("/", getProducts);
router.post("/", createProduct);

module.exports = router;
