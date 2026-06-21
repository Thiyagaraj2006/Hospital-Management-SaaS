import api from "./api";

export const appointmentService = {
  listDoctors: (department) =>
    api.get("/doctors", { params: department ? { department } : {} }).then((r) => r.data),

  book: (payload) => api.post("/appointments/book", payload).then((r) => r.data),

  getPatientAppointments: (patientId) =>
    api.get(`/appointments/patient/${patientId}`).then((r) => r.data),

  getDoctorAppointments: (doctorId) =>
    api.get(`/appointments/doctor/${doctorId}`).then((r) => r.data),

  updateStatus: (appointmentId, status) =>
    api.patch(`/appointments/${appointmentId}/status`, { status }).then((r) => r.data),
};
