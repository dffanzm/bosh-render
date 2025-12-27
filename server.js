const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload"); // <--- 1. Import ini

// Import Routes
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// <--- 2. Pasang ini supaya bisa baca req.files di Controller
app.use(fileUpload());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);

// Root Endpoint (Optional: buat ngecek server nyala)
app.get("/", (req, res) => {
  res.send("Bosh Parfume Server is Running!");
});

// Setup Port & Vercel
// Logic ini biar aman: Kalau di Vercel dia export 'app', kalau di local dia 'listen'
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
