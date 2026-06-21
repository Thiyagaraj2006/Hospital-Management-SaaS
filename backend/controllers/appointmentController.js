const supabase = require("../config/supabase");
const { notify } = require("../services/notificationService");

/**
 * GET /api/doctors
 * Public list of doctors (joined with user name/email) for the booking UI.
 * Optional query: ?department=Cardiology
 */
async function listDoctors(req, res, next) {
  try {
    const { department } = req.query;

    let query = supabase
      .from("doctors")
      .select("id, specialization, department, experience, phone, photo_url, users!doctors_user_id_fkey(name, email)");

    if (department) {
      query = query.eq("department", department);
    }

    const { data, error } = await query;
    if (error) throw error;

    const doctors = (data || []).map((d) => ({
      id: d.id,
      name: d.users?.name,
      email: d.users?.email,
      specialization: d.specialization,
      department: d.department,
      experience: d.experience,
      phone: d.phone,
      photo_url: d.photo_url,
    }));

    res.json({ success: true, doctors });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/appointments/book
 * body: { doctor_id, appointment_date, appointment_time }
 * Requires: verifyToken (patient)
 */
async function bookAppointment(req, res, next) {
  try {
    const { doctor_id, appointment_date, appointment_time } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ success: false, message: "doctor_id, appointment_date and appointment_time are required" });
    }

    const { data: patient, error: patientErr } = await supabase
      .from("patients")
      .select("id")
      .eq("user_id", req.user.id)
      .maybeSingle();

    if (patientErr) throw patientErr;
    if (!patient) {
      return res.status(400).json({ success: false, message: "Patient profile not found for this account" });
    }

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: patient.id,
        doctor_id,
        appointment_date,
        appointment_time,
        status: "pending",
        source: "online",
      })
      .select()
      .single();

    if (error) throw error;

    // Fetch doctor's linked user for name/email/notification, and patient's own contact info
    const { data: doctorRow } = await supabase
      .from("doctors")
      .select("user_id, users!doctors_user_id_fkey(name, email)")
      .eq("id", doctor_id)
      .maybeSingle();

    const { data: patientContact } = await supabase
      .from("patients")
      .select("phone, users!patients_user_id_fkey(email, name)")
      .eq("id", patient.id)
      .maybeSingle();

    const doctorName = doctorRow?.users?.name || "your doctor";
    const message = `Your appointment with Dr. ${doctorName} on ${appointment_date} at ${appointment_time} has been booked and is pending confirmation.`;

    await notify({
      userId: req.user.id,
      message,
      email: patientContact?.users?.email,
      phone: patientContact?.phone,
      subject: "Appointment Booked - MediCare",
    });

    // Notify the doctor too (in-app only, no email/whatsapp spam)
    if (doctorRow?.user_id) {
      await notify({
        userId: doctorRow.user_id,
        message: `New appointment booked by ${patientContact?.users?.name || "a patient"} on ${appointment_date} at ${appointment_time}.`,
      });
    }

    res.status(201).json({ success: true, message: "Appointment booked", appointment });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/appointments/patient/:id
 * :id = patients.id (not user id)
 */
async function getPatientAppointments(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("appointments")
      .select(
        "*, doctors(id, specialization, department, users!doctors_user_id_fkey(name))"
      )
      .eq("patient_id", id)
      .order("appointment_date", { ascending: false });

    if (error) throw error;

    res.json({ success: true, appointments: data || [] });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/appointments/doctor/:id
 * :id = doctors.id (not user id)
 */
async function getDoctorAppointments(req, res, next) {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("appointments")
      .select(
        "*, patients(id, phone, age, gender, blood_group, users!patients_user_id_fkey(name, email))"
      )
      .eq("doctor_id", id)
      .order("appointment_date", { ascending: false });

    if (error) throw error;

    res.json({ success: true, appointments: data || [] });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/appointments/:id/status
 * body: { status } -> one of pending | confirmed | completed | cancelled
 */
async function updateAppointmentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `status must be one of ${validStatuses.join(", ")}` });
    }

    const { data: appointment, error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!appointment) return res.status(404).json({ success: false, message: "Appointment not found" });

    // Notify the patient of the status change
    const { data: patientContact } = await supabase
      .from("patients")
      .select("user_id, phone, users!patients_user_id_fkey(email)")
      .eq("id", appointment.patient_id)
      .maybeSingle();

    if (patientContact?.user_id) {
      await notify({
        userId: patientContact.user_id,
        message: `Your appointment on ${appointment.appointment_date} at ${appointment.appointment_time} is now ${status}.`,
        email: patientContact?.users?.email,
        phone: patientContact?.phone,
        subject: "Appointment Status Updated - MediCare",
      });
    }

    res.json({ success: true, message: "Status updated", appointment });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listDoctors,
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
};
