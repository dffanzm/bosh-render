const supabase = require("../config/supabase");

// Get All Products
const getProducts = async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Create Product
const createProduct = async (req, res) => {
  const { name, price, description, tag, image_url } = req.body;
  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, description, tag, image_url, rating: 4.5 }]); // Default rating

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Product Created", data });
};

// Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product Deleted" });
};

module.exports = { getProducts, createProduct, deleteProduct };
