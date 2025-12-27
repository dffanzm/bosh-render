const supabase = require("../config/supabase");

// 1. GET FEATURED PRODUCTS (Khusus Homepage)
const getFeaturedProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true) // Ambil yang aktif featured-nya
      .order("id", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. GET ALL PRODUCTS (Buat Admin & Katalog)
const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("is_featured", { ascending: false }) // Yang featured di paling atas
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. GET PRODUCT BY ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. GET PRODUCTS BY TAG
const getProductsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("tag", tag);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. CREATE PRODUCT (Dengan Upload Gambar ke Bucket 'products')
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      tag,
      rating,
      top_note,
      middle_note,
      base_note,
      is_featured,
      image_url, // URL manual (opsional)
    } = req.body;

    let finalImageUrl = image_url || ""; // Default kosong atau URL string

    // --- LOGIC UPLOAD GAMBAR ---
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`; // Nama unik: 17238123.jpg
      const filePath = `${fileName}`;

      // A. Upload ke bucket 'products'
      const { error: uploadError } = await supabase.storage
        .from("products") // <--- PASTIIN BUCKET 'products'
        .upload(filePath, file.data, {
          contentType: file.mimetype,
        });

      if (uploadError) throw uploadError;

      // B. Ambil Public URL
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      finalImageUrl = urlData.publicUrl;
    }
    // ---------------------------

    const { data, error } = await supabase.from("products").insert([
      {
        name,
        price,
        description,
        tag,
        image_url: finalImageUrl,
        rating: rating || 4.5,
        top_note,
        middle_note,
        base_note,
        // Konversi string "true"/"false" jadi boolean
        is_featured: is_featured === "true" || is_featured === true,
      },
    ]);

    if (error) throw error;
    res.status(201).json({ message: "Product Created", data });
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 6. UPDATE PRODUCT (Dengan Logic Ganti Gambar)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      tag,
      rating,
      top_note,
      middle_note,
      base_note,
      is_featured,
      image_url, // URL gambar lama (dikirim dari frontend)
    } = req.body;

    let finalImageUrl = image_url; // Default pake gambar lama

    // --- LOGIC GANTI GAMBAR ---
    // Cuma jalan kalau admin upload file baru
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // A. Upload ke bucket 'products'
      const { error: uploadError } = await supabase.storage
        .from("products") // <--- PASTIIN BUCKET 'products'
        .upload(filePath, file.data, {
          contentType: file.mimetype,
        });

      if (uploadError) throw uploadError;

      // B. Ambil Public URL Baru
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(filePath);

      finalImageUrl = urlData.publicUrl;
    }
    // --------------------------

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        price,
        description,
        tag,
        image_url: finalImageUrl, // Update URL (baru atau lama)
        rating,
        top_note,
        middle_note,
        base_note,
        // Konversi string "true"/"false" jadi boolean
        is_featured: is_featured === "true" || is_featured === true,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json({ message: "Product Updated", data });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 7. DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) throw error;
    res.json({ message: "Product Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByTag,
  createProduct,
  deleteProduct,
  updateProduct,
};
