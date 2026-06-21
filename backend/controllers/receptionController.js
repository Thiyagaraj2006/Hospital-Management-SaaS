const bcrypt = require("bcryptjs");
const supabase = require("../config/supabase");

/**
 * POST /api/reception/walkin
 * Registers a walk-in patient (creating a user+patient if new, reusing if
 * the email already exists) and books a same-day token-based appointment.
 * body: { name, email, phone, age, gender, doctor_id, appointment_time }
 */
async function registerWalkIn(req, res, next) {
  try {
    const { name, email, phone, age, gender, doctor_id, appointment_time } = req.body;

    if (!name || !email || !doctor_id) {
      return res.status(400).json({ success: false, message: "name, email and doctor_id are required" });
    }

    let { data: user } = await supabase.from("users").select("id").eq("email", email).maybeSingle();

    let patientId;

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      const { data: newUser, error: userErr } = await supabase
        .from("users")
        .insert({ name, email, password: hashedPassword, role: "patient" })
        .select()
        .single();
      if (userErr) throw userErr;
      user = newUser;

      const { data: newPatient, error: patientErr } = await supabase
        .from("patients")
        .insert({ user_id: user.id, phone, age, gender })
        .select()
        .single();
      if (patientErr) throw patientErr;
      patientId = newPatient.id;
    } else {
      const { data: existingPatient } = await supabase
        .from("patients")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      patientId = existingPatient?.id;

      if (!patientId) {
        const { data: newPatient, error: patientErr } = await supabase
          .from("patients")
          .insert({ user_id: user.id, phone, age, gender })
          .select()
          .single();
        if (patientErr) throw patientErr;
        patientId = newPatient.id;
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    const { count: tokensToday } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", doctor_id)
      .eq("appointment_date", today)
      .eq("source", "walk_in");

    const tokenNumber = (tokensToday || 0) + 1;

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: patientId,
        doctor_id,
        appointment_date: today,
        appointment_time: appointment_time || new Date().toTimeString().slice(0, 5),
        status: "confirmed",
        source: "walk_in",
        token_number: tokenNumber,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Walk-in registered",
      appointment,
      tokenNumber,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reception/tokens/today?doctor_id=...
 * Returns today's walk-in queue, ordered by token number.
 */
async function getTodayTokens(req, res, next) {
  try {
    const { doctor_id } = req.query;
    const today = new Date().toISOString().slice(0, 10);

    let query = supabase
      .from("appointments")
      .select("*, patients(users!patients_user_id_fkey(name)), doctors(users!doctors_user_id_fkey(name))")
      .eq("appointment_date", today)
      .eq("source", "walk_in")
      .order("token_number", { ascending: true });

    if (doctor_id) query = query.eq("doctor_id", doctor_id);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, tokens: data || [] });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerWalkIn, getTodayTokens };
