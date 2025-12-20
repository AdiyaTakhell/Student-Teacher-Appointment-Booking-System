import apiClient from "./client";

export const authService = {
  login: (email, password) => apiClient.post("/auth/login", { email, password }),
  register: (data) => apiClient.post("/auth/register", data),
  getProfile: () => apiClient.get("/auth/profile"),
  getTeachers: () => apiClient.get("/auth/teachers"), 
  changePassword: (data) => apiClient.post("/auth/change-password", data),
};

export const appointmentService = {
  create: (data) => apiClient.post("/appointments", data),
  getAll: (params) => apiClient.get("/appointments", { params }), 
  updateStatus: (id, status) => apiClient.put(`/appointments/${id}/status`, { status }),
};

export const adminService = {
  getStats: () => apiClient.get("/admin/stats"),
  getAllTeachers: () => apiClient.get("/admin/teachers"),
  approveTeacher: (id) => apiClient.put(`/admin/teachers/${id}/approve`),
  deleteTeacher: (id) => apiClient.delete(`/admin/teachers/${id}`),
};

