const supabase = require("../config/supabase");

const getBanners = async (req, res) => {
  const { data, error } = await supabase.from("banners").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createBanner = async (req, res) => {
  const { image_url } = req.body;
  const { error } = await supabase.from("banners").insert([{ image_url }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: "Banner Added" });
};

module.exports = { getBanners, createBanner };
