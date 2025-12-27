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
      // Yang featured di paling atas, lalu urut id
      .order("is_featured", { ascending: false })
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

// 5. CREATE PRODUCT (Support Dual Image Upload)
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
      feature_image_url, // URL manual banner (opsional)
    } = req.body;

    let finalImageUrl = image_url || "";
    let finalFeatureImageUrl = feature_image_url || "";

    // --- A. LOGIC UPLOAD IMAGE 1 (Product Icon) ---
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileExt = file.name.split(".").pop();
      const fileName = `icon-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file.data, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      finalImageUrl = urlData.publicUrl;
    }

    // --- B. LOGIC UPLOAD IMAGE 2 (Feature Banner) ---
    if (req.files && req.files.feature_image) {
      const file = req.files.feature_image;
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file.data, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      finalFeatureImageUrl = urlData.publicUrl;
    }

    // --- INSERT KE DATABASE ---
    const { data, error } = await supabase.from("products").insert([
      {
        name,
        price,
        description,
        tag,
        image_url: finalImageUrl,
        feature_image_url: finalFeatureImageUrl, // Simpan URL banner
        rating: rating || 4.5,
        top_note,
        middle_note,
        base_note,
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

// 6. UPDATE PRODUCT (Support Dual Image Update)
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
      image_url, // URL icon lama dari frontend
      feature_image_url, // URL banner lama dari frontend
    } = req.body;

    let finalImageUrl = image_url;
    let finalFeatureImageUrl = feature_image_url;

    // --- A. LOGIC GANTI IMAGE 1 (Icon) ---
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileExt = file.name.split(".").pop();
      const fileName = `icon-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file.data, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      finalImageUrl = urlData.publicUrl;
    }

    // --- B. LOGIC GANTI IMAGE 2 (Banner) ---
    if (req.files && req.files.feature_image) {
      const file = req.files.feature_image;
      const fileExt = file.name.split(".").pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file.data, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      finalFeatureImageUrl = urlData.publicUrl;
    }

    // --- UPDATE DATABASE ---
    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        price,
        description,
        tag,
        image_url: finalImageUrl, // Update Icon
        feature_image_url: finalFeatureImageUrl, // Update Banner
        rating,
        top_note,
        middle_note,
        base_note,
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
