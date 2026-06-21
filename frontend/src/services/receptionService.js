import api from "./api";

export const receptionService = {
  registerWalkIn: (payload) => api.post("/reception/walkin", payload).then((r) => r.data),
  getTodayTokens: (doctorId) =>
    api.get("/reception/tokens/today", { params: doctorId ? { doctor_id: doctorId } : {} }).then((r) => r.data),
};
