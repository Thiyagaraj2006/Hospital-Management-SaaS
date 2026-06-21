const supabase = require("../config/supabase");

/**
 * GET /api/admin/stats
 * Returns headline counts + a 7-day appointment trend for the Recharts bar chart.
 */
async function getStats(req, res, next) {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [
      { count: totalPatients },
      { count: totalDoctors },
      { count: totalAppointments },
      { count: todayAppointments },
    ] = await Promise.all([
      supabase.from("patients").select("*", { count: "exact", head: true }),
      supabase.from("doctors").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("appointment_date", today),
    ]);

    // 7-day appointment trend
    const since = new Date();
    since.setDate(since.getDate() - 6);
    const sinceStr = since.toISOString().slice(0, 10);

    const { data: recentAppointments, error: trendErr } = await supabase
      .from("appointments")
      .select("appointment_date")
      .gte("appointment_date", sinceStr);

    if (trendErr) throw trendErr;

    const trendMap = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      trendMap[key] = 0;
    }
    (recentAppointments || []).forEach((a) => {
      if (trendMap[a.appointment_date] !== undefined) trendMap[a.appointment_date]++;
    });

    const appointmentTrends = Object.entries(trendMap).map(([date, count]) => ({ date, count }));

    res.json({
      success: true,
      stats: {
        totalPatients: totalPatients || 0,
        totalDoctors: totalDoctors || 0,
        totalAppointments: totalAppointments || 0,
        todayAppointments: todayAppointments || 0,
      },
      appointmentTrends,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/activity
 * Recent registrations, appointments, and doctor profile updates for the activity feed.
 */
async function getRecentActivity(req, res, next) {
  try {
    const [{ data: newUsers }, { data: newAppointments }] = await Promise.all([
      supabase.from("users").select("id, name, role, created_at").order("created_at", { ascending: false }).limit(5),
      supabase
        .from("appointments")
        .select("id, appointment_date, appointment_time, status, created_at, patients(users!patients_user_id_fkey(name)), doctors(users!doctors_user_id_fkey(name))")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    res.json({
      success: true,
      newRegistrations: newUsers || [],
      newAppointments: newAppointments || [],
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats, getRecentActivity };
