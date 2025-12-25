const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Import Routes
const productRoutes = require("./routes/productRoutes");
const bannerRoutes = require("./routes/bannerRoutes"); // Pastikan buat file ini jg

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/banners", bannerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//vercel setup
module.exports = app;
if (require.main === module) {
  app.listen(3000, () => console.log("Server ready on port 3000."));
}
