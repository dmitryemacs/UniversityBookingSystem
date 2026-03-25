import api from './api';

export const equipmentService = {
  getAll: async () => {
    const response = await api.get('/equipment');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/equipment/${id}`);
    return response.data;
  },

  getAvailable: async (startTime, endTime) => {
    const params = {};
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    const response = await api.get('/equipment/available', { params });
    return response.data;
  },

  create: async (equipmentData) => {
    const response = await api.post('/equipment', equipmentData);
    return response.data;
  },

  update: async (id, equipmentData) => {
    const response = await api.put(`/equipment/${id}`, equipmentData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/equipment/${id}`);
    return response.data;
  },
};
