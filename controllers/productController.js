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

// 4. Create Product (UPDATED: Ada Notes)
const createProduct = async (req, res) => {
  // Ambil top_note, middle_note, base_note dari body request
  const {
    name,
    price,
    description,
    tag,
    image_url,
    rating,
    top_note,
    middle_note,
    base_note,
  } = req.body;

  const { data, error } = await supabase.from("products").insert([
    {
      name,
      price,
      description,
      tag,
      image_url,
      rating: rating || 4.5,
      top_note, // Masuk ke DB
      middle_note, // Masuk ke DB
      base_note, // Masuk ke DB
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Product Created", data });
};

// 5. Update Product (UPDATED: Ada Notes)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    description,
    tag,
    image_url,
    rating,
    top_note,
    middle_note,
    base_note,
  } = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      price,
      description,
      tag,
      image_url,
      rating,
      top_note, // Update DB
      middle_note, // Update DB
      base_note, // Update DB
    })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product Updated", data });
};

// 6. Delete Product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product Deleted" });
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByTag,
  createProduct,
  deleteProduct,
  updateProduct,
};
