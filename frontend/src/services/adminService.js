import api from "./api";

export const adminService = {
  getStats: () => api.get("/admin/stats").then((r) => r.data),
  getActivity: () => api.get("/admin/activity").then((r) => r.data),
};
