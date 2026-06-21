const supabase = require("../config/supabase");
const { notify } = require("../services/notificationService");

async function getDoctorIdForUser(userId) {
  const { data } = await supabase.from("doctors").select("id").eq("user_id", userId).maybeSingle();
  return data?.id || null;
}

/**
 * GET /api/doctors/me/dashboard
 * Returns today's appointments + upcoming appointments for the logged-in doctor.
 */
async function getMyDashboard(req, res, next) {
  try {
    const doctorId = await getDoctorIdForUser(req.user.id);
    if (!doctorId) return res.status(404).json({ success: false, message: "Doctor profile not found" });

    const today = new Date().toISOString().slice(0, 10);

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*, patients(id, phone, age, gender, blood_group, users!patients_user_id_fkey(name, email))")
      .eq("doctor_id", doctorId)
      .order("appointment_date", { ascending: true });

    if (error) throw error;

    const todayAppointments = (appointments || []).filter((a) => a.appointment_date === today);
    const upcomingAppointments = (appointments || []).filter((a) => a.appointment_date > today);

    res.json({
      success: true,
      today: todayAppointments,
      upcoming: upcomingAppointments,
      total: appointments?.length || 0,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/doctors/me/patients
 * Distinct list of patients this doctor has seen.
 */
async function getMyPatients(req, res, next) {
  try {
    const doctorId = await getDoctorIdForUser(req.user.id);
    if (!doctorId) return res.status(404).json({ success: false, message: "Doctor profile not found" });

    const { data, error } = await supabase
      .from("appointments")
      .select("patients(id, phone, age, gender, blood_group, address, users!patients_user_id_fkey(name, email))")
      .eq("doctor_id", doctorId);

    if (error) throw error;

    const seen = new Map();
    (data || []).forEach((row) => {
      const p = row.patients;
      if (p && !seen.has(p.id)) seen.set(p.id, p);
    });

    res.json({ success: true, patients: Array.from(seen.values()) });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/doctors/appointments/:appointmentId/notes
 * body: { notes }
 */
async function addConsultationNote(req, res, next) {
  try {
    const { appointmentId } = req.params;
    const { notes } = req.body;

    if (!notes) return res.status(400).json({ success: false, message: "notes is required" });

    const { data, error } = await supabase
      .from("consultation_notes")
      .insert({ appointment_id: appointmentId, notes })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, message: "Consultation note added", note: data });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/doctors/appointments/:appointmentId/notes
 */
async function getConsultationNotes(req, res, next) {
  try {
    const { appointmentId } = req.params;

    const { data, error } = await supabase
      .from("consultation_notes")
      .select("*")
      .eq("appointment_id", appointmentId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, notes: data || [] });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/doctors/appointments/:appointmentId/complete
 * Marks an appointment as completed (shortcut used from the doctor dashboard).
 */
async function markAppointmentCompleted(req, res, next) {
  try {
    const { appointmentId } = req.params;

    const { data: appointment, error } = await supabase
      .from("appointments")
      .update({ status: "completed", consultation_status: "completed" })
      .eq("id", appointmentId)
      .select()
      .single();

    if (error) throw error;
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    const { data: patientContact } = await supabase
      .from("patients")
      .select("user_id, phone, users!patients_user_id_fkey(email)")
      .eq("id", appointment.patient_id)
      .maybeSingle();

    if (patientContact?.user_id) {
      await notify({
        userId: patientContact.user_id,
        message: `Your consultation on ${appointment.appointment_date} has been marked completed.`,
        email: patientContact?.users?.email,
        phone: patientContact?.phone,
        subject: "Consultation Completed - MediCare",
      });
    }

    res.json({ success: true, message: "Appointment marked as completed", appointment });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMyDashboard,
  getMyPatients,
  addConsultationNote,
  getConsultationNotes,
  markAppointmentCompleted,
};
