const supabase = require("../config/supabase");

// --- TAMBAHAN BARU: Get Featured Products (Buat Homepage) ---
const getFeaturedProducts = async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true) // Ambil yang dicentang doang
    .order("id", { ascending: false }); // Yang baru jadi featured paling atas

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// 1. Get ALL Products (Buat Admin Panel - Tetep tampilin semua)
const getProducts = async (req, res) => {
  // Kita order biar yang featured muncul paling atas di admin (opsional)
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// 2. Get Single Product by ID (Gak berubah)
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

// 3. Get Products by Tag (Gak berubah)
const getProductsByTag = async (req, res) => {
  const { tag } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("tag", tag);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// 4. Create Product (UPDATE: Nambah is_featured)
const createProduct = async (req, res) => {
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
    is_featured, // <--- Tangkap dari body
  } = req.body;

  const { data, error } = await supabase.from("products").insert([
    {
      name,
      price,
      description,
      tag,
      image_url,
      rating: rating || 4.5,
      top_note,
      middle_note,
      base_note,
      is_featured: is_featured || false, // <--- Masukin DB
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Product Created", data });
};

// 5. Update Product (UPDATE: Nambah is_featured)
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
    is_featured, // <--- Tangkap dari body (buat Toggle Switch)
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
      top_note,
      middle_note,
      base_note,
      is_featured, // <--- Update DB
    })
    .eq("id", id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product Updated", data });
};

// 6. Delete Product (Gak berubah)
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Product Deleted" });
};

module.exports = {
  getProducts,
  getFeaturedProducts, // <--- Export fungsi baru
  getProductById,
  getProductsByTag,
  createProduct,
  deleteProduct,
  updateProduct,
};
