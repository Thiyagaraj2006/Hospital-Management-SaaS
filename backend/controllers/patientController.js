const supabase = require("../config/supabase");

/**
 * GET /api/patients/me
 */
async function getMyProfile(req, res, next) {
  try {
    const { data, error } = await supabase
      .from("patients")
      .select("*, users!patients_user_id_fkey(name, email, created_at)")
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: "Patient profile not found" });

    res.json({ success: true, profile: data });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/patients/me
 * body: { name?, phone?, age?, gender?, blood_group?, address? }
 */
async function updateMyProfile(req, res, next) {
  try {
    const { name, phone, age, gender, blood_group, address } = req.body;

    if (name) {
      await supabase.from("users").update({ name }).eq("id", req.user.id);
    }

    const { data, error } = await supabase
      .from("patients")
      .update({
        ...(phone !== undefined && { phone }),
        ...(age !== undefined && { age }),
        ...(gender !== undefined && { gender }),
        ...(blood_group !== undefined && { blood_group }),
        ...(address !== undefined && { address }),
      })
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: "Profile updated", profile: data });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyProfile, updateMyProfile };
