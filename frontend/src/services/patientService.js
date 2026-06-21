import api from "./api";

export const patientService = {
  getMyProfile: () => api.get("/patients/me").then((r) => r.data),
  updateMyProfile: (payload) => api.put("/patients/me", payload).then((r) => r.data),
};
