const supabase = require("../config/supabase");

// 1. Get ALL Products
const getProducts = async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// 2. Get Single Product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// 3. Get Products by Tag
const getProductsByTag = async (req, res) => {
  const { tag } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("tag", tag);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// 4. Create Product
const createProduct = async (req, res) => {
  const { name, price, description, tag, image_url, rating } = req.body;
  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, description, tag, image_url, rating: rating || 4.5 }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Product Created", data });
};

// 5. Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product Deleted" });
};

// 6. Update Product (NEW)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, tag, image_url, rating } = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({ name, price, description, tag, image_url, rating })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product Updated", data });
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByTag,
  createProduct,
  deleteProduct,
  updateProduct, // <--- WAJIB ADA
};