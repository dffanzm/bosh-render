const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

dotenv.config();
const app = express();

// 1. CORS HARUS PALING ATAS
// Biar aman, allow semua dulu buat testing
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 2. PERBESAR LIMIT JSON & URL ENCODED (Penting buat payload besar)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 3. SETTING FILE UPLOAD (Penting buat gambar)
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // Limit 50MB
    abortOnLimit: true, // Kalau kegedean langsung tolak
  })
);

// Routes
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.send("Bosh Parfume Server is Running!");
});

// Setup Port & Vercel
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
