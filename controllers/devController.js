const supabase = require("../config/supabase");

// 1. GET ALL TEAM (Buat nampilin di halaman About Us)
const getDevs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("developers")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. CREATE TEAM MEMBER (Upload Foto Wajib)
const createDev = async (req, res) => {
  try {
    const { nama, jobdesk, ig_url, github_url, linkedin_url } = req.body;
    let finalFotoUrl = "";

    // --- LOGIC UPLOAD FOTO ---
    if (req.files && req.files.foto) {
      const file = req.files.foto;
      const fileExt = file.name.split(".").pop();
      const fileName = `dev-${Date.now()}.${fileExt}`;

      // Upload ke bucket 'developers' (PASTIKAN BUCKET INI ADA DI SUPABASE STORAGE)
      const { error: uploadError } = await supabase.storage
        .from("developers")
        .upload(fileName, file.data, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      // Ambil Public URL
      const { data: urlData } = supabase.storage
        .from("developers")
        .getPublicUrl(fileName);

      finalFotoUrl = urlData.publicUrl;
    } else {
      // Default avatar kalau gak upload foto (opsional)
      finalFotoUrl =
        "https://ui-avatars.com/api/?background=random&color=fff&name=" + nama;
    }

    // --- INSERT KE DATABASE ---
    const { data, error } = await supabase.from("developers").insert([
      {
        nama,
        jobdesk,
        foto: finalFotoUrl,
        ig_url: ig_url || null, // Handle string kosong biar jadi NULL
        github_url: github_url || null,
        linkedin_url: linkedin_url || null,
      },
    ]);

    if (error) throw error;
    res.status(201).json({ message: "Team Member Added", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. UPDATE TEAM MEMBER (Bisa Ganti Foto)
const updateDev = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jobdesk, ig_url, github_url, linkedin_url, foto } = req.body; // 'foto' disini url lama

    let finalFotoUrl = foto; // Default pake foto lama

    // Kalo user upload foto baru, kita timpa
    if (req.files && req.files.foto) {
      const file = req.files.foto;
      const fileExt = file.name.split(".").pop();
      const fileName = `dev-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("developers")
        .upload(fileName, file.data, { contentType: file.mimetype });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("developers")
        .getPublicUrl(fileName);

      finalFotoUrl = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("developers")
      .update({
        nama,
        jobdesk,
        foto: finalFotoUrl,
        ig_url: ig_url || null,
        github_url: github_url || null,
        linkedin_url: linkedin_url || null,
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    res.json({ message: "Team Member Updated", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. DELETE TEAM MEMBER
const deleteDev = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("developers").delete().eq("id", id);

    if (error) throw error;
    res.json({ message: "Team Member Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getDevs, createDev, updateDev, deleteDev };
