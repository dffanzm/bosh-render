const supabase = require("../config/supabase");
const getBanners = async (req, res) => {
  const { data, error } = await supabase.from("banners").select("*");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createBanner = async (req, res) => {
  const { image_url } = req.body;

  // INI JUGA HARUS 'banners'
  const { error } = await supabase.from("banners").insert([{ image_url }]);

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Banner Added" });
};

// Tambahin fungsi delete sekalian biar lengkap
const deleteBanner = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("banners").delete().eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Banner Deleted" });
};

module.exports = { getBanners, createBanner, deleteBanner };
