import api from "./api";

export const doctorService = {
  getMyDashboard: () => api.get("/doctors/me/dashboard").then((r) => r.data),
  getMyPatients: () => api.get("/doctors/me/patients").then((r) => r.data),
  addNote: (appointmentId, notes) =>
    api.post(`/doctors/appointments/${appointmentId}/notes`, { notes }).then((r) => r.data),
  getNotes: (appointmentId) =>
    api.get(`/doctors/appointments/${appointmentId}/notes`).then((r) => r.data),
  markCompleted: (appointmentId) =>
    api.patch(`/doctors/appointments/${appointmentId}/complete`).then((r) => r.data),
};
